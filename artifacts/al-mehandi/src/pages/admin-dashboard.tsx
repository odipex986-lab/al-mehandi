import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  useAdminGetOrders, 
  useAdminUpdateOrderStatus, 
  useAdminExportOrders,
  useAdminUploadQr,
  useAdminLogout
} from "@workspace/api-client-react";
import { combos } from "@/data/products";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  LogOut, Search, Download, Image as ImageIcon, 
  Upload, QrCode, LayoutDashboard, ChevronDown
} from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const hasSession = typeof window !== "undefined" && !!localStorage.getItem("admin_session_id");

  useEffect(() => {
    if (!hasSession) {
      setLocation("/admin/login");
    }
  }, [hasSession]);

  // Handlers for search typing with rough debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Real app would use a proper debounce hook
    setTimeout(() => setDebouncedSearch(e.target.value), 500);
  };

  const { data: orders = [], isLoading } = useAdminGetOrders({ search: debouncedSearch });
  const { mutate: updateStatus } = useAdminUpdateOrderStatus();
  const { mutate: exportCsv, isPending: isExporting } = useAdminExportOrders();
  const { mutate: uploadQr } = useAdminUploadQr();
  const { mutate: logout } = useAdminLogout();

  const handleStatusChange = (orderId: number, status: any) => {
    updateStatus(
      { orderId, data: { status } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] }) }
    );
  };

  const handleExport = () => {
    exportCsv(undefined, {
      onSuccess: (csvData) => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `al-mehandi-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
      }
    });
  };

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        localStorage.removeItem("admin_session_id");
        setLocation("/admin/login");
      }
    });
  };

  // QR Upload component
  const QrUploadCard = ({ comboId, name }: { comboId: number, name: string }) => {
    const fileInput = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setUploading(true);
      uploadQr({ comboId, data: { qr: file } }, {
        onSuccess: () => {
          alert(`QR uploaded for ${name}`);
          setUploading(false);
        },
        onError: () => {
          alert(`Failed to upload QR for ${name}`);
          setUploading(false);
        }
      });
    };

    return (
      <div className="bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
        <h4 className="font-medium text-sm mb-3 text-foreground">{name}</h4>
        <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={onFileChange} />
        <button 
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
        >
          {uploading ? <Upload className="w-4 h-4 animate-bounce" /> : <QrCode className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Upload QR"}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="font-serif font-bold text-xl text-foreground">Al Mehandi Admin</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
        
        {/* QR Management Section */}
        <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" /> Payment QR Codes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {combos.map(combo => (
              <QrUploadCard key={combo.comboId} comboId={combo.comboId} name={combo.name} />
            ))}
          </div>
        </section>

        {/* Orders Section */}
        <section className="bg-card rounded-2xl shadow-sm border border-border flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground">Orders Management</h2>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search phone or name..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-64"
                />
              </div>
              
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-background text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Combo</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Screenshot</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">No orders found.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">#{order.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{order.fullName}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={order.address}>
                          {order.city}, {order.state}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span>{order.phone}</span>
                          <span className="text-xs text-green-600 flex items-center gap-1">WA: {order.whatsapp}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                          {order.comboName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">₹{order.price}</td>
                      <td className="px-6 py-4">
                        {order.screenshotUrl ? (
                          <a 
                            href={order.screenshotUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                          >
                            <ImageIcon className="w-3 h-3" /> View
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`appearance-none bg-transparent pr-8 py-1.5 pl-3 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 cursor-pointer
                              ${order.status === 'pending_verification' ? 'border-orange-200 text-orange-700 bg-orange-50' : ''}
                              ${order.status === 'payment_verified' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                              ${order.status === 'order_confirmed' ? 'border-green-200 text-green-700 bg-green-50' : ''}
                              ${order.status === 'cancelled' ? 'border-red-200 text-red-700 bg-red-50' : ''}
                            `}
                          >
                            <option value="pending_verification">Pending Verification</option>
                            <option value="payment_verified">Payment Verified</option>
                            <option value="order_confirmed">Order Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
