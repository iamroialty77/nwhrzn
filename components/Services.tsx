import { getLandingServices } from "@/lib/site-services";

export async function Services() {
  const services = await getLandingServices();

  return (
    <section id="services" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Core Services
          </p>
          <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Premium Digital Services That Convert
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Structured offers built for measurable growth. Every card here is managed from your admin panel and
            published live.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-muted/60 to-background/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60"
            >
              <div className="absolute right-4 top-4 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-bold text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </div>
              <img
                src={service.image}
                alt={service.title}
                className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-2xl font-black tracking-tight text-foreground">{service.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center text-sm font-bold text-accent transition-colors hover:text-white"
                >
                  Discuss this service
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
