import { Menu, Music } from 'lucide-react';
import { Button } from '../ui';

interface HeaderProps {
  onMenuToggle?: () => void;
  title?: string;
  onLogoClick?: () => void;
}

export const Header = ({ onMenuToggle, title = 'Karaoke', onLogoClick }: HeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="md:hidden mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <button
                onClick={onLogoClick}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Music className="h-8 w-8 text-red-600 mr-2" />
                <h1 className="text-xl font-bold text-white">
                  {title}
                </h1>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
