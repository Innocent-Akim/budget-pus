import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Budget Plus - Gestion Budgétaire",
  description: "Application simple et efficace pour gérer votre budget mensuel et atteindre vos objectifs d'épargne",
  keywords: [
    "budget",
    "gestion budgétaire",
    "épargne",
    "finances personnelles",
    "argent",
    "dépenses",
    "revenus",
    "objectifs financiers",
    "planification budgétaire",
    "suivi des dépenses",
    "économie",
    "investissement",
    "épargne mensuelle",
    "contrôle des finances",
    "budget familial",
    "gestion de l'argent",
    "finances",
    "comptabilité personnelle",
    "sécurité financière",
    "liberté financière",
    "budget mensuel",
    "suivi budget",
    "application budget",
    "outil financier",
    "gestion des revenus",
    "planification financière",
    "épargne automatique",
    "objectifs d'épargne",
    "budget personnel",
    "finances familiales",
    "gestion des dépenses",
    "contrôle budgétaire",
    "application de budget",
    "outil de budget",
    "gestionnaire de budget",
    "suivi des finances",
    "budget en ligne",
    "application financière",
    "gestionnaire d'argent"
  ],
  authors: [{ name: "Akim" }],
  creator: "Budget Plus",
  publisher: "Budget Plus",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://budget-plus.app",
    title: "Budget Plus - Gestion Budgétaire",
    description: "Application simple et efficace pour gérer votre budget mensuel et atteindre vos objectifs d'épargne",
    siteName: "Budget Plus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Plus - Gestion Budgétaire",
    description: "Application simple et efficace pour gérer votre budget mensuel et atteindre vos objectifs d'épargne",
    creator: "@budgetplus",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white dark:bg-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}