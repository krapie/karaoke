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

function isEnglishOnly(text: string): boolean {
  return !/[^\x00-\x7F]/.test(text);
}

export function parseLyrics(raw: string): LyricBlock[] {
  const blocks: LyricBlock[] = [];
  const rawBlocks = raw.trim().split(/\n\s*\n/);

  for (const block of rawBlocks) {
    const lines = block.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    if (lines.length >= 3) {
      blocks.push({
        type: 'verse',
        japanese: lines[0].trim(),
        phonetic: lines[1].trim(),
        translation: lines[2].trim(),
      });
    } else if (lines.every(l => isEnglishOnly(l))) {
      blocks.push({
        type: 'phrase',
        text: lines.map(l => l.trim()).join(' '),
      });
    }
  }

  return blocks;
}
