import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Process } from "@/components/Process";
import { CaseStudies } from "@/components/CaseStudies";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { getLandingTestimonials } from "@/lib/site-testimonials";

export default async function Home() {
  const testimonials = await getLandingTestimonials();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground font-sans overflow-x-hidden">
      <main>
        <Hero />
        <About />
        <Services />
        <WhyUs />
        <Process />
        <CaseStudies />
        <Testimonials testimonials={testimonials} />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
