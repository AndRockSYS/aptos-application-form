import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import AptosProvider from '@/context/AptosProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
    title: 'Aptos Form',
    description: 'Aptos Application Form',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <AptosProvider>
                <body className={inter.className}>{children}</body>
            </AptosProvider>
        </html>
    );
}
