import { ReactNode } from "react";
import { Link } from "wouter";
import { Instagram, Phone, Mail } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Subtle Background Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{ 
          backgroundImage: `url(${import.meta.env.BASE_URL}images/mehndi-bg.png)`,
          backgroundSize: '400px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 sticky top-0 w-full backdrop-blur-md bg-background/80 border-b border-primary/10 shadow-sm shadow-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="Al Mehandi Logo" 
                className="h-10 w-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-serif text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                Al Mehandi
              </span>
            </Link>
            <nav className="hidden md:flex gap-8">
              <Link href="/" className="text-foreground/80 hover:text-primary font-medium transition-colors">Home</Link>
              <a href="#contact" className="text-foreground/80 hover:text-primary font-medium transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer id="contact" className="relative z-10 bg-primary/5 border-t border-primary/10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-xl font-bold text-primary mb-2">Al Mehandi</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Providing premium henna and nail cones with authentic, rich colors for your special occasions.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <a 
              href="https://instagram.com/al_mehandi_" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Instagram className="h-4 w-4" />
              </div>
              <span>@al_mehandi_</span>
            </a>
            <a 
              href="https://wa.me/918136917338" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-4 w-4" />
              </div>
              <span>+91 8136917338</span>
            </a>
            <a 
              href="mailto:almehandi1@gmail.com" 
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-4 w-4" />
              </div>
              <span>almehandi1@gmail.com</span>
            </a>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-primary/10 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Al Mehandi. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/admin/login" className="text-primary/60 hover:text-primary text-xs transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
