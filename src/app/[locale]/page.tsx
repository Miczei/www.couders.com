import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import ChatbotShowcase from "@/components/ChatbotShowcase";
import Process from "@/components/Process";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <main>
      <Navbar locale={locale} dict={dict} />
      <Hero dict={dict} />
      <Capabilities dict={dict} />
      <ChatbotShowcase dict={dict} />
      <Process dict={dict} />
      <Work dict={dict} />
      <Contact dict={dict} />
      <Footer dict={dict} />
    </main>
  );
}
