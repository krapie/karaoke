import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  onLogoClick?: () => void;
}

export const Layout = ({ children, onLogoClick }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header onLogoClick={onLogoClick} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};
