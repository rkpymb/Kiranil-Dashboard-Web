import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kiranil Dashboard',
  description: 'Kiranil Dashboard Panel'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="manifest"
          href={'https://api.roservicewalaindia.in/open/manifest.json'}
        />
      </head>
      <body
        className={`${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
