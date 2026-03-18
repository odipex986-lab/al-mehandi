import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmed() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="max-w-xl w-full bg-card rounded-3xl p-10 shadow-2xl border border-primary/10 text-center relative overflow-hidden"
        >
          {/* Confetti-like background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Order Submitted!</h1>
          
          <div className="bg-background rounded-2xl p-6 border border-border mb-8">
            <p className="text-lg text-foreground leading-relaxed">
              Your order has been submitted successfully.
            </p>
            <p className="text-muted-foreground mt-4">
              Our team will verify the payment screenshot. You will receive a confirmation message on your WhatsApp number after verification.
            </p>
          </div>
          
          <Link 
            href="/"
            className="inline-block px-8 py-3 rounded-xl font-bold text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
