"use client";

import { motion } from "framer-motion";
import { differentiators } from "@/constants";

export const WhyUs = () => {
  return (
    <section className="bg-muted py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <span className="text-sm font-black tracking-[0.3em] text-accent uppercase">Why NWHRZN</span>
            <h2 className="mt-6 text-4xl font-black tracking-tighter md:text-6xl leading-tight">
              What makes us <span className="text-gradient">different</span>
            </h2>
            <p className="mt-8 text-xl font-medium text-muted-foreground leading-relaxed">
              We don&apos;t just post content — we build strategies that move the needle for your brand.
            </p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:w-2/3">
            {differentiators.map((item, idx) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl border border-border bg-background p-10 shadow-sm transition-all hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 group"
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <span className="font-black">0{idx + 1}</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-5 text-lg font-medium text-muted-foreground leading-relaxed">
                    {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
