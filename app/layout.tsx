import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Naughty Bot',
  description: 'More Than a Chat, It\'s an Experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <AuthProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 