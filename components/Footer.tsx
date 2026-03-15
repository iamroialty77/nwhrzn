"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { pageGroups } from "@/constants";

export const Footer = () => {
  const socialLinks = [
    { Icon: Facebook, href: "#", label: "Facebook", className: "bg-[#1877F2] hover:bg-[#1668d8]" },
    {
      Icon: Instagram,
      href: "#",
      label: "Instagram",
      className:
        "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:brightness-110",
    },
    { Icon: Twitter, href: "#", label: "Twitter", className: "bg-[#1DA1F2] hover:bg-[#0d8dd8]" },
    { Icon: Linkedin, href: "#", label: "LinkedIn", className: "bg-[#0A66C2] hover:bg-[#08539d]" },
  ];

  return (
    <footer className="border-t border-border bg-background pt-24 pb-12">
      <aside className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <div className="pointer-events-auto flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/75 p-3 shadow-xl backdrop-blur-md">
          {socialLinks.map(({ Icon, href, label, className }) => (
            <a
              key={label}
              href={href}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-white transition-all hover:-translate-y-0.5 ${className}`}
              aria-label={label}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </aside>

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
            <div className="mt-8 flex gap-5 lg:hidden">
              {socialLinks.map(({ Icon, href, label, className }) => (
                <a
                  key={label}
                  href={href}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-white transition-all hover:scale-110 ${className}`}
                  aria-label={label}
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
