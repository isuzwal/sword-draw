import type { Metadata } from "next";
import "@fontsource/inter";
import "./globals.css";
import ThemeLayout from "./themeLayout";

export const metadata: Metadata = {
  title: "PrismArt",
  description: "Let give your art life with help of the prismart ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, sans-serif" }}>
        <ThemeLayout>
          {children}
        </ThemeLayout>
      </body>
    </html>
  );
}
