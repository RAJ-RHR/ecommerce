import '@/app/globals.css';
import ClientWrapper from './ClientWrapper';
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Script from 'next/script';

export const metadata = {
  title: 'Herbolife Store',
  description:
    'Buy original Ayurvedic products at best prices. High-quality herbal supplements for wellness, immunity, male enhancement, weight loss, and more – only at Herbo life Store.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        
        {/* Google Analytics script (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G3WPX48QFZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G3WPX48QFZ');
          `}
        </Script>
      </head>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
        <VercelAnalytics />
      </body>
    </html>
  );
}
