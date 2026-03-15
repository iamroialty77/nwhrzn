export default function BookCallPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-24 text-foreground lg:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-border bg-muted/40 p-8 text-center md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Book a Call</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Contact via Email</h1>
        <p className="mt-6 text-base font-semibold text-muted-foreground md:text-lg">
          For bookings and inquiries, email us directly here:
        </p>
        <a
          href="mailto:roi@nwhrzn.digital"
          className="mt-8 inline-flex rounded-full bg-accent px-8 py-3 text-sm font-black text-accent-foreground transition-all hover:scale-105"
        >
          roi@nwhrzn.digital
        </a>
      </section>
    </main>
  );
}
