export interface ParsedSection {
  label: string;
  content: string;
}

/**
 * Markdownの見出し形式（## または ###）でdescriptionをセクションに分割する
 * 見出しがない場合は全体を「内容」として返す
 */
export function parseEventDescription(
  description: string | null | undefined,
): ParsedSection[] {
  if (!description) {
    return [];
  }

  const lines = description.split("\n");
  const sections: ParsedSection[] = [];
  let currentLabel: string | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // ## または ### で始まる行を見出しとして検出
    const headingMatch = line.match(/^#{2,3}\s+(.+)$/);

    if (headingMatch) {
      // 前のセクションを保存
      if (currentLabel !== null) {
        sections.push({
          label: currentLabel,
          content: currentContent.join("\n").trim(),
        });
      }
      currentLabel = headingMatch[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // 最後のセクションを保存
  if (currentLabel !== null) {
    sections.push({
      label: currentLabel,
      content: currentContent.join("\n").trim(),
    });
  }

  // 見出しがなかった場合は全体を「内容」として返す
  if (sections.length === 0 && description.trim()) {
    return [{ label: "内容", content: description.trim() }];
  }

  // 空のコンテンツを持つセクションを除外
  return sections.filter((section) => section.content.length > 0);
}
