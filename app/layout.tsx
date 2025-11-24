import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aalok Deep Pandit",
  description: "Technologist and lifelong learner based in Los Angeles. Digital garden for experiments, insights on technology, and photography.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

