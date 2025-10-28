import type { Metadata } from "next";
import "@fontsource/inter";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";




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
