import { services as fallbackServices } from "@/constants";

export type SiteService = {
  id: string;
  title: string;
  description: string;
  image: string;
  sortOrder: number;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop";
export const LANDING_SERVICE_MARKER = "nwhrzn-service";

type PortfolioProjectRow = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
};

const mapRowToSiteService = (item: PortfolioProjectRow): SiteService => ({
  id: item.id,
  title: item.title?.trim() ?? "Untitled service",
  description: item.description?.trim() || "No description provided yet.",
  image: item.image_url?.trim() || fallbackImage,
  sortOrder: item.sort_order ?? 0,
});

export async function getAdminServices(): Promise<SiteService[]> {
  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) return [];

  const { data, error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .select("id,title,description,image_url,sort_order")
    .eq("github_url", LANDING_SERVICE_MARKER)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) return [];

  return data
    .filter((item) => typeof item.title === "string" && item.title.trim().length > 0)
    .map(mapRowToSiteService);
}

export async function getLandingServices(): Promise<SiteService[]> {
  const adminServices = await getAdminServices();
  if (adminServices.length > 0) return adminServices;

  return fallbackServices.map((service, index) => ({
    id: `fallback-${index}`,
    title: service.title,
    description: service.description,
    image: service.image || fallbackImage,
    sortOrder: index + 1,
  }));
}
