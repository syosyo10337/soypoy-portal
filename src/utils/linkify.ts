/**
 * URLを検出して分割する
 * テキスト内のURLを検出し、テキスト部分とURL部分に分割して返す
 */

export interface TextSegment {
  type: "text" | "url";
  content: string;
}

// URL検出用の正規表現
// http/https URLを検出
const URL_REGEX =
  /(https?:\/\/(?:[-\w@:%.+~#=]{1,256}\.)+[a-zA-Z0-9()]{1,6}\b(?:[-\w()@:%+.~#?&/=]*))/gi;

/**
 * テキストをURLとテキストに分割する
 */
export function parseTextWithUrls(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  const matches = text.matchAll(URL_REGEX);

  for (const match of matches) {
    const url = match[0];
    const matchIndex = match.index ?? 0;

    // URL前のテキストがあれば追加
    if (matchIndex > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, matchIndex),
      });
    }

    // URLを追加
    segments.push({
      type: "url",
      content: url,
    });

    lastIndex = matchIndex + url.length;
  }

  // 残りのテキストがあれば追加
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  // マッチがなかった場合は全体をテキストとして返す
  if (segments.length === 0) {
    segments.push({
      type: "text",
      content: text,
    });
  }

  return segments;
}

/**
 * テキストにURLが含まれているかチェック
 */
export function hasUrl(text: string): boolean {
  return URL_REGEX.test(text);
}
