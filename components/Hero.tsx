"use client";

import { motion } from "framer-motion";
import { metrics } from "@/constants";

export const Hero = () => {
  return (
    <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pt-36 pb-24 text-center md:pt-48 md:pb-32 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute top-[20%] -right-[10%] -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-xs font-black tracking-widest text-accent uppercase"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent"></span>
        </span>
        Philippines-Based Digital Marketing Agency
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-10 max-w-5xl text-5xl font-black tracking-tighter md:text-7xl lg:text-9xl leading-[0.9]"
      >
        Taking your brand to <span className="text-gradient">NWHRZN</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 max-w-3xl text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl"
      >
        Strategic marketing solutions designed to increase brand awareness,
        engage audiences, and drive real business growth — data-driven
        strategies with creative execution.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-14 flex flex-col items-center gap-5 sm:flex-row"
      >
        <a
          href="#contact"
          className="rounded-full bg-accent px-10 py-5 text-lg font-black text-accent-foreground transition-all hover:scale-105 hover:bg-white hover:shadow-2xl hover:shadow-accent/30 active:scale-95"
        >
          Get a Free Consultation
        </a>
        <a
          href="#services"
          className="rounded-full border-2 border-border bg-white/5 px-10 py-5 text-lg font-bold backdrop-blur-sm transition-all hover:bg-white/10"
        >
          View Our Services
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-24 w-full max-w-5xl rounded-3xl border border-border bg-muted/40 p-10 backdrop-blur-sm"
      >
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center gap-2">
              <span className="text-4xl font-black tracking-tighter text-white md:text-5xl">
                {metric.value}
              </span>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
