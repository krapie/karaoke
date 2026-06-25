export interface Verse {
  type: 'verse';
  japanese: string;
  phonetic: string;
  translation: string;
}

export interface Phrase {
  type: 'phrase';
  text: string;
}

export type LyricBlock = Verse | Phrase;

export function parseLyrics(raw: string, language: string): LyricBlock[] {
  if (language === 'korean' || language === 'english') {
    return raw
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(text => ({ type: 'phrase', text }));
  }

  // japanese: 3-line blocks (original / phonetic / translation)
  const blocks: LyricBlock[] = [];
  for (const block of raw.trim().split(/\n\s*\n/)) {
    const lines = block.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    if (lines.length >= 3) {
      blocks.push({
        type: 'verse',
        japanese: lines[0].trim(),
        phonetic: lines[1].trim(),
        translation: lines[2].trim(),
      });
    } else {
      blocks.push({ type: 'phrase', text: lines.map(l => l.trim()).join(' ') });
    }
  }
  return blocks;
}
