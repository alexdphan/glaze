import type { Metadata } from 'next';
import { Inter, DM_Sans, DM_Mono } from 'next/font/google';
import { CSPostHogProvider } from './providers';

import './globals.css';

const DM = DM_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={DM.className}>
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </body>
    </html>
  );
}
