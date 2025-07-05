import { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, Save, X, Trash2 } from 'lucide-react';
import type { Song, UpdateSongRequest } from '../../types';
import { Button, Card, Textarea } from '../ui';
import { formatDate } from '../../utils';

interface SongDetailsProps {
  song: Song;
  onBack: () => void;
  onUpdate: (songId: string, updates: UpdateSongRequest) => Promise<void>;
  onDelete: (songId: string) => Promise<void>;
  onEdit: (song: Song) => void;
}

export const SongDetails = ({ song, onBack, onUpdate, onDelete, onEdit }: SongDetailsProps) => {
  const [isEditingLyrics, setIsEditingLyrics] = useState(false);
  const [lyrics, setLyrics] = useState(song.lyrics || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLyrics(song.lyrics || '');
  }, [song.lyrics]);

  const handleSaveLyrics = async () => {
    if (lyrics === song.lyrics) {
      setIsEditingLyrics(false);
      return;
    }

    try {
      setSaving(true);
      await onUpdate(song.id, { lyrics });
      setIsEditingLyrics(false);
    } catch (error) {
      console.error('Failed to update lyrics:', error);
      // Reset lyrics on error
      setLyrics(song.lyrics || '');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setLyrics(song.lyrics || '');
    setIsEditingLyrics(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      try {
        await onDelete(song.id);
        onBack(); // Navigate back after deletion
      } catch (error) {
        console.error('Failed to delete song:', error);
        alert('Failed to delete song');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Playlist
        </Button>        <Card>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {song.title}
            </h1>
            <p className="text-xl text-gray-400 mb-4">
              by {song.artist}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Added {formatDate(song.createdAt)}
              {song.updatedAt !== song.createdAt && (
                <> • Updated {formatDate(song.updatedAt)}</>
              )}
            </p>
            
            {/* Edit and Delete buttons moved below */}
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(song)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Lyrics
          </h2>
          {!isEditingLyrics ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingLyrics(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Lyrics
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveLyrics}
                loading={saving}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>

        {isEditingLyrics ? (
          <Textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Enter song lyrics..."
            rows={20}
            className="font-mono text-sm leading-relaxed"
          />
        ) : (
          <div className="bg-gray-900 rounded-lg p-6">
            {lyrics ? (
              <pre className="font-noto-sans-jp text-base leading-relaxed whitespace-pre-wrap text-gray-100">
                {lyrics}
              </pre>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  No lyrics available
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditingLyrics(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Add Lyrics
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
