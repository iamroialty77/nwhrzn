"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { pageGroups } from "@/constants";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-20 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-accent shadow-lg shadow-accent/20" />
              <p className="text-2xl font-black tracking-tighter">NWHRZN</p>
            </div>
            <p className="mt-6 max-w-xs text-lg text-muted-foreground leading-relaxed font-medium">
              Philippines-based digital marketing agency delivering strategic,
              creative, and measurable growth campaigns.
            </p>
            <div className="mt-8 flex gap-5">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:scale-110 hover:bg-accent hover:text-accent-foreground"
                  aria-label={`Social Media ${i + 1}`}
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16">
            {pageGroups.map((group) => (
              <div key={group.category} className="min-w-[120px]">
                <p className="text-sm font-black tracking-widest text-foreground uppercase">{group.category}</p>
                <ul className="mt-6 space-y-4 text-sm font-medium text-muted-foreground">
                  {group.pages.map((page) => (
                    <li key={page}>
                      <a href="#" className="transition-colors hover:text-accent">
                        {page}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-24 flex flex-col justify-between border-t border-border pt-12 md:flex-row items-center gap-6">
          <p className="text-sm font-medium text-muted-foreground order-2 md:order-1">
            © {new Date().getFullYear()} NWHRZN. All rights reserved.
          </p>
          <div className="flex gap-10 text-sm font-bold text-muted-foreground order-1 md:order-2">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
