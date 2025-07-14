import '@/app/globals.css';
import ClientWrapper from './ClientWrapper';

export const metadata = {
  title: 'Herbolife Store',
  description: 'Buy Herbal Products Online',
  icons: {
    icon: '/logos.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logos.png" />
      </head>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
