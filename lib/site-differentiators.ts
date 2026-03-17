import { differentiators as fallbackDifferentiators } from "@/constants";

export type SiteDifferentiator = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
};

export type WhyUsContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  items: SiteDifferentiator[];
};

export const WHY_US_ITEM_MARKER = "nwhrzn-why-us-item";
export const WHY_US_CONTENT_MARKER = "nwhrzn-why-us-content";

type PortfolioProjectRow = {
  id: string;
  title: string | null;
  description: string | null;
  image_url?: string | null;
  sort_order: number | null;
};

const fallbackContent: WhyUsContent = {
  eyebrow: "Why NWHRZN",
  heading: "What makes us different",
  lead: "We don't just post content — we build strategies that move the needle for your brand.",
  items: fallbackDifferentiators.map((item, index) => ({
    id: `fallback-differentiator-${index}`,
    title: item.title,
    description: item.description,
    sortOrder: index + 1,
  })),
};

const mapRowToDifferentiator = (item: PortfolioProjectRow): SiteDifferentiator => ({
  id: item.id,
  title: item.title?.trim() || "Untitled differentiator",
  description: item.description?.trim() || "No differentiator description provided yet.",
  sortOrder: item.sort_order ?? 0,
});

export async function getAdminWhyUsItems(): Promise<SiteDifferentiator[]> {
  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) return [];

  const { data, error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .select("id,title,description,sort_order")
    .eq("github_url", WHY_US_ITEM_MARKER)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) return [];

  return data
    .filter((item) => typeof item.title === "string" && item.title.trim().length > 0)
    .map(mapRowToDifferentiator);
}

export async function getAdminWhyUsContent(): Promise<Omit<WhyUsContent, "items">> {
  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    return {
      eyebrow: fallbackContent.eyebrow,
      heading: fallbackContent.heading,
      lead: fallbackContent.lead,
    };
  }

  const { data, error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .select("title,description,image_url")
    .eq("github_url", WHY_US_CONTENT_MARKER)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return {
      eyebrow: fallbackContent.eyebrow,
      heading: fallbackContent.heading,
      lead: fallbackContent.lead,
    };
  }

  return {
    eyebrow: data.title?.trim() || fallbackContent.eyebrow,
    heading: data.image_url?.trim() || fallbackContent.heading,
    lead: data.description?.trim() || fallbackContent.lead,
  };
}

export async function getLandingWhyUsContent(): Promise<WhyUsContent> {
  const [content, items] = await Promise.all([getAdminWhyUsContent(), getAdminWhyUsItems()]);

  return {
    ...content,
    items: items.length > 0 ? items : fallbackContent.items,
  };
}
