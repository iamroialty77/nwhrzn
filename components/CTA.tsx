"use client";

import { FormEvent, startTransition, useState } from "react";
import { motion } from "framer-motion";

export const CTA = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setStatusMessage(null);
    setStatusType(null);
    setIsSubmitting(true);

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        });

        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(result.error ?? "Failed to send message.");
        }

        setStatusType("success");
        setStatusMessage("Message sent. Check your inbox at roi@nwhrzn.digital.");
        form.reset();
      } catch (error) {
        const fallback = "Unable to send right now. Please email roi@nwhrzn.digital directly.";
        setStatusType("error");
        setStatusMessage(error instanceof Error ? error.message : fallback);
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[60px] bg-accent px-8 py-20 text-accent-foreground md:px-14 md:py-24"
      >
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

        <h2 className="relative text-center text-4xl font-black leading-[0.95] tracking-tighter md:text-7xl">
          Ready to take your brand to <span className="opacity-60">NWHRZN</span>?
        </h2>
        <form
          onSubmit={handleSubmit}
          className="relative mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 rounded-3xl bg-background/15 p-5 backdrop-blur-sm md:grid-cols-2 md:p-6"
        >
          <label className="flex flex-col gap-2 text-left md:col-span-1">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground/80">Name</span>
            <input
              name="name"
              required
              placeholder="Your name"
              className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/65 outline-none ring-offset-0 focus:border-white/40 focus:ring-2 focus:ring-white/30"
            />
          </label>
          <label className="flex flex-col gap-2 text-left md:col-span-1">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground/80">Email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/65 outline-none ring-offset-0 focus:border-white/40 focus:ring-2 focus:ring-white/30"
            />
          </label>
          <label className="flex flex-col gap-2 text-left md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground/80">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us what you need."
              className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/65 outline-none ring-offset-0 focus:border-white/40 focus:ring-2 focus:ring-white/30"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-background px-8 py-3 text-sm font-black text-foreground transition-all hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        {statusMessage ? (
          <p
            className={`relative mx-auto mt-4 max-w-3xl rounded-2xl px-4 py-3 text-center text-sm font-semibold ${
              statusType === "success" ? "bg-emerald-500/20 text-emerald-100" : "bg-rose-500/20 text-rose-100"
            }`}
          >
            {statusMessage}
          </p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative mt-8 flex flex-col justify-center gap-4 text-center sm:flex-row"
        >
          <a
            href="mailto:roi@nwhrzn.digital"
            className="rounded-full border-2 border-white/35 px-8 py-3 text-sm font-black transition-all hover:bg-white/10"
          >
            Email Directly
          </a>
          <a
            href="#contact"
            className="rounded-full border-2 border-accent-foreground/20 px-8 py-3 text-sm font-black transition-all hover:bg-white/10"
          >
            Schedule Demo
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
