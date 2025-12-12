import { ReactNode } from 'react';

interface CertificatesLayoutProps {
  children: ReactNode;
}

export default function CertificatesLayout({ children }: CertificatesLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

export const metadata = {
  title: 'Certificates - AuraLearn',
  description: 'Earn professional certificates in web development and programming',
};
