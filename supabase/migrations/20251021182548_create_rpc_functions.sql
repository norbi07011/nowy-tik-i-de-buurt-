/*
  # Funkcje pomocnicze RPC

  ## Przegląd
  Tworzy funkcje RPC (Remote Procedure Calls) do obsługi liczników w tabelach.
  Funkcje te są bezpieczne, atomowe i wydajne.

  ## Funkcje
  - increment_post_likes - Zwiększa licznik polubień posta
  - decrement_post_likes - Zmniejsza licznik polubień posta
  - increment_post_saves - Zwiększa licznik zapisań posta
  - decrement_post_saves - Zmniejsza licznik zapisań posta
  - increment_post_comments - Zwiększa licznik komentarzy posta
  - decrement_post_comments - Zmniejsza licznik komentarzy posta
  - increment_post_views - Zwiększa licznik wyświetleń posta
*/

-- Increment post likes
CREATE OR REPLACE FUNCTION increment_post_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET likes_count = likes_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement post likes
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment post saves
CREATE OR REPLACE FUNCTION increment_post_saves(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET saves_count = saves_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement post saves
CREATE OR REPLACE FUNCTION decrement_post_saves(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET saves_count = GREATEST(0, saves_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment post comments
CREATE OR REPLACE FUNCTION increment_post_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET comments_count = comments_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement post comments
CREATE OR REPLACE FUNCTION decrement_post_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET comments_count = GREATEST(0, comments_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET views_count = views_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment post shares
CREATE OR REPLACE FUNCTION increment_post_shares(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET shares_count = shares_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
