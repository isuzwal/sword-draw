"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export default function ThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
  );
}
