import React, { useMemo } from 'react';
import { YorkieProvider, DocumentProvider } from '@yorkie-js/react';
import type { KaraokeDocument } from '../types';

// Replace with your actual Yorkie project API key
const YORKIE_API_KEY = import.meta.env.VITE_YORKIE_API_KEY || 'YOUR_YORKIE_API_KEY';

// Function to get document key from URL path
const getDocumentKey = (): string => {
  const path = window.location.pathname;
  
  // Remove leading slash and use path as document key
  // If no path or just "/", use default
  const pathKey = path.slice(1) || 'default';
  
  // Sanitize the key to ensure it's valid for Yorkie
  // Allow only alphanumeric characters, hyphens, and underscores
  const sanitizedKey = pathKey.replace(/[^a-zA-Z0-9\-_]/g, '-');
  
  return sanitizedKey;
};

// Initial document structure
const initialRoot: KaraokeDocument = {
  playlists: {},
  songs: {},
  playlistOrder: [],
  songOrder: {},
};

interface KaraokeProviderProps {
  children: React.ReactNode;
}

export const KaraokeProvider: React.FC<KaraokeProviderProps> = ({ children }) => {
  // Memoize the document key to prevent unnecessary re-renders
  const documentKey = useMemo(() => getDocumentKey(), []);
  
  return (
    <YorkieProvider apiKey={YORKIE_API_KEY}>
      <DocumentProvider 
        docKey={documentKey} 
        initialRoot={initialRoot}
      >
        {children}
      </DocumentProvider>
    </YorkieProvider>
  );
};
