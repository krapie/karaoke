import { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import type { Playlist } from '../../types';
import { Button } from '../ui';
import { cn } from '../../utils';

interface PlaylistTabsProps {
  playlists: Playlist[];
  activePlaylistId?: string;
  onPlaylistSelect: (playlist: Playlist) => void;
  onCreatePlaylist: () => void;
  onEditPlaylist: (playlist: Playlist, newName: string) => void;
  onDeletePlaylist: (playlist: Playlist) => void;
}

export const PlaylistTabs = ({
  playlists,
  activePlaylistId,
  onPlaylistSelect,
  onCreatePlaylist,
  onEditPlaylist,
  onDeletePlaylist,
}: PlaylistTabsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showingButtonsId, setShowingButtonsId] = useState<string | null>(null);

  const handlePlaylistSelect = (playlist: Playlist) => {
    // Always select the playlist when clicked
    onPlaylistSelect(playlist);
    // Hide buttons when switching playlists
    setShowingButtonsId(null);
  };

  const handleShowButtons = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent playlist selection
    // Only show buttons if this playlist is already active
    if (playlist.id === activePlaylistId) {
      setShowingButtonsId(showingButtonsId === playlist.id ? null : playlist.id);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Playlists
        </h2>
        <Button onClick={onCreatePlaylist} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Playlist
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-2 space-x-2">
        {playlists.length === 0 ? (
          <div className="text-gray-400 text-sm">No playlists available</div>
        ) : (
          playlists.map((playlist) => (
            <PlaylistTab
              key={playlist.id}
              playlist={playlist}
              isActive={playlist.id === activePlaylistId}
              isEditing={editingId === playlist.id}
              showButtons={showingButtonsId === playlist.id}
              onSelect={() => handlePlaylistSelect(playlist)}
              onShowButtons={(e) => handleShowButtons(playlist, e)}
              onEdit={() => setEditingId(playlist.id)}
              onCancelEdit={() => setEditingId(null)}
              onEditSubmit={(newName: string) => {
                setEditingId(null);
                onEditPlaylist(playlist, newName);
              }}
              onDelete={() => onDeletePlaylist(playlist)}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface PlaylistTabProps {
  playlist: Playlist;
  isActive: boolean;
  isEditing: boolean;
  showButtons: boolean;
  onSelect: () => void;
  onShowButtons: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onEditSubmit: (newName: string) => void;
  onDelete: () => void;
}

const PlaylistTab = ({
  playlist,
  isActive,
  isEditing,
  showButtons,
  onSelect,
  onShowButtons,
  onEdit,
  onCancelEdit,
  onEditSubmit,
  onDelete,
}: PlaylistTabProps) => {
  const [editName, setEditName] = useState(playlist.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      onEditSubmit(editName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditName(playlist.name);
      onCancelEdit();
    }
  };

  return (
    <div
      className={cn(
        'relative flex-shrink-0 group select-none',
        'bg-gray-800 rounded-lg border-2 transition-all duration-200',
        isActive
          ? 'border-red-500 shadow-md'
          : 'border-gray-600 hover:border-gray-500'
      )}
    >
      <div className="flex items-center p-3 min-w-[180px]">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={onCancelEdit}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-white outline-none"
              autoFocus
            />
          </form>
        ) : (
          <>
            <button
              onClick={onSelect}
              onMouseDown={(e) => e.preventDefault()} // Prevent text selection highlighting
              className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white truncate select-none user-select-none"
            >
              {playlist.name}
            </button>
            
            {/* Show "more" button only for active playlist */}
            {isActive && !showButtons && (
              <button
                onClick={onShowButtons}
                onMouseDown={(e) => e.preventDefault()}
                className="ml-2 p-1 h-6 w-6 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center select-none"
                title="Show edit/delete options"
              >
                <span className="text-xs">⋯</span>
              </button>
            )}
            
            {showButtons && (
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={onEdit}
                  onMouseDown={(e) => e.preventDefault()}
                  className="p-1.5 h-8 w-8 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center select-none"
                  title="Edit playlist"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={onDelete}
                  onMouseDown={(e) => e.preventDefault()}
                  className="p-1.5 h-8 w-8 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center select-none"
                  title="Delete playlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
