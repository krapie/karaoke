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
  onEditPlaylist: (playlist: Playlist) => void;
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

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Playlists
        </h2>
        <Button onClick={onCreatePlaylist} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Playlist
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-2 space-x-2">
        {playlists.map((playlist) => (
          <PlaylistTab
            key={playlist.id}
            playlist={playlist}
            isActive={playlist.id === activePlaylistId}
            isEditing={editingId === playlist.id}
            onSelect={() => onPlaylistSelect(playlist)}
            onEdit={() => setEditingId(playlist.id)}
            onCancelEdit={() => setEditingId(null)}
            onEditSubmit={() => {
              setEditingId(null);
              onEditPlaylist(playlist);
            }}
            onDelete={() => onDeletePlaylist(playlist)}
          />
        ))}
      </div>
    </div>
  );
};

interface PlaylistTabProps {
  playlist: Playlist;
  isActive: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onEditSubmit: () => void;
  onDelete: () => void;
}

const PlaylistTab = ({
  playlist,
  isActive,
  isEditing,
  onSelect,
  onEdit,
  onCancelEdit,
  onEditSubmit,
  onDelete,
}: PlaylistTabProps) => {
  const [editName, setEditName] = useState(playlist.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      onEditSubmit();
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
        'relative flex-shrink-0 group',
        'bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200',
        isActive
          ? 'border-red-500 shadow-md'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      )}
    >
      <div className="flex items-center p-3 min-w-[120px]">
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
              className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white truncate"
            >
              {playlist.name}
            </button>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="p-1 h-6 w-6"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
