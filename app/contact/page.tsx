import type { Metadata } from "next";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Contact | NWHRZN",
  description: "Start a conversation with NWHRZN about your digital marketing goals, timeline, and next growth priorities.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow="Contact"
        title="Let’s plan the next horizon for your brand"
        description="Tell us what you need, what you are trying to improve, and where your current marketing feels stuck. We’ll respond with the clearest next step."
      />
      <CTA />
      <FAQ />
    </SiteShell>
  );
}
