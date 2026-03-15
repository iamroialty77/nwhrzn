import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BarChart3, Layers3, ListChecks, PlusCircle, Save, ShieldCheck, Trash2 } from "lucide-react";
import { metrics, processSteps, testimonials, faqs, caseStudies } from "@/constants";
import { getAdminServices, LANDING_SERVICE_MARKER } from "@/lib/site-services";

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
  const serviceStatus = typeof params.service === "string" ? params.service : null;
  const serviceErrorMessage = typeof params.message === "string" ? params.message : null;

  const cards = [
    { label: "Services", value: managedServices.length, icon: Layers3 },
    { label: "Case Studies", value: caseStudies.length, icon: ListChecks },
    { label: "Testimonials", value: testimonials.length, icon: ShieldCheck },
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
            Manage landing page service cards and monitor incoming inquiries.
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
