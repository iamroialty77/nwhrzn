import type { Metadata } from "next";
import { CaseStudies } from "@/components/CaseStudies";
import { CTA } from "@/components/CTA";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { Testimonials } from "@/components/Testimonials";
import { getLandingTestimonials } from "@/lib/site-testimonials";

export const metadata: Metadata = {
  title: "Testimonials | NWHRZN",
  description: "See what clients say about working with NWHRZN and review selected outcomes across growing brands.",
};

export default async function TestimonialsPage() {
  const testimonials = await getLandingTestimonials();

  return (
    <SiteShell>
      <PageIntro
        eyebrow="Client Proof"
        title="Trusted by growth-minded teams that expect clear results"
        description="Our work is built around measurable progress, sharp communication, and delivery that helps clients make better marketing decisions with confidence."
      />
      <Testimonials testimonials={testimonials} />
      <CaseStudies />
      <CTA />
    </SiteShell>
  );
}
