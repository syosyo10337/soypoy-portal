#!/bin/bash
set -euo pipefail

echo "📦 依存関係を同期中..."
pnpm install
echo "✅ 依存関係の同期が完了しました"

exec "$@"
