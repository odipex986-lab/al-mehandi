import { useState } from "react";
import { Layout } from "@/components/layout";
import { combos } from "@/data/products";
import { useRoute, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { Package, MapPin, Phone, User, CheckCircle2, AlertCircle } from "lucide-react";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  whatsapp: z.string().min(10, "Valid WhatsApp number is required"),
  address: z.string().min(5, "Complete address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(4, "Pincode is required"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, params] = useRoute("/checkout/:comboId");
  const [, setLocation] = useLocation();
  const comboId = parseInt(params?.comboId || "0");
  const combo = combos.find(c => c.comboId === comboId);

  const { mutate: createOrder, isPending, isError, error } = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data: CheckoutFormValues) => {
    if (!combo) return;
    
    createOrder({
      data: {
        comboId: combo.comboId,
        comboName: combo.name,
        price: combo.price,
        ...data,
      }
    }, {
      onSuccess: (order) => {
        setLocation(`/payment/${order.id}?comboId=${combo.comboId}`);
      }
    });
  };

  if (!combo) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-destructive mb-2">Combo Not Found</h2>
            <p className="text-muted-foreground mb-6">The selected product combo does not exist.</p>
            <button onClick={() => setLocation('/')} className="text-primary hover:underline">
              Return Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order Summary */}
          <div className="lg:col-span-4 lg:order-2 sticky top-28">
            <div className="bg-card rounded-2xl p-6 shadow-xl border border-primary/10">
              <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <Package className="w-5 h-5 text-primary" />
                Order Summary
              </h3>
              
              <div className="p-4 bg-background rounded-xl border border-border mb-4">
                <h4 className="font-bold text-lg text-foreground">{combo.name}</h4>
                <ul className="mt-3 space-y-2">
                  {combo.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t border-border">
                <span className="text-muted-foreground font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{combo.price}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-8 lg:order-1">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl border border-primary/10">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">Customer Details</h2>
              
              {isError && (
                <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Failed to create order. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-foreground/90 border-b border-border pb-2">
                    <User className="w-5 h-5 text-primary" /> Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name *</label>
                    <input 
                      {...register("fullName")}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number *</label>
                      <input 
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        WhatsApp Number * <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-2">Required</span>
                      </label>
                      <input 
                        {...register("whatsapp")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="WhatsApp number"
                      />
                      {errors.whatsapp && <p className="mt-1 text-sm text-destructive">{errors.whatsapp.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Address Info */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-foreground/90 border-b border-border pb-2">
                    <MapPin className="w-5 h-5 text-primary" /> Delivery Details
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Address *</label>
                    <textarea 
                      {...register("address")}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="House/Flat No, Street, Landmark"
                    />
                    {errors.address && <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">City *</label>
                      <input 
                        {...register("city")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="City"
                      />
                      {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">State *</label>
                      <input 
                        {...register("state")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="State"
                      />
                      {errors.state && <p className="mt-1 text-sm text-destructive">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Pincode *</label>
                      <input 
                        {...register("pincode")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="6-digit PIN"
                      />
                      {errors.pincode && <p className="mt-1 text-sm text-destructive">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Additional */}
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Order Notes (Optional)</label>
                    <textarea 
                      {...register("notes")}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="Any specific instructions for delivery"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    {isPending ? "Processing..." : "Proceed to Payment"}
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Your details are secure. Payment will be processed via UPI.
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
