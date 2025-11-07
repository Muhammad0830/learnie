import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "next-themes";
import SideBar from "@/components/header_sidebar/Sidebar";
import Providers from "@/context/ReactQueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CustomToastProvider } from "@/context/CustomToastContext";
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />

      <body>
        <Providers>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <CustomToastProvider>
                <NextIntlClientProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                  >
                    <SideBar>{children}</SideBar>
                  </ThemeProvider>
                </NextIntlClientProvider>
              </CustomToastProvider>
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
