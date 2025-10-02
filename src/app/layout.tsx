import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Script from 'next/script';
import { ScoreTicker } from "@/components/ui/score-ticker";
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});


export const metadata: Metadata = {
  title: "Nova Stream",
  description: "Your universe of live sports streaming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='dark' style={{ colorScheme: 'dark' }}>
      <body className={cn("font-body antialiased", inter.variable, spaceGrotesk.variable)}>
        <ScoreTicker />
        {children}
        <Toaster />
        <Script type="module" src="https://widgets.api-sports.io/2.0.3/widgets.js" />
      </body>
    </html>
  );
}
