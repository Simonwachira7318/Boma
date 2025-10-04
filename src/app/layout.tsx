import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Boma Properties Ltd - Professional Property Management",
  description: "Comprehensive property management system for rental properties and Airbnb. Track payments, automate reminders, and manage tenants efficiently.",
  keywords: ["Property Management", "Rental Properties", "Airbnb", "Real Estate", "Payment Tracking", "Boma Properties"],
  authors: [{ name: "Boma Properties Ltd" }],
  openGraph: {
    title: "Boma Properties Ltd",
    description: "Professional Property Management for Rental Properties & Airbnb",
    url: "https://bomaproperties.co.ke",
    siteName: "Boma Properties Ltd",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boma Properties Ltd",
    description: "Professional Property Management for Rental Properties & Airbnb",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
