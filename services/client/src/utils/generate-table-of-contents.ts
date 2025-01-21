 export function generateTableOfContents(content: string): { [key: string]: string } {
    const headerRegex = /^##\s+(.+)$/gm; // ## のみを対象にする正規表現
    let toc: { [key: string]: string } = {}; // ヘッダーとリンクを格納するオブジェクト
    let match;

    while ((match = headerRegex.exec(content)) !== null) {
      const headerText = match[1]; // ヘッダーのテキスト
      const anchorId = headerText
        .toLowerCase()
        .replace(/\s+/g, "-") // スペースをハイフンに変換
        .replace(/[^a-z0-9\-]/g, ""); // 不正な文字を削除

      toc[headerText] = `#${anchorId}`;
    }
    return toc;
  }