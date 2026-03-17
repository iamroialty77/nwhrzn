import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground selection:bg-accent selection:text-accent-foreground">
      <Navbar />
      <main className="pt-24 md:pt-28">{children}</main>
      <Footer />
    </div>
  );
}
