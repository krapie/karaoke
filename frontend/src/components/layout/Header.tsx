import { Menu, Music } from 'lucide-react';
import { Button } from '../ui';
import { PresenceIndicator } from '../realtime/PresenceIndicator';

interface HeaderProps {
  onMenuToggle?: () => void;
  title?: string;
  onLogoClick?: () => void;
}

export const Header = ({ onMenuToggle, title = 'Karaoke', onLogoClick }: HeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="md:hidden mr-2 p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center min-w-0">
              <button
                onClick={onLogoClick}
                className="flex items-center hover:opacity-80 transition-opacity min-w-0"
              >
                <Music className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mr-2 flex-shrink-0" />
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                  {/* Show title only on larger screens */}
                  <span className="hidden sm:inline">{title}</span>
                </h1>
              </button>
            </div>
          </div>
          
          {/* Real-time presence indicator - with reduced spacing on mobile */}
          <div className="flex items-center ml-2 flex-shrink-0">
            <PresenceIndicator />
          </div>
        </div>
      </div>
    </header>
  );
};
