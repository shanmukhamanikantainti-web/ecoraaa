import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";

// Syne — geometric display font with Monument Extended character
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-monument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECORAA — Personal Intelligence OS",
  description:
    "Autonomous AI operating environment coordinating agents, tasks, semantic memory, terminal execution, and hardware persistence.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrains.variable}`}>
      <body className="antialiased bg-[#F7F1E3] text-[#2D2A26]">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}

