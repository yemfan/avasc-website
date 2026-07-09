import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { StoriesClient } from "@/components/stories/StoriesClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("stories");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: "https://www.avasc.org/stories", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
    alternates: { canonical: "/stories" },
  };
}

export default async function StoriesPage() {
  const t = await getTranslations("stories");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Stories",
        item: "https://www.avasc.org/stories",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("pageTitle")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("pageIntro")}</p>
      </div>
      <StoriesClient />
    </div>
  );
}
