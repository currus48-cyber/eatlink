import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";

import { auth } from "@/auth";
import { SessionProvider } from "@/components/providers/session-provider";

// EatLink brand typefaces — Archivo for UI/body, Bricolage Grotesque for
// restaurant identity and headings. See globals.css for how these feed the
// `font-sans` / `font-heading` theme tokens.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EatLink",
  description: "EatLink dashboard",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${bricolageGrotesque.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
