export interface Verse {
  japanese: string;
  phonetic: string;
  translation: string;
}

export function parseLyrics(raw: string): Verse[] {
  const verses: Verse[] = [];
  const blocks = raw.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n').filter(l => l.trim());
    if (lines.length < 3) continue;
    verses.push({
      japanese: lines[0].trim(),
      phonetic: lines[1].trim(),
      translation: lines[2].trim(),
    });
  }

  return verses;
}
