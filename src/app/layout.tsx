import './globals.css';
import ClientWrapper from './ClientWrapper'; // Import from src/app

export const metadata = {
  title: 'Your Herbal Store',
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
