import { useState } from 'react';
import { Music, GripVertical, Search, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Song } from '../../types';
import { Card } from '../ui';
import { formatRelativeTime, truncateText } from '../../utils';

interface SongListProps {
  songs: Song[];
  onSongSelect: (song: Song) => void;
  onReorderSongs?: (newOrder: Song[]) => void;
}

export const SongList = ({
  songs,
  onSongSelect,
  onReorderSongs,
}: SongListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filter songs based on search query
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => setSearchQuery('');

  // Set up sensors for drag and drop with mobile support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay for mobile to distinguish from scrolling
        tolerance: 5, // 5px tolerance for touch movement
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id && onReorderSongs) {
      const oldIndex = songs.findIndex(song => song.id === active.id);
      const newIndex = songs.findIndex(song => song.id === over?.id);
      
      const newOrder = arrayMove(songs, oldIndex, newIndex);
      onReorderSongs(newOrder);
      
      // Success haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
    }
  };

  const activeSong = activeId ? songs.find(song => song.id === activeId) : null;

  if (songs.length === 0) {
    return (
      <Card className="text-center py-12">
        <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          No songs yet
        </h3>
        <p className="text-gray-400">
          Add your first song to get started
        </p>
      </Card>
    );
  }

  return (
    <div>
      {/* Search bar */}
      <div className="mb-4 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search results count */}
      {searchQuery && (
        <div className="mb-3 text-sm text-gray-400">
          {filteredSongs.length} of {songs.length} songs
        </div>
      )}

      {/* Songs list with drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={searchQuery ? [] : songs.map(song => song.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {(searchQuery ? filteredSongs : songs).map((song) => (
              <SortableItem
                key={song.id}
                song={song}
                onSelect={() => onSongSelect(song)}
                canDrag={!searchQuery && !!onReorderSongs}
              />
            ))}
          </div>
        </SortableContext>
        
        <DragOverlay>
          {activeSong ? (
            <Card
              className="shadow-2xl border-2 border-red-500 opacity-95 transform rotate-3"
              padding="none"
            >
              <div className="flex items-center p-4">
                <div className="mr-3 text-red-400">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-white truncate">
                    {activeSong.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {activeSong.artist}
                  </p>
                </div>
              </div>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

interface SortableItemProps {
  song: Song;
  onSelect: () => void;
  canDrag: boolean;
}

const SortableItem = ({ song, onSelect, canDrag }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id, disabled: !canDrag });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group transition-all duration-200 hover:shadow-md ${
        isDragging ? 'z-50 shadow-2xl scale-105' : ''
      }`}
      padding="none"
    >
      <div className="flex items-center p-4">
        {canDrag && (
          <div
            className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 
                       touch-none select-none
                       min-w-[44px] min-h-[44px] 
                       flex items-center justify-center
                       md:min-w-[24px] md:min-h-[24px]
                       -ml-1 -mt-1 -mb-1
                       rounded-lg
                       hover:bg-gray-700/50 active:bg-gray-600/50
                       transition-colors duration-150"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
        )}

        <div className="flex-1 min-w-0" onClick={onSelect}>
          <button className="w-full text-left touch-manipulation">
            <h3 className="text-base font-medium text-white truncate">
              {song.title}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {song.artist}
            </p>
            {song.lyrics && (
              <p className="text-xs text-gray-500 mt-1">
                {truncateText(song.lyrics.replace(/\n/g, ' '), 60)}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formatRelativeTime(song.updatedAt)}
            </p>
          </button>
        </div>
      </div>
    </Card>
  );
};

