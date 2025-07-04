import { useState } from 'react';
import { X } from 'lucide-react';
import type { Song, CreateSongRequest, UpdateSongRequest } from '../../types';
import { Button, Input, Textarea, Card } from '../ui';

interface SongFormProps {
  song?: Song;
  playlistId: string;
  onSubmit: (song: CreateSongRequest | UpdateSongRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const SongForm = ({
  song,
  playlistId,
  onSubmit,
  onCancel,
  loading = false,
}: SongFormProps) => {
  const [formData, setFormData] = useState({
    title: song?.title || '',
    artist: song?.artist || '',
    lyrics: song?.lyrics || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const songData = song
        ? formData // For updates, just send the changed fields
        : { ...formData, playlistId }; // For creates, include playlistId

      await onSubmit(songData);
    } catch (error) {
      console.error('Failed to save song:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {song ? 'Edit Song' : 'Add New Song'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Song Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          placeholder="Enter song title"
          required
        />

        <Input
          label="Artist"
          value={formData.artist}
          onChange={(e) => handleChange('artist', e.target.value)}
          error={errors.artist}
          placeholder="Enter artist name"
          required
        />

        <Textarea
          label="Lyrics (Optional)"
          value={formData.lyrics}
          onChange={(e) => handleChange('lyrics', e.target.value)}
          error={errors.lyrics}
          placeholder="Enter song lyrics..."
          rows={8}
          className="font-mono text-sm"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {song ? 'Update Song' : 'Add Song'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
