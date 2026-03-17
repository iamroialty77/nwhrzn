import type { Metadata } from "next";
import { CTA } from "@/components/CTA";
import { PageIntro } from "@/components/PageIntro";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Services | NWHRZN",
  description: "Explore NWHRZN's digital marketing services, from strategy and content to execution built for measurable growth.",
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow="Services"
        title="Performance-focused services designed to move your brand forward"
        description="From social media management to short-form video, content, and strategy, our offers are structured to support awareness, engagement, and conversion."
      />
      <Services />
      <Process />
      <CTA />
    </SiteShell>
  );
}
