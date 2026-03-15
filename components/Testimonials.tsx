"use client";

import { motion } from "framer-motion";

type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
};

type TestimonialsProps = {
  testimonials: TestimonialItem[];
};

export const Testimonials = ({ testimonials }: TestimonialsProps) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
      <div className="text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-black tracking-[0.3em] text-accent uppercase"
        >
          Testimonials
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-4xl font-black tracking-tighter md:text-6xl"
        >
          Trusted by <span className="text-gradient">growing</span> businesses
        </motion.h2>
      </div>

      <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, idx) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative rounded-[40px] border border-border bg-muted/20 p-12 transition-all hover:bg-muted/40 hover:border-accent/20 group"
          >
            <div className="text-6xl text-accent opacity-20 font-serif absolute top-8 left-10 leading-none group-hover:opacity-40 transition-opacity">
                &ldquo;
            </div>
            <p className="relative text-xl font-medium italic text-foreground leading-relaxed">
              &quot;{item.quote}&quot;
            </p>
            <div className="mt-12 flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center text-accent font-black">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-black text-white tracking-tight">{item.name}</p>
                <p className="text-sm font-bold text-accent uppercase tracking-widest mt-1">Verified Client</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
