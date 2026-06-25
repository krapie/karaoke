export type SongLanguage = 'japanese' | 'korean' | 'english';

export interface Song {
  id: number;
  title: string;
  singer: string | null;
  tj_number: string | null;
  language: SongLanguage;
  created_at: string;
}

export interface SongDetail extends Song {
  lyrics: string;
}
