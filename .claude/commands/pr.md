現在のブランチの変更をpushしてPRを作成してください。

手順:
1. `git status` で未コミットの変更がないか確認。あればユーザーに報告して中断
2. `git log main...HEAD` と `git diff main...HEAD` で全変更を確認
3. リモートにpush（`-u` 付き）
4. `.github/pull_request_template.md` のテンプレートに沿ってPR本文を埋める
5. `gh pr create` でPRを作成
6. 作成されたPRのURLを表示
