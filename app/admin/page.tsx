import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BarChart3, Layers3, ListChecks, PlusCircle, Save, ShieldCheck, Trash2 } from "lucide-react";
import { metrics, processSteps, faqs, caseStudies } from "@/constants";
import { getAdminServices, LANDING_SERVICE_MARKER } from "@/lib/site-services";
import {
  getAdminPricingContent,
  getAdminPricingPlans,
  PRICING_CONTENT_MARKER,
  PRICING_PLAN_MARKER,
  serializePricingContentPayload,
  serializePricingPlanPayload,
} from "@/lib/site-pricing";
import {
  getAdminWhyUsContent,
  getAdminWhyUsItems,
  WHY_US_CONTENT_MARKER,
  WHY_US_ITEM_MARKER,
} from "@/lib/site-differentiators";
import { getAdminTestimonials, LANDING_TESTIMONIAL_MARKER } from "@/lib/site-testimonials";

type InquiryOverview = {
  tableName: string | null;
  total: number | null;
  recent: Record<string, unknown>[];
  error: string | null;
};

const inquiryTableCandidates = ["contacts", "inquiries", "leads", "bookings", "messages"];

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

const formatDate = (value: unknown) => {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncate = (value: string, max = 140) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
};

async function getInquiryOverview(): Promise<InquiryOverview> {
  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    return {
      tableName: null,
      total: null,
      recent: [],
      error: "Supabase admin client is not configured.",
    };
  }

  const { supabaseAdmin } = supabaseModule;

  for (const tableName of inquiryTableCandidates) {
    const countResult = await supabaseAdmin
      .from(tableName)
      .select("*", { count: "exact", head: true });

    if (countResult.error) continue;

    const recentResult = await supabaseAdmin
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    return {
      tableName,
      total: countResult.count ?? 0,
      recent: recentResult.data ?? [],
      error: recentResult.error?.message ?? null,
    };
  }

  return {
    tableName: null,
    total: null,
    recent: [],
    error: "No inquiry table found. Expected one of: contacts, inquiries, leads, bookings, messages.",
  };
}

async function createService(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrder = Number.parseInt(sortOrderRaw, 10);

  if (!title) {
    redirect("/admin?service=missing-title");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?service=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin.from("portfolio_projects").insert({
    title,
    description: description || null,
    image_url: imageUrl || null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    github_url: LANDING_SERVICE_MARKER,
  });

  if (error) {
    redirect(`/admin?service=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?service=added");
}

async function deleteService(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin?service=missing-id");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?service=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .delete()
    .eq("id", id)
    .eq("github_url", LANDING_SERVICE_MARKER);

  if (error) {
    redirect(`/admin?service=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?service=deleted");
}

async function updateService(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrder = Number.parseInt(sortOrderRaw, 10);

  if (!id) {
    redirect("/admin?service=missing-id");
  }

  if (!title) {
    redirect("/admin?service=missing-title");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?service=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .update({
      title,
      description: description || null,
      image_url: imageUrl || null,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .eq("id", id)
    .eq("github_url", LANDING_SERVICE_MARKER);

  if (error) {
    redirect(`/admin?service=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?service=updated");
}

async function createTestimonial(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrder = Number.parseInt(sortOrderRaw, 10);

  if (!name) {
    redirect("/admin?testimonial=missing-name");
  }

  if (!quote) {
    redirect("/admin?testimonial=missing-quote");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?testimonial=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin.from("portfolio_projects").insert({
    title: name,
    description: quote,
    image_url: null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    github_url: LANDING_TESTIMONIAL_MARKER,
  });

  if (error) {
    redirect(`/admin?testimonial=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?testimonial=added");
}

async function updateWhyUsContent(formData: FormData) {
  "use server";

  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const lead = String(formData.get("lead") ?? "").trim();

  if (!eyebrow) {
    redirect("/admin?whyus=missing-eyebrow");
  }

  if (!heading) {
    redirect("/admin?whyus=missing-heading");
  }

  if (!lead) {
    redirect("/admin?whyus=missing-lead");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?whyus=supabase-missing");
  }

  const { data: existing, error: fetchError } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .select("id")
    .eq("github_url", WHY_US_CONTENT_MARKER)
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    redirect(`/admin?whyus=error&message=${encodeURIComponent(fetchError.message)}`);
  }

  const payload = {
    title: eyebrow,
    image_url: heading,
    description: lead,
    sort_order: 0,
    github_url: WHY_US_CONTENT_MARKER,
  };

  const result = existing?.id
    ? await supabaseModule.supabaseAdmin.from("portfolio_projects").update(payload).eq("id", existing.id)
    : await supabaseModule.supabaseAdmin.from("portfolio_projects").insert(payload);

  if (result.error) {
    redirect(`/admin?whyus=error&message=${encodeURIComponent(result.error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?whyus=updated");
}

async function createWhyUsItem(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrder = Number.parseInt(sortOrderRaw, 10);

  if (!title) {
    redirect("/admin?whyusitem=missing-title");
  }

  if (!description) {
    redirect("/admin?whyusitem=missing-description");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?whyusitem=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin.from("portfolio_projects").insert({
    title,
    description,
    image_url: null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    github_url: WHY_US_ITEM_MARKER,
  });

  if (error) {
    redirect(`/admin?whyusitem=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?whyusitem=added");
}

async function updateWhyUsItem(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrder = Number.parseInt(sortOrderRaw, 10);

  if (!id) {
    redirect("/admin?whyusitem=missing-id");
  }

  if (!title) {
    redirect("/admin?whyusitem=missing-title");
  }

  if (!description) {
    redirect("/admin?whyusitem=missing-description");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?whyusitem=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .update({
      title,
      description,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .eq("id", id)
    .eq("github_url", WHY_US_ITEM_MARKER);

  if (error) {
    redirect(`/admin?whyusitem=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?whyusitem=updated");
}

async function deleteWhyUsItem(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin?whyusitem=missing-id");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?whyusitem=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .delete()
    .eq("id", id)
    .eq("github_url", WHY_US_ITEM_MARKER);

  if (error) {
    redirect(`/admin?whyusitem=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?whyusitem=deleted");
}

async function updatePricingContent(formData: FormData) {
  "use server";

  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const lead = String(formData.get("lead") ?? "").trim();
  const socialDescription = String(formData.get("social_description") ?? "").trim();
  const webDescription = String(formData.get("web_description") ?? "").trim();
  const guaranteeTitle = String(formData.get("guarantee_title") ?? "").trim();
  const guarantees = String(formData.get("guarantees") ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const closingTitle = String(formData.get("closing_title") ?? "").trim();
  const closingText = String(formData.get("closing_text") ?? "").trim();
  const closingButtonLabel = String(formData.get("closing_button_label") ?? "").trim();
  const closingEmailLabel = String(formData.get("closing_email_label") ?? "").trim();

  if (!eyebrow || !heading || !lead) {
    redirect("/admin?pricing=missing-copy");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?pricing=supabase-missing");
  }

  const { data: existing, error: fetchError } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .select("id")
    .eq("github_url", PRICING_CONTENT_MARKER)
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    redirect(`/admin?pricing=error&message=${encodeURIComponent(fetchError.message)}`);
  }

  const payload = {
    title: eyebrow,
    description: serializePricingContentPayload({
      heading,
      lead,
      categoryDescriptions: {
        "social-media": socialDescription,
        "web-bundles": webDescription,
      },
      guaranteeTitle,
      guarantees,
      closingTitle,
      closingText,
      closingButtonLabel,
      closingEmailLabel,
    }),
    image_url: null,
    sort_order: 0,
    github_url: PRICING_CONTENT_MARKER,
  };

  const result = existing?.id
    ? await supabaseModule.supabaseAdmin.from("portfolio_projects").update(payload).eq("id", existing.id)
    : await supabaseModule.supabaseAdmin.from("portfolio_projects").insert(payload);

  if (result.error) {
    redirect(`/admin?pricing=error&message=${encodeURIComponent(result.error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/admin");
  redirect("/admin?pricing=updated");
}

async function createPricingPlan(formData: FormData) {
  "use server";

  const category = String(formData.get("category") ?? "").trim();
  const tierLabel = String(formData.get("tier_label") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "").trim(), 10);
  const features = String(formData.get("features") ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!name || !price || !summary || !category) {
    redirect("/admin?pricingplan=missing-fields");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?pricingplan=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin.from("portfolio_projects").insert({
    title: name,
    description: serializePricingPlanPayload({
      category: category === "web-bundles" ? "web-bundles" : "social-media",
      tierLabel,
      price,
      audience,
      summary,
      features,
      badge: badge || null,
    }),
    image_url: null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    github_url: PRICING_PLAN_MARKER,
  });

  if (error) {
    redirect(`/admin?pricingplan=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/pricing");
  revalidatePath("/admin");
  redirect("/admin?pricingplan=added");
}

async function updatePricingPlan(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const tierLabel = String(formData.get("tier_label") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "").trim(), 10);
  const features = String(formData.get("features") ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!id || !name || !price || !summary || !category) {
    redirect("/admin?pricingplan=missing-fields");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?pricingplan=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .update({
      title: name,
      description: serializePricingPlanPayload({
        category: category === "web-bundles" ? "web-bundles" : "social-media",
        tierLabel,
        price,
        audience,
        summary,
        features,
        badge: badge || null,
      }),
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .eq("id", id)
    .eq("github_url", PRICING_PLAN_MARKER);

  if (error) {
    redirect(`/admin?pricingplan=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/pricing");
  revalidatePath("/admin");
  redirect("/admin?pricingplan=updated");
}

async function deletePricingPlan(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin?pricingplan=missing-id");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?pricingplan=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .delete()
    .eq("id", id)
    .eq("github_url", PRICING_PLAN_MARKER);

  if (error) {
    redirect(`/admin?pricingplan=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/pricing");
  revalidatePath("/admin");
  redirect("/admin?pricingplan=deleted");
}

async function updateTestimonial(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrder = Number.parseInt(sortOrderRaw, 10);

  if (!id) {
    redirect("/admin?testimonial=missing-id");
  }

  if (!name) {
    redirect("/admin?testimonial=missing-name");
  }

  if (!quote) {
    redirect("/admin?testimonial=missing-quote");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?testimonial=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .update({
      title: name,
      description: quote,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .eq("id", id)
    .eq("github_url", LANDING_TESTIMONIAL_MARKER);

  if (error) {
    redirect(`/admin?testimonial=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?testimonial=updated");
}

async function deleteTestimonial(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin?testimonial=missing-id");
  }

  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    redirect("/admin?testimonial=supabase-missing");
  }

  const { error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .delete()
    .eq("id", id)
    .eq("github_url", LANDING_TESTIMONIAL_MARKER);

  if (error) {
    redirect(`/admin?testimonial=error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?testimonial=deleted");
}

export const metadata: Metadata = {
  title: "Admin | NWHRZN",
  description: "NWHRZN internal admin dashboard",
};

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = (await searchParams) ?? {};
  const inquiries = await getInquiryOverview();
  const managedServices = await getAdminServices();
  const managedTestimonials = await getAdminTestimonials();
  const pricingContent = await getAdminPricingContent();
  const pricingPlans = await getAdminPricingPlans();
  const whyUsContent = await getAdminWhyUsContent();
  const whyUsItems = await getAdminWhyUsItems();
  const serviceStatus = typeof params.service === "string" ? params.service : null;
  const testimonialStatus = typeof params.testimonial === "string" ? params.testimonial : null;
  const pricingStatus = typeof params.pricing === "string" ? params.pricing : null;
  const pricingPlanStatus = typeof params.pricingplan === "string" ? params.pricingplan : null;
  const whyUsStatus = typeof params.whyus === "string" ? params.whyus : null;
  const whyUsItemStatus = typeof params.whyusitem === "string" ? params.whyusitem : null;
  const serviceErrorMessage = typeof params.message === "string" ? params.message : null;
  const testimonialErrorMessage = typeof params.message === "string" ? params.message : null;
  const pricingErrorMessage = typeof params.message === "string" ? params.message : null;
  const pricingPlanErrorMessage = typeof params.message === "string" ? params.message : null;
  const whyUsErrorMessage = typeof params.message === "string" ? params.message : null;
  const whyUsItemErrorMessage = typeof params.message === "string" ? params.message : null;

  const cards = [
    { label: "Services", value: managedServices.length, icon: Layers3 },
    { label: "Pricing Plans", value: pricingPlans.length, icon: BarChart3 },
    { label: "Why Us Cards", value: whyUsItems.length, icon: ShieldCheck },
    { label: "Case Studies", value: caseStudies.length, icon: ListChecks },
    { label: "Testimonials", value: managedTestimonials.length, icon: ShieldCheck },
    { label: "FAQ Items", value: faqs.length, icon: BarChart3 },
    { label: "Process Steps", value: processSteps.length, icon: ListChecks },
    { label: "Homepage KPIs", value: metrics.length, icon: BarChart3 },
    { label: "Inquiry Table", value: inquiries.tableName ?? "Not found", icon: Layers3 },
    { label: "Total Inquiries", value: inquiries.total ?? "N/A", icon: BarChart3 },
  ];

  const recentRows = inquiries.recent;
  const recentColumns = Array.from(
    new Set(
      [
        "full_name",
        "name",
        "email",
        "company",
        "phone",
        "service",
        "message",
        "created_at",
        ...Object.keys(recentRows[0] ?? {}),
      ].filter(Boolean)
    )
  ).slice(0, 8);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 py-10 text-foreground lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="rounded-3xl border border-border/90 bg-gradient-to-br from-muted/80 to-background/90 p-8 shadow-2xl shadow-black/20">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <ShieldCheck size={14} />
            NWHRZN Admin
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Professional Control Panel</h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Manage landing page services, testimonials, and monitor incoming inquiries.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/60 to-background/80 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{card.label}</p>
                <card.icon size={16} className="text-accent" />
              </div>
              <p className="mt-3 text-3xl font-black">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">Updated from current source data.</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/55 to-background/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Pricing Manager</h2>
            <p className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
              Source: <span className="font-bold text-accent">portfolio_projects ({PRICING_CONTENT_MARKER} / {PRICING_PLAN_MARKER})</span>
            </p>
          </div>

          {pricingStatus ? (
            <p className="mt-4 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              Page Status: <span className="font-bold text-foreground">{pricingStatus}</span>
              {pricingErrorMessage ? ` - ${pricingErrorMessage}` : ""}
            </p>
          ) : null}

          {pricingPlanStatus ? (
            <p className="mt-4 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              Plan Status: <span className="font-bold text-foreground">{pricingPlanStatus}</span>
              {pricingPlanErrorMessage ? ` - ${pricingPlanErrorMessage}` : ""}
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
            <form
              action={updatePricingContent}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-border/80 bg-background/50 p-4 md:grid-cols-2 xl:col-span-3"
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Eyebrow</span>
                <input
                  name="eyebrow"
                  defaultValue={pricingContent.eyebrow}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Heading</span>
                <input
                  name="heading"
                  defaultValue={pricingContent.heading}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Lead Copy</span>
                <textarea
                  name="lead"
                  defaultValue={pricingContent.lead}
                  rows={3}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Social Media Section Description</span>
                <textarea
                  name="social_description"
                  defaultValue={pricingContent.categories.find((item) => item.key === "social-media")?.description}
                  rows={3}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Web Bundle Section Description</span>
                <textarea
                  name="web_description"
                  defaultValue={pricingContent.categories.find((item) => item.key === "web-bundles")?.description}
                  rows={3}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Guarantee Title</span>
                <input
                  name="guarantee_title"
                  defaultValue={pricingContent.guaranteeTitle}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Guarantees</span>
                <textarea
                  name="guarantees"
                  defaultValue={pricingContent.guarantees.join("\n")}
                  rows={5}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Closing Title</span>
                <input
                  name="closing_title"
                  defaultValue={pricingContent.closingTitle}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Closing Text</span>
                <textarea
                  name="closing_text"
                  defaultValue={pricingContent.closingText}
                  rows={3}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Closing Button Label</span>
                <input
                  name="closing_button_label"
                  defaultValue={pricingContent.closingButtonLabel}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Closing Email</span>
                <input
                  name="closing_email_label"
                  defaultValue={pricingContent.closingEmailLabel}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 self-end rounded-xl bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02] active:scale-100 md:col-span-2"
              >
                <Save size={16} />
                Save Pricing Copy
              </button>
            </form>

            <aside className="rounded-2xl border border-border/80 bg-background/45 p-4 xl:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Pricing Copy Guide</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Use the eyebrow, heading, and lead for the top section of the pricing page.</li>
                <li>Each category description introduces one pricing group on the live page.</li>
                <li>Guarantees and closing CTA appear below all pricing cards.</li>
                <li>Email and button label update the final conversion block directly.</li>
              </ul>
            </aside>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
            <form
              action={createPricingPlan}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-border/80 bg-background/50 p-4 md:grid-cols-2 xl:col-span-3"
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Category</span>
                <select
                  name="category"
                  defaultValue="social-media"
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                >
                  <option value="social-media">Social Media & Content</option>
                  <option value="web-bundles">Web Development Bundle</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Tier Label</span>
                <input
                  name="tier_label"
                  placeholder="Starter / Premium / Most Popular"
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Plan Name</span>
                <input
                  name="name"
                  placeholder="Growth"
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Price</span>
                <input
                  name="price"
                  placeholder="₱ 37,000/month"
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Audience / Positioning</span>
                <input
                  name="audience"
                  placeholder="For brands scaling their presence"
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Summary</span>
                <textarea
                  name="summary"
                  rows={3}
                  required
                  placeholder="Explain who this plan is for and what it solves."
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Features</span>
                <textarea
                  name="features"
                  rows={5}
                  placeholder="One feature per line"
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Badge</span>
                <input
                  name="badge"
                  placeholder="Most Popular"
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Sort Order</span>
                <input
                  type="number"
                  name="sort_order"
                  min={0}
                  defaultValue={0}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 self-end rounded-xl bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02] active:scale-100 md:col-span-2"
              >
                <PlusCircle size={16} />
                Add Pricing Plan
              </button>
            </form>

            <aside className="rounded-2xl border border-border/80 bg-background/45 p-4 xl:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Plan Builder</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Use one plan row per card on the pricing page.</li>
                <li>Badge is optional and ideal for “Most Popular”.</li>
                <li>Each feature should be on its own line for clean website output.</li>
                <li>Sort order controls display across both pricing groups.</li>
              </ul>
            </aside>
          </div>

          {pricingPlans.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border/80">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-background/85">
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Category</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Tier</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Plan</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Price</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Audience</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Summary</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Features</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Badge</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Sort</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingPlans.map((plan) => (
                    <tr key={plan.id} className="border-b border-border/70 align-top">
                      <td className="px-3 py-3">
                        <select
                          form={`update-pricing-plan-${plan.id}`}
                          name="category"
                          defaultValue={plan.category}
                          className="min-w-[170px] rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        >
                          <option value="social-media">Social Media & Content</option>
                          <option value="web-bundles">Web Development Bundle</option>
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-pricing-plan-${plan.id}`}
                          type="text"
                          name="tier_label"
                          defaultValue={plan.tierLabel}
                          className="w-full min-w-[140px] rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-pricing-plan-${plan.id}`}
                          type="text"
                          name="name"
                          required
                          defaultValue={plan.name}
                          className="w-full min-w-[160px] rounded-lg border border-border bg-background px-3 py-2 font-semibold outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-pricing-plan-${plan.id}`}
                          type="text"
                          name="price"
                          required
                          defaultValue={plan.price}
                          className="w-full min-w-[150px] rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-pricing-plan-${plan.id}`}
                          type="text"
                          name="audience"
                          defaultValue={plan.audience}
                          className="w-full min-w-[220px] rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <textarea
                          form={`update-pricing-plan-${plan.id}`}
                          name="summary"
                          defaultValue={plan.summary}
                          rows={4}
                          className="w-full min-w-[280px] rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <textarea
                          form={`update-pricing-plan-${plan.id}`}
                          name="features"
                          defaultValue={plan.features.join("\n")}
                          rows={5}
                          className="w-full min-w-[260px] rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-pricing-plan-${plan.id}`}
                          type="text"
                          name="badge"
                          defaultValue={plan.badge ?? ""}
                          className="w-full min-w-[140px] rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-pricing-plan-${plan.id}`}
                          type="number"
                          name="sort_order"
                          min={0}
                          defaultValue={plan.sortOrder}
                          className="w-24 rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <form id={`update-pricing-plan-${plan.id}`} action={updatePricingPlan}>
                            <input type="hidden" name="id" value={plan.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/60 px-3 py-1.5 font-semibold text-accent transition-colors hover:bg-accent/10"
                            >
                              <Save size={14} />
                              Save
                            </button>
                          </form>
                          <form action={deletePricingPlan}>
                            <input type="hidden" name="id" value={plan.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/50 px-3 py-1.5 font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              No admin-managed pricing plans yet. Add your first plan above and it will publish on the pricing page.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/55 to-background/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Why NWHRZN Manager</h2>
            <p className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
              Source: <span className="font-bold text-accent">portfolio_projects ({WHY_US_CONTENT_MARKER} / {WHY_US_ITEM_MARKER})</span>
            </p>
          </div>

          {whyUsStatus ? (
            <p className="mt-4 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              Section Status: <span className="font-bold text-foreground">{whyUsStatus}</span>
              {whyUsErrorMessage ? ` - ${whyUsErrorMessage}` : ""}
            </p>
          ) : null}

          {whyUsItemStatus ? (
            <p className="mt-4 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              Card Status: <span className="font-bold text-foreground">{whyUsItemStatus}</span>
              {whyUsItemErrorMessage ? ` - ${whyUsItemErrorMessage}` : ""}
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
            <form
              action={updateWhyUsContent}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-border/80 bg-background/50 p-4 md:grid-cols-2 xl:col-span-3"
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Eyebrow</span>
                <input
                  name="eyebrow"
                  defaultValue={whyUsContent.eyebrow}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Heading</span>
                <input
                  name="heading"
                  defaultValue={whyUsContent.heading}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Lead Copy</span>
                <textarea
                  name="lead"
                  defaultValue={whyUsContent.lead}
                  rows={4}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 self-end rounded-xl bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02] active:scale-100 md:col-span-2"
              >
                <Save size={16} />
                Save Section Copy
              </button>
            </form>

            <aside className="rounded-2xl border border-border/80 bg-background/45 p-4 xl:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Editing Guide</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Use the eyebrow for the short section label above the headline.</li>
                <li>Keep the heading concise for stronger visual impact.</li>
                <li>Lead copy should explain the strategic difference in one paragraph.</li>
                <li>Cards below can be reordered, updated, added, or removed anytime.</li>
              </ul>
            </aside>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
            <form
              action={createWhyUsItem}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-border/80 bg-background/50 p-4 md:grid-cols-2 xl:col-span-3"
            >
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Card Title</span>
                <input
                  name="title"
                  placeholder="Results-driven approach"
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Description</span>
                <textarea
                  name="description"
                  placeholder="Explain what makes your agency different."
                  rows={4}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Sort Order</span>
                <input
                  type="number"
                  name="sort_order"
                  min={0}
                  defaultValue={0}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 self-end rounded-xl bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02] active:scale-100"
              >
                <PlusCircle size={16} />
                Add Card
              </button>
            </form>

            <aside className="rounded-2xl border border-border/80 bg-background/45 p-4 xl:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Card Strategy</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Each card should communicate one real differentiator only.</li>
                <li>Use sort order to control the homepage sequence.</li>
                <li>Keep titles punchy and descriptions proof-oriented.</li>
                <li>Delete removes the card from the landing page immediately after publish.</li>
              </ul>
            </aside>
          </div>

          {whyUsItems.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border/80">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-background/85">
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Card Title</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Description</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Sort</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {whyUsItems.map((item) => (
                    <tr key={item.id} className="border-b border-border/70 align-top">
                      <td className="px-3 py-3">
                        <input
                          form={`update-whyus-item-${item.id}`}
                          type="text"
                          name="title"
                          required
                          defaultValue={item.title}
                          className="w-full min-w-[220px] rounded-lg border border-border bg-background px-3 py-2 font-semibold outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <textarea
                          form={`update-whyus-item-${item.id}`}
                          name="description"
                          defaultValue={item.description}
                          rows={4}
                          required
                          className="w-full min-w-[320px] rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-whyus-item-${item.id}`}
                          type="number"
                          name="sort_order"
                          min={0}
                          defaultValue={item.sortOrder}
                          className="w-24 rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <form id={`update-whyus-item-${item.id}`} action={updateWhyUsItem}>
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/60 px-3 py-1.5 font-semibold text-accent transition-colors hover:bg-accent/10"
                            >
                              <Save size={14} />
                              Save
                            </button>
                          </form>
                          <form action={deleteWhyUsItem}>
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/50 px-3 py-1.5 font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              No admin-managed Why NWHRZN cards yet. Add your first differentiator above and it will publish on the homepage.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/55 to-background/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Services Manager</h2>
            <p className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
              Source: <span className="font-bold text-accent">portfolio_projects ({LANDING_SERVICE_MARKER})</span>
            </p>
          </div>

          {serviceStatus ? (
            <p className="mt-4 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              Status: <span className="font-bold text-foreground">{serviceStatus}</span>
              {serviceErrorMessage ? ` - ${serviceErrorMessage}` : ""}
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
            <form
              action={createService}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-border/80 bg-background/50 p-4 md:grid-cols-2 xl:col-span-3"
            >
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Title</span>
                <input
                  name="title"
                  placeholder="Service title"
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Image URL</span>
                <input
                  name="image_url"
                  placeholder="https://..."
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Description</span>
                <textarea
                  name="description"
                  placeholder="Service description"
                  rows={4}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Sort Order</span>
                <input
                  type="number"
                  name="sort_order"
                  min={0}
                  defaultValue={0}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 self-end rounded-xl bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02] active:scale-100"
              >
                <PlusCircle size={16} />
                Add Service
              </button>
            </form>

            <aside className="rounded-2xl border border-border/80 bg-background/45 p-4 xl:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Publishing Guide</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Use short, clear titles for stronger card headlines.</li>
                <li>Set sort order to control the exact landing sequence.</li>
                <li>Use high-quality landscape image URLs for consistency.</li>
                <li>Delete action unpublishes the card from landing page.</li>
              </ul>
            </aside>
          </div>

          {managedServices.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border/80">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-background/85">
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Title</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Description</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Image URL</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Sort</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managedServices.map((service) => (
                    <tr key={service.id} className="border-b border-border/70 align-top">
                      <td className="px-3 py-3">
                        <input
                          form={`update-service-${service.id}`}
                          type="text"
                          name="title"
                          required
                          defaultValue={service.title}
                          className="w-full min-w-[180px] rounded-lg border border-border bg-background px-3 py-2 font-semibold outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <textarea
                          form={`update-service-${service.id}`}
                          name="description"
                          defaultValue={service.description}
                          rows={3}
                          className="w-full min-w-[260px] rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-service-${service.id}`}
                          type="url"
                          name="image_url"
                          defaultValue={service.image}
                          className="w-full min-w-[220px] rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-service-${service.id}`}
                          type="number"
                          name="sort_order"
                          min={0}
                          defaultValue={service.sortOrder}
                          className="w-24 rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <form id={`update-service-${service.id}`} action={updateService}>
                            <input type="hidden" name="id" value={service.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/60 px-3 py-1.5 font-semibold text-accent transition-colors hover:bg-accent/10"
                            >
                              <Save size={14} />
                              Save
                            </button>
                          </form>
                          <form action={deleteService}>
                            <input type="hidden" name="id" value={service.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/50 px-3 py-1.5 font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              No admin-managed services yet. Add your first item above and it will publish on the landing page.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/55 to-background/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Testimonials Manager</h2>
            <p className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
              Source: <span className="font-bold text-accent">portfolio_projects ({LANDING_TESTIMONIAL_MARKER})</span>
            </p>
          </div>

          {testimonialStatus ? (
            <p className="mt-4 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              Status: <span className="font-bold text-foreground">{testimonialStatus}</span>
              {testimonialErrorMessage ? ` - ${testimonialErrorMessage}` : ""}
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
            <form
              action={createTestimonial}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-border/80 bg-background/50 p-4 md:grid-cols-2 xl:col-span-3"
            >
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Client Name</span>
                <input
                  name="name"
                  placeholder="Founder, Retail Brand"
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Quote</span>
                <textarea
                  name="quote"
                  placeholder="Client testimonial quote..."
                  rows={4}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Sort Order</span>
                <input
                  type="number"
                  name="sort_order"
                  min={0}
                  defaultValue={0}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 outline-none ring-accent focus:ring-2"
                />
              </label>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 self-end rounded-xl bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02] active:scale-100"
              >
                <PlusCircle size={16} />
                Add Testimonial
              </button>
            </form>

            <aside className="rounded-2xl border border-border/80 bg-background/45 p-4 xl:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Publishing Guide</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Use clear client identity (role/company) as name.</li>
                <li>Keep quotes concise and outcome-focused.</li>
                <li>Set sort order to control display sequence.</li>
                <li>Delete action unpublishes the testimonial from homepage.</li>
              </ul>
            </aside>
          </div>

          {managedTestimonials.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border/80">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-background/85">
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Client Name</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Quote</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Sort</th>
                    <th className="whitespace-nowrap px-3 py-2 font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managedTestimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="border-b border-border/70 align-top">
                      <td className="px-3 py-3">
                        <input
                          form={`update-testimonial-${testimonial.id}`}
                          type="text"
                          name="name"
                          required
                          defaultValue={testimonial.name}
                          className="w-full min-w-[220px] rounded-lg border border-border bg-background px-3 py-2 font-semibold outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <textarea
                          form={`update-testimonial-${testimonial.id}`}
                          name="quote"
                          defaultValue={testimonial.quote}
                          rows={4}
                          required
                          className="w-full min-w-[320px] rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          form={`update-testimonial-${testimonial.id}`}
                          type="number"
                          name="sort_order"
                          min={0}
                          defaultValue={testimonial.sortOrder}
                          className="w-24 rounded-lg border border-border bg-background px-3 py-2 outline-none ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <form id={`update-testimonial-${testimonial.id}`} action={updateTestimonial}>
                            <input type="hidden" name="id" value={testimonial.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/60 px-3 py-1.5 font-semibold text-accent transition-colors hover:bg-accent/10"
                            >
                              <Save size={14} />
                              Save
                            </button>
                          </form>
                          <form action={deleteTestimonial}>
                            <input type="hidden" name="id" value={testimonial.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/50 px-3 py-1.5 font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              No admin-managed testimonials yet. Add your first item above and it will publish on the homepage.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/55 to-background/70 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Recent Inquiries</h2>
            {inquiries.tableName ? (
              <p className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                Source table: <span className="font-bold text-accent">{inquiries.tableName}</span>
              </p>
            ) : null}
          </div>

          {inquiries.error ? (
            <p className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {inquiries.error}
            </p>
          ) : null}

          {recentRows.length > 0 ? (
            <div className="mt-5 overflow-x-auto rounded-2xl border border-border/80">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-background/85">
                  <tr className="border-b border-border text-left text-muted-foreground">
                    {recentColumns.map((column) => (
                      <th key={column} className="whitespace-nowrap px-3 py-2 font-semibold uppercase">
                        {column.replaceAll("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentRows.map((row, index) => (
                    <tr key={String(row.id ?? index)} className="border-b border-border/70">
                      {recentColumns.map((column) => {
                        const raw = row[column];
                        const maybeDate = column.includes("date") || column.includes("created_at");
                        const dateText = maybeDate ? formatDate(raw) : null;
                        const printable = dateText ?? formatValue(raw);
                        return (
                          <td key={`${index}-${column}`} className="max-w-xs px-3 py-3 align-top text-foreground/95">
                            {truncate(String(printable), 120)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              No inquiry records yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
