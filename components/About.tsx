"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const About = () => {
  return (
    <section id="about" className="border-y border-border bg-muted/20 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-black tracking-[0.3em] text-accent uppercase">About Us</span>
            <h2 className="mt-6 text-4xl font-black tracking-tighter md:text-6xl leading-tight">
              We build brands that <span className="text-gradient">stand out</span> online
            </h2>
            <div className="mt-10 space-y-8 text-xl font-medium text-muted-foreground leading-relaxed">
              <p>
                NWHRZN is a Philippines-based digital marketing agency helping
                businesses build a strong, lasting online presence. We combine
                data-driven strategy with creative execution to help you reach the
                right people and stay competitive.
              </p>
              <p>
                From concept to content, we work fully online with clients,
                handling everything with clear communication and results-focused
                thinking.
              </p>
            </div>
            <div className="mt-12">
              <motion.span 
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center rounded-2xl bg-accent/10 px-6 py-3 text-sm font-black text-accent border border-accent/20 shadow-lg shadow-accent/5"
              >
                Remote-First Agency — Global reach, local expertise
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-[40px] border border-border bg-muted group">
              <Image
                src="/Owner.png"
                alt="Owner of NWHRZN"
                fill
                className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-10 -left-6 right-6 rounded-3xl border border-border bg-background/80 p-8 backdrop-blur-xl shadow-2xl"
            >
               <p className="text-xl font-bold leading-tight text-white italic">
                  &quot;Our mission is to help brands reach their next horizon through innovation and data.&quot;
               </p>
               <div className="mt-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-blue-500 shadow-lg shadow-accent/20" />
                  <div>
                    <p className="font-black text-white text-lg tracking-tight">Team NWHRZN</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Strategic Partners</p>
                  </div>
               </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 -z-10 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
