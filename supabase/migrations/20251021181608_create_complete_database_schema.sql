/*
  # 🚀 PEŁNA BAZA DANYCH DLA APLIKACJI TIKTAK

  ## 📋 Przegląd
  Kompletny schemat bazy danych dla platformy social media łączącej użytkowników
  i biznesy z funkcjonalnościami TikTok-style feed, wiadomości, płatności, promocji.

  ## 🗂️ Struktura - 29 TABEL

  ### 👥 Użytkownicy (5 tabel)
  - profiles - Profile użytkowników i biznesów
  - user_preferences - Ustawienia i preferencje
  - business_profiles - Szczegóły biznesów
  - business_hours - Godziny otwarcia
  - business_social_media - Social media linki

  ### 📱 Treści (8 tabel)
  - posts - Posty i ogłoszenia
  - post_media - Media w postach
  - post_likes - Polubienia
  - post_saves - Zapisane posty
  - comments - Komentarze
  - photos - Galeria zdjęć
  - movies - Galeria filmów

  ### 💬 Komunikacja (4 tabele)
  - conversations - Konwersacje
  - messages - Wiadomości
  - message_attachments - Załączniki
  - notifications - Powiadomienia

  ### 🎯 Marketing (6 tabel)
  - promotions - Promocje -35%
  - reviews - Opinie
  - review_photos - Zdjęcia opinii
  - campaigns - Kampanie reklamowe
  - campaign_media - Media kampanii
  - analytics_events - Analityka

  ### 💳 Płatności (5 tabel)
  - payment_methods - Metody płatności
  - subscriptions - Subskrypcje
  - transactions - Transakcje
  - invoices - Faktury
  - payouts - Wypłaty

  ### 🔗 Inne (2 tabele)
  - follows - Obserwowanie
  - saved_searches - Zapisane wyszukiwania

  ## 🔒 Bezpieczeństwo
  ✅ RLS włączone na WSZYSTKICH tabelach
  ✅ Polityki dostępu dla authenticated users
  ✅ Sprawdzanie własności danych
  ✅ Zabezpieczenia przed nieautoryzowanym dostępem
*/

-- ============================================================================
-- KROK 1: TYPY ENUM
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE account_type AS ENUM ('user', 'business');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE post_type AS ENUM ('standard', 'promotion', 'event', 'job', 'property', 'product', 'service', 'announcement');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE media_type AS ENUM ('image', 'video', 'document');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'location');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'new_message', 'new_review', 'payment_success', 'payment_failed',
    'subscription_expiring', 'campaign_approved', 'post_approved',
    'business_verified', 'new_follower', 'system_announcement'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'unpaid', 'trialing');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE business_category AS ENUM (
    'restaurant', 'retail', 'services', 'healthcare', 'fitness', 'beauty',
    'automotive', 'construction', 'education', 'entertainment', 'real-estate',
    'technology', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- KROK 2: TABELE UŻYTKOWNIKÓW
-- ============================================================================

-- Profiles użytkowników
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  account_type account_type NOT NULL DEFAULT 'user',
  profile_image text,
  phone text,
  bio text,
  city text,
  location text,
  language text DEFAULT 'nl',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  notifications_email boolean DEFAULT true,
  notifications_push boolean DEFAULT true,
  notifications_sms boolean DEFAULT false,
  notifications_marketing boolean DEFAULT false,
  privacy_show_profile boolean DEFAULT true,
  privacy_show_location boolean DEFAULT true,
  privacy_allow_messages boolean DEFAULT true,
  theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business profiles
CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name text NOT NULL,
  owner_name text NOT NULL,
  description text,
  category business_category DEFAULT 'other',
  phone text,
  email text,
  website text,
  whatsapp text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'Netherlands',
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  cover_image text,
  logo_image text,
  is_verified boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  rating decimal(3, 2) DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business hours
CREATE TABLE IF NOT EXISTS business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_open boolean DEFAULT true,
  open_time time,
  close_time time,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_id, day_of_week)
);

-- Business social media
CREATE TABLE IF NOT EXISTS business_social_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  facebook text,
  instagram text,
  linkedin text,
  twitter text,
  tiktok text,
  youtube text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- KROK 3: TABELE TREŚCI
-- ============================================================================

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES business_profiles(id) ON DELETE SET NULL,
  type post_type DEFAULT 'standard',
  title text,
  content text NOT NULL,
  location text,
  city text,
  tags text[] DEFAULT '{}',
  price decimal(10, 2),
  is_promoted boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  saves_count integer DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_business_id ON posts(business_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Post media
CREATE TABLE IF NOT EXISTS post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  type media_type DEFAULT 'image',
  title text,
  description text,
  size integer,
  mime_type text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_media_post_id ON post_media(post_id);

-- Post likes
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Post saves
CREATE TABLE IF NOT EXISTS post_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_saves_post_id ON post_saves(post_id);
CREATE INDEX IF NOT EXISTS idx_post_saves_user_id ON post_saves(user_id);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Photos gallery
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES business_profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text,
  location text,
  city text,
  province text,
  is_featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_business_id ON photos(business_id);

-- Movies gallery
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES business_profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  poster_url text,
  category text,
  duration text,
  language text DEFAULT 'Nederlands',
  video_quality text DEFAULT 'HD',
  location text,
  city text,
  province text,
  marketing_category text,
  target_audience text[] DEFAULT '{}',
  budget text,
  business_type text,
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  rating decimal(3, 2) DEFAULT 0,
  year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_movies_user_id ON movies(user_id);
CREATE INDEX IF NOT EXISTS idx_movies_business_id ON movies(business_id);

-- ============================================================================
-- KROK 4: TABELE KOMUNIKACJI
-- ============================================================================

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(participant_1_id, participant_2_id),
  CHECK (participant_1_id != participant_2_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_p1 ON conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_p2 ON conversations(participant_2_id);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  type message_type DEFAULT 'text',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Message attachments
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  type media_type DEFAULT 'image',
  size integer,
  mime_type text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- KROK 5: TABELE MARKETINGOWE
-- ============================================================================

-- Promotions
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  discount_type text DEFAULT 'percentage',
  discount_value decimal(10, 2) NOT NULL,
  code text,
  conditions text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  max_usage integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promotions_business_id ON promotions(business_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active) WHERE is_active = true;

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  comment text NOT NULL,
  is_verified boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  business_response text,
  business_response_at timestamptz,
  source text DEFAULT 'platform',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Review photos
CREATE TABLE IF NOT EXISTS review_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_photos_review_id ON review_photos(review_id);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'draft',
  budget_total decimal(10, 2) NOT NULL,
  budget_spent decimal(10, 2) DEFAULT 0,
  currency text DEFAULT 'EUR',
  targeting_cities text[] DEFAULT '{}',
  targeting_radius integer,
  targeting_interests text[] DEFAULT '{}',
  content_headline text,
  content_description text,
  content_cta text,
  content_landing_url text,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  is_always_on boolean DEFAULT false,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_business_id ON campaigns(business_id);

-- Campaign media
CREATE TABLE IF NOT EXISTS campaign_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  type media_type DEFAULT 'image',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaign_media_campaign_id ON campaign_media(campaign_id);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  business_id uuid REFERENCES business_profiles(id) ON DELETE SET NULL,
  post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb,
  ip_address inet,
  user_agent text,
  device_type text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_business_id ON analytics_events(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);

-- ============================================================================
-- KROK 6: TABELE PŁATNOŚCI
-- ============================================================================

-- Payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  is_default boolean DEFAULT false,
  last4 text,
  brand text,
  expiry_month integer,
  expiry_year integer,
  iban text,
  account_holder text,
  bank_name text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  plan_type text NOT NULL,
  status subscription_status DEFAULT 'active',
  amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'EUR',
  interval text DEFAULT 'month',
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  trial_start timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  payment_method_id uuid REFERENCES payment_methods(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON subscriptions(business_id);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES business_profiles(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  type text NOT NULL,
  amount decimal(10, 2) NOT NULL,
  fee decimal(10, 2) DEFAULT 0,
  net_amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'EUR',
  status payment_status DEFAULT 'pending',
  payment_method text,
  description text,
  invoice_number text,
  reference_id text,
  metadata jsonb,
  failure_code text,
  failure_message text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  settled_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_business_id ON transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES business_profiles(id) ON DELETE SET NULL,
  invoice_number text UNIQUE NOT NULL,
  status text DEFAULT 'paid',
  subtotal decimal(10, 2) NOT NULL,
  tax_amount decimal(10, 2) DEFAULT 0,
  discount_amount decimal(10, 2) DEFAULT 0,
  total decimal(10, 2) NOT NULL,
  currency text DEFAULT 'EUR',
  issue_date date NOT NULL,
  due_date date,
  paid_at timestamptz,
  pdf_url text,
  vat_number text,
  kvk_number text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_transaction_id ON invoices(transaction_id);

-- Payouts
CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10, 2) NOT NULL,
  fee decimal(10, 2) DEFAULT 0,
  net_amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'EUR',
  status text DEFAULT 'pending',
  iban text NOT NULL,
  account_holder text NOT NULL,
  bank_name text,
  expected_arrival date,
  actual_arrival date,
  failure_code text,
  failure_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payouts_business_id ON payouts(business_id);

-- ============================================================================
-- KROK 7: TABELE DODATKOWE
-- ============================================================================

-- Follows
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- Saved searches
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  query text NOT NULL,
  filters jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

-- ============================================================================
-- KROK 8: ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User preferences policies
CREATE POLICY "user_preferences_all" ON user_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Business profiles policies
CREATE POLICY "business_profiles_select" ON business_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "business_profiles_manage" ON business_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Business hours policies
CREATE POLICY "business_hours_select" ON business_hours FOR SELECT TO authenticated USING (true);
CREATE POLICY "business_hours_manage" ON business_hours FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = business_hours.business_id AND business_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = business_hours.business_id AND business_profiles.user_id = auth.uid()));

-- Business social media policies
CREATE POLICY "business_social_media_select" ON business_social_media FOR SELECT TO authenticated USING (true);
CREATE POLICY "business_social_media_manage" ON business_social_media FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = business_social_media.business_id AND business_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = business_social_media.business_id AND business_profiles.user_id = auth.uid()));

-- Posts policies
CREATE POLICY "posts_select" ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_delete" ON posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Post media policies
CREATE POLICY "post_media_select" ON post_media FOR SELECT TO authenticated USING (true);
CREATE POLICY "post_media_manage" ON post_media FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_media.post_id AND posts.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_media.post_id AND posts.user_id = auth.uid()));

-- Likes & Saves policies
CREATE POLICY "post_likes_select" ON post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "post_likes_manage" ON post_likes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_saves_select" ON post_saves FOR SELECT TO authenticated USING (true);
CREATE POLICY "post_saves_manage" ON post_saves FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "comments_select" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update" ON comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Photos & Movies policies
CREATE POLICY "photos_select" ON photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "photos_manage" ON photos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "movies_select" ON movies FOR SELECT TO authenticated USING (true);
CREATE POLICY "movies_manage" ON movies FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Conversations & Messages policies
CREATE POLICY "conversations_select" ON conversations FOR SELECT TO authenticated 
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);
CREATE POLICY "conversations_insert" ON conversations FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "messages_select" ON messages FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())));
CREATE POLICY "messages_insert" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_update" ON messages FOR UPDATE TO authenticated USING (auth.uid() = sender_id) WITH CHECK (auth.uid() = sender_id);

-- Message attachments policies
CREATE POLICY "message_attachments_select" ON message_attachments FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM messages JOIN conversations ON conversations.id = messages.conversation_id WHERE messages.id = message_attachments.message_id AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())));
CREATE POLICY "message_attachments_insert" ON message_attachments FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM messages WHERE messages.id = message_attachments.message_id AND messages.sender_id = auth.uid()));

-- Notifications policies
CREATE POLICY "notifications_select" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Promotions policies
CREATE POLICY "promotions_select" ON promotions FOR SELECT TO authenticated USING (true);
CREATE POLICY "promotions_manage" ON promotions FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = promotions.business_id AND business_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = promotions.business_id AND business_profiles.user_id = auth.uid()));

-- Reviews policies
CREATE POLICY "reviews_select" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_user" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_business" ON reviews FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = reviews.business_id AND business_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = reviews.business_id AND business_profiles.user_id = auth.uid()));

-- Review photos policies
CREATE POLICY "review_photos_select" ON review_photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "review_photos_insert" ON review_photos FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_photos.review_id AND reviews.user_id = auth.uid()));

-- Campaigns policies
CREATE POLICY "campaigns_select" ON campaigns FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = campaigns.business_id AND business_profiles.user_id = auth.uid()));
CREATE POLICY "campaigns_manage" ON campaigns FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = campaigns.business_id AND business_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = campaigns.business_id AND business_profiles.user_id = auth.uid()));

-- Campaign media policies
CREATE POLICY "campaign_media_select" ON campaign_media FOR SELECT TO authenticated USING (true);
CREATE POLICY "campaign_media_manage" ON campaign_media FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM campaigns JOIN business_profiles ON business_profiles.id = campaigns.business_id WHERE campaigns.id = campaign_media.campaign_id AND business_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM campaigns JOIN business_profiles ON business_profiles.id = campaigns.business_id WHERE campaigns.id = campaign_media.campaign_id AND business_profiles.user_id = auth.uid()));

-- Payment methods policies
CREATE POLICY "payment_methods_all" ON payment_methods FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_manage" ON subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "transactions_select_user" ON transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "transactions_select_business" ON transactions FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = transactions.business_id AND business_profiles.user_id = auth.uid()));

-- Invoices policies
CREATE POLICY "invoices_select" ON invoices FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Payouts policies
CREATE POLICY "payouts_select" ON payouts FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = payouts.business_id AND business_profiles.user_id = auth.uid()));

-- Analytics policies
CREATE POLICY "analytics_select" ON analytics_events FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = analytics_events.business_id AND business_profiles.user_id = auth.uid()));
CREATE POLICY "analytics_insert" ON analytics_events FOR INSERT TO authenticated WITH CHECK (true);

-- Follows policies
CREATE POLICY "follows_select" ON follows FOR SELECT TO authenticated USING (true);
CREATE POLICY "follows_manage" ON follows FOR ALL TO authenticated USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

-- Saved searches policies
CREATE POLICY "saved_searches_all" ON saved_searches FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- KROK 9: FUNKCJE POMOCNICZE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
