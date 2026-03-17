type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden px-6 pb-14 pt-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-0 top-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-4xl rounded-[2rem] border border-border/80 bg-gradient-to-br from-muted/70 to-background/80 px-8 py-14 shadow-2xl shadow-black/20 md:px-12">
          <p className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">{description}</p>
        </div>
      </div>
    </section>
  );
}
