import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getPrivacy } from "@/i18n/legal";
import { siloMetadata } from "@/lib/siloMeta";
import { buildLegalSchema } from "@/lib/schema";
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
  return siloMetadata(locale, getPrivacy(locale));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const dict = getDictionary(locale);
  const content = getPrivacy(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLegalSchema(locale, content)) }}
      />
      <LegalPage locale={locale} dict={dict} content={content} />
    </>
  );
}
