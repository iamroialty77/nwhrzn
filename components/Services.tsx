"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { services } from "@/constants";

export const Services = () => {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
      <div className="text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-black tracking-[0.3em] text-accent uppercase"
        >
          What We Do
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-4xl font-black tracking-tighter md:text-6xl"
        >
          Services built for <span className="text-gradient">digital growth</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-xl font-medium text-muted-foreground"
        >
          Comprehensive digital marketing solutions tailored to your business needs.
        </motion.p>
      </div>

      <div className="mt-24 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, idx) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative flex flex-col overflow-hidden rounded-[32px] border border-border bg-muted/20 transition-all hover:-translate-y-2 hover:bg-muted/40 hover:shadow-2xl hover:shadow-accent/5"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-muted/95 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
              <div className="absolute bottom-6 left-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent backdrop-blur-md transition-all group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-110">
                <span className="text-lg font-black">{idx + 1}</span>
              </div>
            </div>
            <div className="flex flex-col p-10 pt-8">
              <h3 className="text-2xl font-black tracking-tight group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="mt-5 flex-grow text-lg font-medium text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <div className="mt-10 flex items-center gap-3 text-sm font-black text-accent uppercase tracking-widest">
                Explore service <span className="transition-transform group-hover:translate-x-2">→</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
