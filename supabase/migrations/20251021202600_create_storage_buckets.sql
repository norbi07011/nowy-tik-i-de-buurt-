/*
  # Utwórz storage buckets dla plików

  ## Opis
  Tworzy buckety w Supabase Storage do przechowywania:
  - Avatarów użytkowników
  - Zdjęć postów
  - Zdjęć galerii biznesów

  ## Bezpieczeństwo
  - Publiczny dostęp do odczytu
  - Tylko właściciele mogą uploadować/usuwać
*/

-- Bucket dla avatarów
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket dla postów
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts',
  'posts',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket dla galerii biznesowych
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'galleries',
  'galleries',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- Polityki dla avatars bucket
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Polityki dla posts bucket
CREATE POLICY "Public can view posts"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'posts');

CREATE POLICY "Users can upload posts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'posts');

CREATE POLICY "Users can delete own posts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'posts');

-- Polityki dla galleries bucket
CREATE POLICY "Public can view galleries"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'galleries');

CREATE POLICY "Business users can upload to galleries"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'galleries');

CREATE POLICY "Business users can delete from galleries"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'galleries');
