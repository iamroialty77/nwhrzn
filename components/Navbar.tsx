"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "Case Studies", href: "#case-studies" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-blue-500 shadow-lg shadow-accent/20" 
          />
          <p className="text-2xl font-black tracking-tighter">NWHRZN</p>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-10 text-sm font-semibold tracking-wide text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              className="transition-colors hover:text-accent"
              href={link.href}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="mailto:hello@nwhrzn.com"
            className="hidden rounded-full px-5 py-2 text-sm font-bold transition-colors hover:text-accent sm:block"
          >
            Contact Us
          </a>
          <a
            href="#contact"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-black text-accent-foreground transition-all hover:scale-105 hover:bg-white hover:shadow-xl hover:shadow-accent/20 active:scale-95"
          >
            Book a Call
          </a>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="block md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-border" />
              <a
                href="mailto:hello@nwhrzn.com"
                className="text-lg font-bold text-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
