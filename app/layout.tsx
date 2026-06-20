import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stop the World",
  description: "Are you ready to stop the world? A Forge of the Soul apparatus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
