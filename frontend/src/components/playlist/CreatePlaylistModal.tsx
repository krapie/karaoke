import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Card } from '../ui';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
      setName('');
      onClose();
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Create New Playlist</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="playlist-name" 
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Playlist Name
              </label>
              <Input
                id="playlist-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter playlist name..."
                autoFocus
                disabled={isSubmitting}
                maxLength={50}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Playlist'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
