import type { Metadata } from 'next';
import { Inter, DM_Sans, DM_Mono } from 'next/font/google';
import { CSPostHogProvider } from './providers';

import './globals.css';

const DM = DM_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Glaze AI',
  description: 'The place to congratulate your friends, in a weird way...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={DM.className}>
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </body>
    </html>
  );
}
