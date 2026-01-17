import type { Metadata } from "next";
import { RootLayout as SharedRootLayout } from "@aalokdeep/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aalok Deep Pandit",
  description: "Technologist and lifelong learner based in Los Angeles. Digital garden for experiments, insights on technology, and photography.",
  icons: {
    icon: "https://aalokdeepassets.blob.core.windows.net/main-site/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SharedRootLayout>{children}</SharedRootLayout>;
}

