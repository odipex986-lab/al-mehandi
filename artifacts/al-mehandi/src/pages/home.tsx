import { Layout } from "@/components/layout";
import { combos } from "@/data/products";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight"
            >
              Exquisite Henna For <br/>
              <span className="text-primary italic">Every Occasion</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0"
            >
              Discover our handcrafted henna and nail cone combos. Made with natural ingredients for a rich, long-lasting stain.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <a 
                href="#combos" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Combos
              </a>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] md:aspect-square">
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-henna.png`}
                alt="Beautiful henna art" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl z-[-1]" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl z-[-1]" />
          </motion.div>
        </div>
      </section>

      {/* Combos Section */}
      <section id="combos" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Our Combo Offers</h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full" />
            <p className="mt-4 text-muted-foreground">Select the perfect combo for your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combos.map((combo, index) => (
              <motion.div
                key={combo.comboId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-xl shadow-primary/5 border border-primary/10 hover:border-primary/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Decorative top-right corner */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-300" />
                
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{combo.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-primary">₹{combo.price}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {combo.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={`/checkout/${combo.comboId}`}
                  className="block w-full text-center py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 active:translate-y-0.5 transition-all duration-200"
                >
                  Checkout Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
