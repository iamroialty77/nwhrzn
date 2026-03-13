"use client";

import { motion } from "framer-motion";
import { faqs } from "@/constants";

export const FAQ = () => {
  return (
    <section id="faq" className="bg-muted/50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-black tracking-[0.3em] text-accent uppercase"
            >
              FAQ
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl font-black tracking-tighter md:text-6xl"
            >
              Common questions
            </motion.h2>
          </div>
          <div className="mt-20 space-y-6">
            {faqs.map((item, idx) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl border border-border bg-background p-10 transition-all hover:border-accent/40"
              >
                <h3 className="text-xl font-black tracking-tight">{item.question}</h3>
                <p className="mt-5 text-lg font-medium text-muted-foreground leading-relaxed">
                    {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
