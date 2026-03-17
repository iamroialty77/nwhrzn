import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { CTA } from "@/components/CTA";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { getLandingPricingContent } from "@/lib/site-pricing";

export const metadata: Metadata = {
  title: "Pricing | NWHRZN",
  description: "Review NWHRZN pricing plans for social media, content, web development, and marketing bundles.",
};

export default async function PricingPage() {
  const pricing = await getLandingPricingContent();

  return (
    <SiteShell>
      <PageIntro eyebrow={pricing.eyebrow} title={pricing.heading} description={pricing.lead} />

      <section className="px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-16">
          {pricing.categories.map((category) => {
            const plans = pricing.plans.filter((plan) => plan.category === category.key);

            return (
              <section key={category.key} className="space-y-8">
                <div className="max-w-3xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-accent">
                    <Sparkles size={14} />
                    {category.label}
                  </p>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                  {plans.map((plan) => (
                    <article
                      key={plan.id}
                      className={`relative overflow-hidden rounded-[2rem] border p-8 shadow-2xl shadow-black/10 ${
                        plan.badge
                          ? "border-accent/60 bg-gradient-to-b from-accent/10 to-background/90"
                          : "border-border bg-gradient-to-b from-muted/60 to-background/90"
                      }`}
                    >
                      {plan.badge ? (
                        <div className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-accent-foreground">
                          {plan.badge}
                        </div>
                      ) : null}

                      <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{plan.tierLabel}</p>
                      <h2 className="mt-3 text-3xl font-black tracking-tight">{plan.name}</h2>
                      <p className="mt-3 text-2xl font-black text-accent">{plan.price}</p>
                      <p className="mt-5 text-lg font-semibold text-foreground/95">{plan.audience}</p>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>

                      <div className="mt-8 border-t border-border/80 pt-6">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">What&apos;s included</p>
                        <ul className="mt-4 space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90">
                              <span className="mt-0.5 rounded-full bg-accent/15 p-1 text-accent">
                                <Check size={14} />
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        href="/contact#contact"
                        className="mt-8 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-black text-accent-foreground transition-all hover:scale-[1.02] hover:bg-white"
                      >
                        Inquire About {plan.name}
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-border bg-gradient-to-br from-muted/60 to-background/80 p-8">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-accent">{pricing.guaranteeTitle}</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {pricing.guarantees.map((item) => (
                  <li key={item} className="rounded-2xl border border-border/80 bg-background/70 p-5 text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-accent/30 bg-accent/10 p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Need help choosing?</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight">{pricing.closingTitle}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{pricing.closingText}</p>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/book-call"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-black text-accent-foreground transition-all hover:scale-[1.02] hover:bg-white"
                >
                  {pricing.closingButtonLabel}
                </Link>
                <a
                  href={`mailto:${pricing.closingEmailLabel}`}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background/70 px-5 py-3 text-sm font-bold transition-colors hover:border-accent hover:text-accent"
                >
                  {pricing.closingEmailLabel}
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>

      <CTA />
    </SiteShell>
  );
}
