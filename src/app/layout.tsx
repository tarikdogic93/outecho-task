import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/header";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TopicHub",
  description:
    "Create, explore, and discuss topics with a vibrant community of users. Share your thoughts and join the conversation today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <QueryProvider>
          <Header />
          <main className="flex min-h-screen flex-col items-center bg-primary-foreground/30 p-4 pt-28">
            {children}
          </main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
