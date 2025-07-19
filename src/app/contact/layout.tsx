import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Herbolife Store',
  description: 'Get in touch with the Herbolife Store team for inquiries, support, or feedback. We’re here to help you on your health and wellness journey.',
  alternates: {
    canonical: 'https://store.herbolife.in/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
