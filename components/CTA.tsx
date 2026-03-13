"use client";

import { motion } from "framer-motion";

export const CTA = () => {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[60px] bg-accent px-10 py-24 text-accent-foreground text-center md:px-24 md:py-32"
      >
        {/* Background shapes */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/10 blur-3xl" />
        
        <h2 className="relative text-5xl font-black tracking-tighter md:text-8xl leading-[0.9]">
          Ready to take your brand to <span className="opacity-60">NWHRZN</span>?
        </h2>
        <p className="relative mx-auto mt-10 max-w-2xl text-xl font-bold opacity-90 md:text-2xl">
          Share your goals with us and we&apos;ll build a strategy, timeline,
          and plan that fits your business.
        </p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative mt-16 flex flex-col justify-center gap-6 sm:flex-row"
        >
          <a
            href="mailto:hello@nwhrzn.com"
            className="rounded-full bg-background px-12 py-6 text-xl font-black text-foreground transition-all hover:scale-110 hover:shadow-2xl active:scale-95"
          >
            Contact us today
          </a>
          <a
            href="#contact"
            className="rounded-full border-4 border-accent-foreground/10 px-12 py-6 text-xl font-black transition-all hover:bg-white/10"
          >
            Schedule Demo
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
