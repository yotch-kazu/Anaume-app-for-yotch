import type { ParsedPart } from '../types';

const blankPattern = /\{\{([\s\S]*?)\}\}/g;

// 問題文を通常テキストと穴埋め部分に分ける。
export function parseBlanks(text: string): ParsedPart[] {
  const parts: ParsedPart[] = [];
  let lastIndex = 0;
  let blankIndex = 0;

  for (const match of text.matchAll(blankPattern)) {
    const matchIndex = match.index ?? 0;
    const before = text.slice(lastIndex, matchIndex);

    if (before) {
      parts.push({ type: 'text', value: before });
    }

    parts.push({
      type: 'blank',
      value: match[1].trim(),
      blankIndex,
    });

    blankIndex += 1;
    lastIndex = matchIndex + match[0].length;
  }

  const rest = text.slice(lastIndex);
  if (rest) {
    parts.push({ type: 'text', value: rest });
  }

  return parts;
}
