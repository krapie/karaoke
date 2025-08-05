import React, { useState } from 'react';
import { usePresences, useConnection } from '@yorkie-js/react';
import { Users, Wifi, WifiOff, Info } from 'lucide-react';

export const PresenceIndicator: React.FC = () => {
  const presences = usePresences();
  const connection = useConnection();
  const [showTooltip, setShowTooltip] = useState(false);

  const isConnected = connection === 'connected';
  const userCount = presences.length;

  return (
    <div className="relative">
      {/* Mobile: Compact View */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="flex items-center gap-1 p-2 rounded hover:bg-gray-800 transition-colors"
        >
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-400" />
          )}
          {isConnected && userCount > 0 && (
            <span className="text-blue-400 text-xs">{userCount}</span>
          )}
          <Info className="h-3 w-3 text-gray-400" />
        </button>

        {/* Mobile Tooltip */}
        {showTooltip && (
          <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg z-50 min-w-[200px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-400" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {isConnected && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">
                    {userCount} user{userCount !== 1 ? 's' : ''} online
                  </span>
                </div>
              )}
              {isConnected && userCount > 1 && (
                <div className="pt-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    {presences.slice(0, 8).map((presence, index) => (
                      <div
                        key={presence.clientID}
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: presence.presence?.color || `hsl(${index * 60}, 70%, 50%)`,
                        }}
                        title={presence.presence?.name || `User ${presence.clientID.slice(-4)}`}
                      />
                    ))}
                    {userCount > 8 && (
                      <span className="text-xs text-gray-400">+{userCount - 8}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Full View */}
      <div className="hidden sm:flex items-center gap-3 text-sm">
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-400" />
          )}
          <span 
            className={`text-xs ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* User Count */}
        {isConnected && (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-xs">
              {userCount} user{userCount !== 1 ? 's' : ''} online
            </span>
          </div>
        )}

        {/* Active Users Dots */}
        {isConnected && userCount > 1 && (
          <div className="flex items-center gap-1">
            {presences.slice(0, 5).map((presence, index) => (
              <div
                key={presence.clientID}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: presence.presence?.color || `hsl(${index * 60}, 70%, 50%)`,
                }}
                title={presence.presence?.name || `User ${presence.clientID.slice(-4)}`}
              />
            ))}
            {userCount > 5 && (
              <span className="text-xs text-gray-400">+{userCount - 5}</span>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close tooltip */}
      {showTooltip && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
};
