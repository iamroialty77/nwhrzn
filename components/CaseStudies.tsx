"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { caseStudies } from "@/constants";

export const CaseStudies = () => {
  return (
    <section id="case-studies" className="bg-muted/30 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-sm font-black tracking-[0.3em] text-accent uppercase">Case Studies</span>
            <h2 className="mt-6 text-4xl font-black tracking-tighter md:text-6xl">Selected client outcomes</h2>
          </div>
          <a href="#contact" className="text-lg font-bold text-accent hover:underline flex items-center gap-2 mb-2 group">
            View all projects <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
        <div className="mt-20 grid gap-10 lg:grid-cols-3">
          {caseStudies.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group overflow-hidden rounded-[40px] border border-border bg-background transition-all hover:border-accent/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-6 left-8">
                    <span className="text-3xl font-black text-accent tracking-tighter">{item.result}</span>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-5 text-lg font-medium text-muted-foreground leading-relaxed">
                    {item.summary}
                </p>
                <div className="mt-8 pt-8 border-t border-border flex items-center gap-2 text-sm font-black uppercase tracking-widest text-accent">
                    Read Full Story <span className="transition-transform group-hover:translate-x-2">→</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
