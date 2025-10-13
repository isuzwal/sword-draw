import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
          {children}
          <Toaster
            richColors
            toastOptions={{
              classNames: {
                success: "bg-green-600 text-white border-green-700",
                error: "bg-red-600 text-white border-red-700",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
