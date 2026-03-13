"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/constants";

export const Process = () => {
  return (
    <section id="process" className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
      <div className="text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-black tracking-[0.3em] text-accent uppercase"
        >
          Our Process
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-4xl font-black tracking-tighter md:text-6xl"
        >
          Clear workflow, <span className="text-gradient">measurable</span> execution
        </motion.h2>
      </div>

      <div className="mt-24 grid gap-12 md:grid-cols-2 lg:grid-cols-4 relative">
        {/* Horizontal Line for Desktop */}
        <div className="absolute top-12 left-12 right-12 h-0.5 bg-border hidden lg:block -z-10" />
        
        {processSteps.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[32px] border-4 border-accent bg-background text-3xl font-black text-accent shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground">
                {item.step}
              </div>
              <h3 className="mt-10 text-2xl font-black tracking-tight">{item.title}</h3>
              <p className="mt-5 text-lg font-medium text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
