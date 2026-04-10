-- 認証済みユーザーは全テーブルを操作可能（管理者用）
CREATE POLICY "auth_all_agencies" ON agencies
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_counselors" ON counselors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_reviews" ON reviews
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_reservations" ON reservations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_slots" ON slots
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_shops" ON shops
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_episodes" ON episodes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_columns" ON columns
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_diagnosis_results" ON diagnosis_results
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- anonユーザーはSELECTのみ（ふたりへフロントサイト用）
CREATE POLICY "anon_select_counselors" ON counselors
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "anon_select_agencies" ON agencies
  FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_reviews" ON reviews
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "anon_select_shops" ON shops
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "anon_select_episodes" ON episodes
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "anon_select_columns" ON columns
  FOR SELECT TO anon USING (published_at IS NOT NULL);
