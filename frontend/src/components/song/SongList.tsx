import { useState } from 'react';
import { Music, Edit3, Trash2, GripVertical } from 'lucide-react';
import type { Song } from '../../types';
import { Button, Card } from '../ui';
import { formatRelativeTime, truncateText } from '../../utils';

interface SongListProps {
  songs: Song[];
  onSongSelect: (song: Song) => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (song: Song) => void;
  onReorderSongs?: (dragIndex: number, hoverIndex: number) => void;
}

export const SongList = ({
  songs,
  onSongSelect,
  onEditSong,
  onDeleteSong,
  onReorderSongs,
}: SongListProps) => {
  if (songs.length === 0) {
    return (
      <Card className="text-center py-12">
        <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No songs yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add your first song to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {songs.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          index={index}
          onSelect={() => onSongSelect(song)}
          onEdit={() => onEditSong(song)}
          onDelete={() => onDeleteSong(song)}
          onReorder={onReorderSongs}
        />
      ))}
    </div>
  );
};

interface SongCardProps {
  song: Song;
  index: number;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
}

const SongCard = ({
  song,
  index,
  onSelect,
  onEdit,
  onDelete,
  onReorder,
}: SongCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== index && onReorder) {
      onReorder(dragIndex, index);
    }
  };

  return (
    <Card
      className={`group transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
      padding="none"
    >
      <div className="flex items-center p-4">
        {onReorder && (
          <div
            className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <GripVertical className="h-5 w-5" />
          </div>
        )}

        <div className="flex-1 min-w-0" onClick={onSelect}>
          <button className="w-full text-left">
            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
              {song.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {song.artist}
            </p>
            {song.lyrics && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {truncateText(song.lyrics.replace(/\n/g, ' '), 60)}
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {formatRelativeTime(song.updatedAt)}
            </p>
          </button>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
