export interface Song {
  id: number;
  title: string;
  singer: string | null;
  tj_number: string | null;
  created_at: string;
}

export interface SongDetail extends Song {
  lyrics: string;
}
