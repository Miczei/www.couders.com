import type { Metadata } from "next";
import FaqPage from "@/components/faq/FaqPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getFaq } from "@/i18n/faq";
import { siloMetadata } from "@/lib/siloMeta";
import { buildFaqSchema } from "@/lib/schema";
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
  return siloMetadata(locale, getFaq(locale));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const dict = getDictionary(locale);
  const content = getFaq(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(locale, content)) }}
      />
      <FaqPage locale={locale} dict={dict} content={content} />
    </>
  );
}
