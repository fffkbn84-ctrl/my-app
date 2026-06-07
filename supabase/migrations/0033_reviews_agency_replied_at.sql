-- カウンセラー返信日時カラム。
-- futarive-counselor の口コミ返信ページ(handleReply)は
--   update({ agency_reply, agency_replied_at })
-- を発行するが、agency_replied_at カラムが存在しなかったため UPDATE が常に失敗し、
-- agency_reply が永続化されず口コミが「未返信」のまま残り、何度でも返信できてしまう
-- 不具合があった。カラムを追加して返信が正しく保存されるようにする
-- （保存後は ReviewCard が返信フォームを隠し「1回のみ・編集不可」が成立する）。
alter table public.reviews add column if not exists agency_replied_at timestamptz;
