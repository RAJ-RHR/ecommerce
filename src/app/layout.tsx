import '@/app/globals.css';
import ClientWrapper from './ClientWrapper';

export const metadata = {
  title: 'Herbolife Store',
  description:
    'Buy original Ayurvedic products at best prices. High-quality herbal supplements for wellness, immunity,male enhacement, weight loss, and more – only at Herbo life Store.',
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
      </head>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
