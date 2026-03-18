import { useState, useRef } from "react";
import { Layout } from "@/components/layout";
import { combos } from "@/data/products";
import { useRoute, useLocation } from "wouter";
import { useGetQrCode, useUploadPaymentScreenshot } from "@workspace/api-client-react";
import { ShieldCheck, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Payment() {
  const [, params] = useRoute("/payment/:orderId");
  const [, setLocation] = useLocation();
  const orderId = parseInt(params?.orderId || "0");
  
  // Extract comboId from URL params (added in checkout redirect)
  const searchParams = new URLSearchParams(window.location.search);
  const comboId = parseInt(searchParams.get("comboId") || "0");
  
  const combo = combos.find(c => c.comboId === comboId);

  const { data: qrData, isLoading: qrLoading } = useGetQrCode(comboId, {
    query: { enabled: !!comboId }
  });
  
  const { mutate: uploadScreenshot, isPending: isUploading } = useUploadPaymentScreenshot();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !orderId) return;
    
    uploadScreenshot({
      orderId,
      data: { screenshot: selectedFile }
    }, {
      onSuccess: () => {
        setLocation('/order-confirmed');
      },
      onError: (err) => {
        console.error("Upload failed", err);
        alert("Failed to upload screenshot. Please try again.");
      }
    });
  };

  if (!combo || !orderId) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <p className="text-xl text-muted-foreground mb-4">Invalid Payment Request</p>
          <button onClick={() => setLocation('/')} className="text-primary underline">Return Home</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 md:p-10 shadow-2xl border border-primary/10"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Complete Payment</h1>
            <p className="text-muted-foreground">Scan the QR code below using any UPI app.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: Product & Amount */}
            <div className="space-y-6 order-2 md:order-1">
              <div className="p-6 bg-background rounded-2xl border border-border">
                <h3 className="font-bold text-lg text-foreground mb-4 pb-4 border-b border-border">Order Details</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium text-foreground">{combo.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-medium text-foreground">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
                  <span className="font-medium">Total Amount Payable</span>
                  <span className="text-3xl font-bold text-primary">₹{combo.price}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 text-primary rounded-xl">
                <ShieldCheck className="w-6 h-6 shrink-0" />
                <p className="text-sm font-medium leading-relaxed">
                  100% Secure Payment. After making the payment, please upload the screenshot below for verification.
                </p>
              </div>
            </div>

            {/* Right: QR Code */}
            <div className="flex flex-col items-center order-1 md:order-2">
              <div className="w-full max-w-[280px] aspect-square bg-white rounded-2xl shadow-lg border border-border p-4 flex items-center justify-center relative overflow-hidden">
                {qrLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : qrData?.imageUrl ? (
                  <img src={qrData.imageUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground text-sm">QR Code not available right now.</p>
                    <p className="text-xs mt-2">Please contact +91 8136917338 to complete payment.</p>
                  </div>
                )}
              </div>
              <p className="mt-4 font-medium text-foreground/80 flex items-center gap-2">
                Pay using GPay, PhonePe, Paytm
              </p>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-border">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground">Upload Payment Screenshot</h3>
            
            <div className="max-w-md mx-auto">
              {!selectedFile ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-colors text-center group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground mb-1">Click to upload screenshot</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              ) : (
                <div className="bg-background border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-full h-full p-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="text-xs font-medium text-destructive hover:underline px-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full mt-6 py-4 rounded-xl font-bold text-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUploading ? "Uploading..." : "Submit Order"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
