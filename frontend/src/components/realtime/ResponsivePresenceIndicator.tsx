import React, { useState } from 'react';
import { usePresences, useConnection } from '@yorkie-js/react';
import { Users, Wifi, WifiOff, ChevronDown, X } from 'lucide-react';

export const MobilePresenceIndicator: React.FC = () => {
  const presences = usePresences();
  const connection = useConnection();
  const [showDetails, setShowDetails] = useState(false);

  const isConnected = connection === 'connected';
  const userCount = presences.length;

  // Mobile compact view
  const CompactView = () => (
    <button
      onClick={() => setShowDetails(true)}
      className="flex items-center gap-1 p-1 rounded hover:bg-gray-800 transition-colors"
    >
      {isConnected ? (
        <Wifi className="h-4 w-4 text-green-400" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-400" />
      )}
      {isConnected && userCount > 0 && (
        <>
          <span className="text-blue-400 text-xs">{userCount}</span>
          <ChevronDown className="h-3 w-3 text-gray-400" />
        </>
      )}
    </button>
  );

  // Mobile detailed popup
  const DetailedView = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-gray-800 w-full rounded-t-lg p-4 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Connection Status</h3>
          <button
            onClick={() => setShowDetails(false)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-3">
          {isConnected ? (
            <Wifi className="h-5 w-5 text-green-400" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-400" />
          )}
          <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected to Yorkie' : 'Disconnected'}
          </span>
        </div>

        {/* User Count and List */}
        {isConnected && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 text-sm">
                {userCount} user{userCount !== 1 ? 's' : ''} online
              </span>
            </div>

            {/* Active Users List */}
            {userCount > 1 && (
              <div className="space-y-2">
                <p className="text-gray-300 text-sm font-medium">Active Users:</p>
                <div className="space-y-1">
                  {presences.map((presence, index) => (
                    <div key={presence.clientID} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: presence.presence?.color || `hsl(${index * 60}, 70%, 50%)`,
                        }}
                      />
                      <span className="text-gray-400 text-sm">
                        {presence.presence?.name || `User ${presence.clientID.slice(-4)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <CompactView />
      {showDetails && <DetailedView />}
    </>
  );
};

export const DesktopPresenceIndicator: React.FC = () => {
  const presences = usePresences();
  const connection = useConnection();

  const isConnected = connection === 'connected';
  const userCount = presences.length;

  return (
    <div className="flex items-center gap-3 text-sm">
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
  );
};

// Combined responsive component
export const PresenceIndicator: React.FC = () => {
  return (
    <>
      {/* Show mobile version on small screens */}
      <div className="sm:hidden">
        <MobilePresenceIndicator />
      </div>
      
      {/* Show desktop version on larger screens */}
      <div className="hidden sm:block">
        <DesktopPresenceIndicator />
      </div>
    </>
  );
};
