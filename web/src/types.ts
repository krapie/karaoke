export interface Song {
  id: number;
  title: string;
  tj_number: string | null;
  created_at: string;
}

export interface SongDetail extends Song {
  lyrics: string;
}
