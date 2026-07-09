import type { Metadata } from "next";
import EnginePage from "@/components/engine/EnginePage";
import { getDictionary } from "@/i18n/dictionaries";
import { getPages } from "@/i18n/pages";
import { getEngineUi } from "@/i18n/engine";
import { siloMetadata } from "@/lib/siloMeta";
import { buildPageSchema } from "@/lib/schema";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

function toLocale(v: string): Locale {
  return (locales as readonly string[]).includes(v) ? (v as Locale) : defaultLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return siloMetadata(locale, getPages(locale).aiEngine);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const dict = getDictionary(locale);
  const page = getPages(locale).aiEngine;
  const ui = getEngineUi(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPageSchema(locale, page)) }}
      />
      <EnginePage locale={locale} dict={dict} page={page} ui={ui} />
    </>
  );
}
