"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
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
          <Link href="/">
            <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-black tracking-tight sm:text-2xl"
            >
              NWHRZN
            </motion.p>
          </Link>
        </div>

        <nav className="hidden items-center gap-9 text-sm font-semibold tracking-wide text-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              className={cn(
                "transition-colors hover:text-accent",
                pathname === link.href ? "text-accent" : "text-foreground"
              )}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:border-accent hover:text-accent xl:block"
          >
            Admin
          </Link>
          <Link
            href="/contact"
            className="hidden rounded-full px-4 py-1.5 text-xs font-bold transition-colors hover:text-accent xl:block"
          >
            Contact Us
          </Link>
          <a
            href="mailto:roi@nwhrzn.digital"
            className="hidden rounded-full px-4 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-accent 2xl:block"
          >
            Email
          </a>
          <Link
            href="/book-call"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition-all hover:scale-105 hover:bg-white hover:shadow-xl hover:shadow-accent/20 active:scale-95"
          >
            Book a Call
          </Link>

          <button 
            className="block md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

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
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-lg font-bold",
                    pathname === link.href ? "text-accent" : "text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-border" />
              <Link
                href="/admin"
                className="text-lg font-bold text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
              <Link
                href="/book-call"
                className="text-lg font-bold text-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book a Call
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
