import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Process } from "@/components/Process";
import { CaseStudies } from "@/components/CaseStudies";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { SiteShell } from "@/components/SiteShell";
import { getLandingWhyUsContent } from "@/lib/site-differentiators";
import { getLandingTestimonials } from "@/lib/site-testimonials";

export default async function Home() {
  const [testimonials, whyUsContent] = await Promise.all([
    getLandingTestimonials(),
    getLandingWhyUsContent(),
  ]);

  return (
    <SiteShell>
      <div>
        <Hero />
        <About />
        <Services />
        <WhyUs content={whyUsContent} />
        <Process />
        <CaseStudies />
        <Testimonials testimonials={testimonials} />
        <FAQ />
        <CTA />
      </div>
    </SiteShell>
  );
}
