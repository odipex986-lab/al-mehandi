import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { mutate: login, isPending, error, isError } = useAdminLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormValues) => {
    login({ data }, {
      onSuccess: (res: any) => {
        if (res.success) {
          if (res.sessionId) {
            localStorage.setItem("admin_session_id", res.sessionId);
          }
          setLocation("/admin");
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{ 
          backgroundImage: `url(${import.meta.env.BASE_URL}images/mehndi-bg.png)`,
          backgroundSize: '300px'
        }}
      />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl border border-primary/20 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">Login to manage Al Mehandi orders</p>
        </div>

        {isError && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive text-sm font-medium rounded-xl text-center border border-destructive/20">
            {(error as any)?.error || "Invalid credentials"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
            <input 
              {...register("username")}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="admin"
            />
            {errors.username && <p className="mt-1 text-sm text-destructive">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input 
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg hover:shadow-xl disabled:opacity-50 transition-all mt-4"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Return to Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}
