type PricingCategoryKey = "social-media" | "web-bundles";

export type PricingPlan = {
  id: string;
  category: PricingCategoryKey;
  tierLabel: string;
  name: string;
  price: string;
  audience: string;
  summary: string;
  features: string[];
  badge: string | null;
  sortOrder: number;
};

export type PricingCategory = {
  key: PricingCategoryKey;
  label: string;
  description: string;
};

export type PricingPageContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  categories: PricingCategory[];
  plans: PricingPlan[];
  guaranteeTitle: string;
  guarantees: string[];
  closingTitle: string;
  closingText: string;
  closingButtonLabel: string;
  closingEmailLabel: string;
};

type PortfolioProjectRow = {
  id: string;
  title: string | null;
  description: string | null;
  sort_order: number | null;
};

const PRICING_PLAN_MARKER = "nwhrzn-pricing-plan";
const PRICING_CONTENT_MARKER = "nwhrzn-pricing-content";

const fallbackCategories: PricingCategory[] = [
  {
    key: "social-media",
    label: "Social Media & Content Packages",
    description: "You focus on running your business. We handle the content, strategy, and results.",
  },
  {
    key: "web-bundles",
    label: "Web Development + Marketing Bundles",
    description: "Need a website too? Get a custom-built site and a full marketing engine together at one monthly rate.",
  },
];

const fallbackPlans: PricingPlan[] = [
  {
    id: "fallback-essentials",
    category: "social-media",
    tierLabel: "Starter",
    name: "Essentials",
    price: "₱ 25,000/month",
    audience: "For businesses getting started online",
    summary: "You're building your presence and need consistent, quality content without the overhead of a full in-house team.",
    features: [
      "12 social media posts per month",
      "4 short-form videos",
      "Content marketing copy",
      "Monthly performance report",
      "Email & chat support",
    ],
    badge: null,
    sortOrder: 1,
  },
  {
    id: "fallback-growth",
    category: "social-media",
    tierLabel: "Most Popular",
    name: "Growth",
    price: "₱ 37,000/month",
    audience: "For brands scaling their presence",
    summary: "You've got traction and need more volume, smarter data, and campaigns that actually move the needle.",
    features: [
      "24 social media posts per month",
      "8 short-form videos",
      "Email campaign management",
      "Bi-weekly analytics & insights",
      "Priority chat support",
    ],
    badge: "Most Popular",
    sortOrder: 2,
  },
  {
    id: "fallback-authority",
    category: "social-media",
    tierLabel: "Premium",
    name: "Authority",
    price: "₱ 58,000/month",
    audience: "For serious market leaders",
    summary: "You want to dominate your space. This is full-service, high-output marketing with a dedicated expert in your corner.",
    features: [
      "Unlimited content creation",
      "Full strategy consulting",
      "Dedicated account manager",
      "Weekly performance audits",
      "Priority phone & video support",
    ],
    badge: null,
    sortOrder: 3,
  },
  {
    id: "fallback-launch",
    category: "web-bundles",
    tierLabel: "Starter",
    name: "Launch",
    price: "₱ 35,000/month",
    audience: "Get online fast",
    summary: "Perfect for businesses that need a clean, professional web presence paired with consistent social content from day one.",
    features: [
      "5-page responsive website (WordPress or HTML)",
      "Contact form integration",
      "Everything in the Essentials marketing plan",
      "Email & chat support",
    ],
    badge: null,
    sortOrder: 4,
  },
  {
    id: "fallback-scale",
    category: "web-bundles",
    tierLabel: "Most Popular",
    name: "Scale",
    price: "₱ 75,000/month",
    audience: "Grow with a smarter site",
    summary: "Your website should work as hard as your marketing. This bundle gives you a content-managed, SEO-ready site alongside a full growth marketing operation.",
    features: [
      "10-page website with CMS",
      "SEO setup and mobile-optimized build",
      "Forms and conversion features",
      "Everything in the Growth marketing plan",
      "Priority chat support",
    ],
    badge: "Most Popular",
    sortOrder: 5,
  },
  {
    id: "fallback-dominate",
    category: "web-bundles",
    tierLabel: "Premium",
    name: "Dominate",
    price: "₱ 95,000/month",
    audience: "Full-stack power + full marketing",
    summary: "For businesses ready to build something serious with a custom web application, e-commerce capability, and an Authority-level marketing team behind it.",
    features: [
      "MERN stack custom web app",
      "User authentication and API integrations",
      "PayMongo / e-commerce ready",
      "Hosting and maintenance included",
      "Unlimited revisions on Gold tier",
      "Everything in the Authority marketing plan",
      "Priority phone & video support",
    ],
    badge: null,
    sortOrder: 6,
  },
];

const fallbackContent: PricingPageContent = {
  eyebrow: "Pricing",
  heading: "Simple, Transparent Pricing",
  lead: "Choose the plan that fits where your business is today and grows with you tomorrow.",
  categories: fallbackCategories,
  plans: fallbackPlans,
  guaranteeTitle: "Every plan includes",
  guarantees: [
    "Data-driven execution — no guesswork, just strategy backed by real numbers",
    "Unlimited revisions — we get it right, every time",
    "Dedicated support — email, chat, or priority line depending on your plan",
    "Transparent reporting — you always know what's working",
  ],
  closingTitle: "Not sure which plan is right for you?",
  closingText: "We'll help you figure it out with no pressure and no sales pitch. Just a quick conversation about your goals.",
  closingButtonLabel: "Book a Free Discovery Call",
  closingEmailLabel: "roi@nwhrzn.digital",
};

type PricingPlanPayload = {
  category: PricingCategoryKey;
  tierLabel: string;
  price: string;
  audience: string;
  summary: string;
  features: string[];
  badge: string | null;
};

type PricingContentPayload = {
  heading: string;
  lead: string;
  categoryDescriptions: Record<PricingCategoryKey, string>;
  guaranteeTitle: string;
  guarantees: string[];
  closingTitle: string;
  closingText: string;
  closingButtonLabel: string;
  closingEmailLabel: string;
};

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const mapRowToPricingPlan = (row: PortfolioProjectRow): PricingPlan => {
  const payload = parseJson<PricingPlanPayload>(row.description, {
    category: "social-media",
    tierLabel: "Starter",
    price: "",
    audience: "",
    summary: "",
    features: [],
    badge: null,
  });

  return {
    id: row.id,
    category: payload.category,
    tierLabel: payload.tierLabel,
    name: row.title?.trim() || "Untitled Plan",
    price: payload.price,
    audience: payload.audience,
    summary: payload.summary,
    features: payload.features,
    badge: payload.badge,
    sortOrder: row.sort_order ?? 0,
  };
};

export function serializePricingPlanPayload(payload: PricingPlanPayload) {
  return JSON.stringify(payload);
}

export function serializePricingContentPayload(payload: PricingContentPayload) {
  return JSON.stringify(payload);
}

export async function getAdminPricingPlans(): Promise<PricingPlan[]> {
  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) return [];

  const { data, error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .select("id,title,description,sort_order")
    .eq("github_url", PRICING_PLAN_MARKER)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) return [];

  return data
    .filter((item) => typeof item.title === "string" && item.title.trim().length > 0)
    .map(mapRowToPricingPlan);
}

export async function getAdminPricingContent(): Promise<Omit<PricingPageContent, "plans">> {
  const supabaseModule = await import("@/lib/supabase/server").catch(() => null);
  if (!supabaseModule?.supabaseAdmin) {
    return {
      eyebrow: fallbackContent.eyebrow,
      heading: fallbackContent.heading,
      lead: fallbackContent.lead,
      categories: fallbackContent.categories,
      guaranteeTitle: fallbackContent.guaranteeTitle,
      guarantees: fallbackContent.guarantees,
      closingTitle: fallbackContent.closingTitle,
      closingText: fallbackContent.closingText,
      closingButtonLabel: fallbackContent.closingButtonLabel,
      closingEmailLabel: fallbackContent.closingEmailLabel,
    };
  }

  const { data, error } = await supabaseModule.supabaseAdmin
    .from("portfolio_projects")
    .select("title,description")
    .eq("github_url", PRICING_CONTENT_MARKER)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return {
      eyebrow: fallbackContent.eyebrow,
      heading: fallbackContent.heading,
      lead: fallbackContent.lead,
      categories: fallbackContent.categories,
      guaranteeTitle: fallbackContent.guaranteeTitle,
      guarantees: fallbackContent.guarantees,
      closingTitle: fallbackContent.closingTitle,
      closingText: fallbackContent.closingText,
      closingButtonLabel: fallbackContent.closingButtonLabel,
      closingEmailLabel: fallbackContent.closingEmailLabel,
    };
  }

  const payload = parseJson<PricingContentPayload>(data.description, {
    heading: fallbackContent.heading,
    lead: fallbackContent.lead,
    categoryDescriptions: {
      "social-media": fallbackCategories[0].description,
      "web-bundles": fallbackCategories[1].description,
    },
    guaranteeTitle: fallbackContent.guaranteeTitle,
    guarantees: fallbackContent.guarantees,
    closingTitle: fallbackContent.closingTitle,
    closingText: fallbackContent.closingText,
    closingButtonLabel: fallbackContent.closingButtonLabel,
    closingEmailLabel: fallbackContent.closingEmailLabel,
  });

  return {
    eyebrow: data.title?.trim() || fallbackContent.eyebrow,
    heading: payload.heading || fallbackContent.heading,
    lead: payload.lead || fallbackContent.lead,
    categories: fallbackCategories.map((category) => ({
      ...category,
      description: payload.categoryDescriptions[category.key] || category.description,
    })),
    guaranteeTitle: payload.guaranteeTitle || fallbackContent.guaranteeTitle,
    guarantees: payload.guarantees.length > 0 ? payload.guarantees : fallbackContent.guarantees,
    closingTitle: payload.closingTitle || fallbackContent.closingTitle,
    closingText: payload.closingText || fallbackContent.closingText,
    closingButtonLabel: payload.closingButtonLabel || fallbackContent.closingButtonLabel,
    closingEmailLabel: payload.closingEmailLabel || fallbackContent.closingEmailLabel,
  };
}

export async function getLandingPricingContent(): Promise<PricingPageContent> {
  const [content, plans] = await Promise.all([getAdminPricingContent(), getAdminPricingPlans()]);

  return {
    ...content,
    plans: plans.length > 0 ? plans : fallbackContent.plans,
  };
}

export { PRICING_CONTENT_MARKER, PRICING_PLAN_MARKER };
