import '@/app/globals.css';
import ClientWrapper from './ClientWrapper';

export const metadata = {
  title: 'Herbolife Store',
  description: 'Buy Herbal Products Online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
