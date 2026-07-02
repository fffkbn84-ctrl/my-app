---
name: repo-tidy
description: リポジトリと運用ドキュメントの定期整理。TODO.md の重複統合・完了圧縮、WORKLOG の肥大チェック、ブランチ棚卸し、docs のアーカイブ退避。「TODO整理して」「リポジトリ掃除」「棚卸し」等で使用（月1回程度）。
---

# /repo-tidy — リポジトリ・ドキュメント棚卸し

「やることが見てわかる」状態を維持するための定期整理。**情報は消さず、アーカイブに退避する**のが原則。

## 手順

### 1. TODO.md の整理
1. 現行 TODO.md を `docs/archive/todo-full-archive-YYYY-MM-DD.md` にコピー（退避してから触る）
2. `- [x]` 済み項目と、複数の日付セクションに重複している項目を統合
3. 構成は現行フォーマットを維持：
   📌引き継ぎ → 🔴ふうか操作待ち → 🟠定常運用 → 🟡次の制作 → 🔵中期開発 → 📌確定済みスタイル → 🗂履歴
4. **判断に迷う項目は消さず 🔵 に残す**（勝手に「廃止」判断しない。廃止は理由を書けるものだけ）

### 2. WORKLOG.md のチェック
- 3,000行を超えていたら、古い年月分を `docs/archive/worklog-YYYY-MM.md` へ移し、WORKLOG には「→アーカイブ参照」の1行を残す
- 直近2ヶ月分は WORKLOG に残す（セッション引き継ぎで参照するため）

### 3. ブランチ棚卸し（報告のみ・削除はしない）
1. `git fetch origin && git branch -r` でリモートブランチ一覧
2. main にマージ済み（`git branch -r --merged origin/main`）かつ保護対象でないものをリストアップ
3. ⚠️ **削除禁止**：`main`／`claude/fix-profile-creation-1clpG`（counselor本番）／`claude/futarive-admin-dashboard-iKBfw`（admin本番）
4. この環境の git プロキシはブランチ削除 push を弾くため、**削除候補を TODO.md の🔴に記載してふうかに委ねる**（GitHub UI から削除）

### 4. docs/ の整理
- 役目を終えた実装指示書・引き継ぎ書は `docs/archive/` へ移動（git mv で履歴維持）
- `docs/sns/packs/`・`docs/sns/reviews/` は生成資産なので消さない

### 5. 整合性チェック
- CLAUDE.md の「⚠️要修正」系の注記が現状と合っているか（古い警告は事実確認のうえ訂正）
- TODO.md 冒頭の Skill 一覧が `.claude/skills/` の実体と一致しているか
- `npm run qa:content` が通るか

### 6. 仕上げ
- WORKLOG に整理内容を1エントリ追記 → commit（docs のみの場合、main への push 順に注意＝デプロイの落とし穴）
- Notion「運営カレンダー」に次回の棚卸し予定（1ヶ月後）を追加

## 禁止事項
- アーカイブなしでの削除・要約（原文は必ず docs/archive/ に残す)
- 本番運用ブランチの削除・force push
- CLAUDE.md の世界観・ルール部分の書き換え（事実訂正のみ可。方針変更はふうか決裁）
