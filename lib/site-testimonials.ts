import { testimonials as fallbackTestimonials } from "@/constants";

export type SiteTestimonial = {
  id: string;
  quote: string;
  name: string;
  sortOrder: number;
};

export const LANDING_TESTIMONIAL_MARKER = "nwhrzn-testimonial";

type PortfolioProjectRow = {
  id: string;
  title: string | null;
  description: string | null;
  sort_order: number | null;
};

const mapRowToSiteTestimonial = (item: PortfolioProjectRow): SiteTestimonial => ({
  id: item.id,
  quote: item.description?.trim() || "No testimonial quote provided yet.",
  name: item.title?.trim() || "Anonymous Client",
  sortOrder: item.sort_order ?? 0,
});

export async function getAdminTestimonials(): Promise<SiteTestimonial[]> {
  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) return [];

  const { data, error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .select("id,title,description,sort_order")
    .eq("github_url", LANDING_TESTIMONIAL_MARKER)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) return [];

  return data
    .filter((item) => typeof item.description === "string" && item.description.trim().length > 0)
    .map(mapRowToSiteTestimonial);
}

export async function getLandingTestimonials(): Promise<SiteTestimonial[]> {
  const adminTestimonials = await getAdminTestimonials();
  if (adminTestimonials.length > 0) return adminTestimonials;

  return fallbackTestimonials.map((item, index) => ({
    id: `fallback-testimonial-${index}`,
    quote: item.quote,
    name: item.name,
    sortOrder: index + 1,
  }));
}
