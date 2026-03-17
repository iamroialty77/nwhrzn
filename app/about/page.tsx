import type { Metadata } from "next";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { PageIntro } from "@/components/PageIntro";
import { Process } from "@/components/Process";
import { SiteShell } from "@/components/SiteShell";
import { WhyUs } from "@/components/WhyUs";
import { getLandingWhyUsContent } from "@/lib/site-differentiators";

export const metadata: Metadata = {
  title: "About Us | NWHRZN",
  description: "Learn how NWHRZN blends strategy, creative execution, and remote collaboration to grow modern brands.",
};

export default async function AboutPage() {
  const whyUsContent = await getLandingWhyUsContent();

  return (
    <SiteShell>
      <PageIntro
        eyebrow="About NWHRZN"
        title="A strategic digital partner built for modern brand growth"
        description="We help ambitious businesses turn scattered marketing activity into a focused, measurable growth system with clear execution and strong creative direction."
      />
      <About />
      <WhyUs content={whyUsContent} />
      <Process />
      <CTA />
    </SiteShell>
  );
}
