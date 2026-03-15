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
        "fixed inset-x-0 top-3 z-50 px-4 transition-all duration-300 sm:px-6",
        isScrolled
          ? "py-2"
          : "py-3"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/70 px-6 lg:px-8",
          isScrolled ? "bg-background/88 py-2.5 shadow-xl shadow-black/20 backdrop-blur-md" : "bg-background/72 py-3 backdrop-blur-md"
        )}
      >
        <div className="flex items-center">
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-black tracking-tight sm:text-2xl"
          >
            NWHRZN
          </motion.p>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-9 text-sm font-semibold tracking-wide text-foreground md:flex">
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

        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="hidden rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:border-accent hover:text-accent xl:block"
          >
            Admin
          </a>
          <a
            href="mailto:roi@nwhrzn.digital"
            className="hidden rounded-full px-4 py-1.5 text-xs font-bold transition-colors hover:text-accent xl:block"
          >
            Contact Us
          </a>
          <a
            href="/book-call"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition-all hover:scale-105 hover:bg-white hover:shadow-xl hover:shadow-accent/20 active:scale-95"
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
                href="/admin"
                className="text-lg font-bold text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </a>
              <a
                href="mailto:roi@nwhrzn.digital"
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
