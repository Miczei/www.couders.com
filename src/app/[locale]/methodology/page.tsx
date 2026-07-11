import type { Metadata } from "next";
import SectorsPage from "@/components/sectors/SectorsPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getSectors } from "@/i18n/sectors";
import { siloMetadata } from "@/lib/siloMeta";
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
  return siloMetadata(locale, getSectors(locale));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const dict = getDictionary(locale);
  const content = getSectors(locale);

  return <SectorsPage locale={locale} dict={dict} content={content} />;
}
