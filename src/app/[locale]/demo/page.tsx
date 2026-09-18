import type { Metadata } from "next";
import DemoClient from "@/components/demo/DemoClient";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

function toLocale(v: string): Locale {
  return (locales as readonly string[]).includes(v) ? (v as Locale) : defaultLocale;
}

/**
 * One static shell for every prospect demo. The company behind a demo comes
 * from `?id=<token>` at runtime, not from the build, which is what keeps this
 * workable on a static export: a new demo is a row in a sheet, not a commit,
 * a rebuild and a two-minute wait.
 *
 * It also keeps the prospect list out of this public repository and out of
 * the deployed bundle.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return {
    title: locale === "pl" ? "Demo asystenta | Couders" : "Assistant demo | Couders",
    // These pages are built for one named recipient. They must never be
    // indexed, and they are deliberately absent from sitemap.ts.
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  return <DemoClient locale={locale} />;
}
