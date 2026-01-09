import type { Metadata } from "next";
import { RootLayout as SharedRootLayout } from "@aalokdeep/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workbench | Aalok Deep Pandit",
  description: "A showcase of projects, experiments, and portfolio work.",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SharedRootLayout>{children}</SharedRootLayout>;
}
