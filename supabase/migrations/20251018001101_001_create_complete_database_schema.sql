/*
  # Kompletny schemat bazy danych dla aplikacji TikTok-style

  ## Przegląd
  Tworzy pełną strukturę bazy danych dla platformy łączącej użytkowników i biznesy
  z funkcjonalnościami social media, wiadomości, płatności, promocji i analityki.

  ## Nowe Tabele
  
  ### Użytkownicy i Profile
  - `profiles` - Profile użytkowników (user/business)
  - `business_profiles` - Szczegółowe profile biznesów
  - `user_preferences` - Preferencje i ustawienia użytkowników
  - `subscriptions` - Subskrypcje premium
  
  ### Treści
  - `posts` - Posty i ogłoszenia
  - `post_media` - Media (zdjęcia/filmy) dla postów
  - `photos` - Galeria zdjęć
  - `movies` - Galeria filmów/wideo
  - `post_likes` - Polubienia postów
  - `post_saves` - Zapisane posty
  - `comments` - Komentarze do postów
  
  ### Komunikacja
  - `conversations` - Konwersacje między użytkownikami
  - `messages` - Wiadomości w konwersacjach
  - `notifications` - Powiadomienia systemowe
  
  ### Marketing i Biznes
  - `promotions` - Promocje i rabaty biznesów
  - `reviews` - Opinie i recenzje
  - `campaigns` - Kampanie marketingowe
  - `analytics_events` - Zdarzenia do analityki
  
  ### Płatności
  - `payment_methods` - Metody płatności
  - `transactions` - Transakcje płatności
  - `invoices` - Faktury
  - `payouts` - Wypłaty dla biznesów
  
  ### System
  - `business_hours` - Godziny otwarcia biznesów
  - `saved_searches` - Zapisane wyszukiwania
  - `follows` - Obserwowanie biznesów/użytkowników

  ## Bezpieczeństwo
  - Włączone RLS na wszystkich tabelach
  - Polityki dostępu dla authenticated użytkowników
  - Sprawdzanie własności rekordów
  - Ograniczenia dla operacji wrażliwych
*/

-- ============================================================================
-- TYPY ENUM
-- ============================================================================

CREATE TYPE account_type AS ENUM ('user', 'business');
CREATE TYPE post_type AS ENUM ('standard', 'promotion', 'event', 'job', 'property', 'product', 'service', 'announcement');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'location');
CREATE TYPE notification_type AS ENUM ('new_message', 'new_review', 'payment_success', 'payment_failed', 'subscription_expiring', 'campaign_approved', 'post_approved', 'business_verified', 'new_follower', 'system_announcement');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'unpaid', 'trialing');
CREATE TYPE business_category AS ENUM ('restaurant', 'retail', 'services', 'healthcare', 'fitness', 'beauty', 'automotive', 'construction', 'education', 'entertainment', 'real-estate', 'technology', 'other');

-- ============================================================================
-- TABELE UŻYTKOWNIKÓW
-- ============================================================================

-- Profile użytkowników
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

-- Preferencje użytkowników
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  notifications_email boolean DEFAULT true,
  notifications_push boolean DEFAULT true,
  notifications_sms boolean DEFAULT false,
  notifications_marketing boolean DEFAULT false,
  privacy_show_profile boolean DEFAULT true,
  privacy_show_location boolean DEFAULT true,
  privacy_allow_messages boolean DEFAULT true,
  theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Profile biznesów
CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Godziny otwarcia
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

-- Social media biznesów
CREATE TABLE IF NOT EXISTS business_social_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  facebook text,
  instagram text,
  linkedin text,
  twitter text,
  tiktok text,
  youtube text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_id)
);

-- ============================================================================
-- TABELE TREŚCI
-- ============================================================================

-- Posty
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
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);

-- Media dla postów
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

-- Polubienia postów
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Zapisane posty
CREATE TABLE IF NOT EXISTS post_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_saves_post_id ON post_saves(post_id);
CREATE INDEX IF NOT EXISTS idx_post_saves_user_id ON post_saves(user_id);

-- Komentarze
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
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Galeria zdjęć
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
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos(is_featured) WHERE is_featured = true;

-- Galeria filmów
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
CREATE INDEX IF NOT EXISTS idx_movies_featured ON movies(is_featured) WHERE is_featured = true;

-- ============================================================================
-- TABELE KOMUNIKACJI
-- ============================================================================

-- Konwersacje
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

CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON conversations(participant_2_id);

-- Wiadomości
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

-- Załączniki do wiadomości
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

-- Powiadomienia
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
-- TABELE MARKETINGOWE
-- ============================================================================

-- Promocje
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
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);

-- Opinie i recenzje
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
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Zdjęcia do recenzji
CREATE TABLE IF NOT EXISTS review_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_photos_review_id ON review_photos(review_id);

-- Kampanie marketingowe
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
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- Media kampanii
CREATE TABLE IF NOT EXISTS campaign_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  type media_type DEFAULT 'image',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaign_media_campaign_id ON campaign_media(campaign_id);

-- ============================================================================
-- TABELE PŁATNOŚCI
-- ============================================================================

-- Metody płatności
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

-- Subskrypcje
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
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Transakcje
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
CREATE INDEX IF NOT EXISTS idx_transactions_subscription_id ON transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Faktury
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
CREATE INDEX IF NOT EXISTS idx_invoices_business_id ON invoices(business_id);
CREATE INDEX IF NOT EXISTS idx_invoices_transaction_id ON invoices(transaction_id);

-- Wypłaty dla biznesów
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
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);

-- ============================================================================
-- TABELE ANALITYKI
-- ============================================================================

-- Zdarzenia analityczne
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

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_business_id ON analytics_events(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_post_id ON analytics_events(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- ============================================================================
-- TABELE DODATKOWE
-- ============================================================================

-- Obserwowanie
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

-- Zapisane wyszukiwania
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  query text NOT NULL,
  filters jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Włącz RLS na wszystkich tabelach
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

-- ============================================================================
-- POLITYKI RLS - PROFILES
-- ============================================================================

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- POLITYKI RLS - USER PREFERENCES
-- ============================================================================

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - BUSINESS PROFILES
-- ============================================================================

CREATE POLICY "Anyone can view business profiles"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can insert own profile"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners can update own profile"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners can delete own profile"
  ON business_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - BUSINESS HOURS
-- ============================================================================

CREATE POLICY "Anyone can view business hours"
  ON business_hours FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can manage hours"
  ON business_hours FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = business_hours.business_id
      AND business_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = business_hours.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- POLITYKI RLS - POSTS
-- ============================================================================

CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - POST MEDIA
-- ============================================================================

CREATE POLICY "Anyone can view post media"
  ON post_media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Post owners can manage media"
  ON post_media FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_media.post_id
      AND posts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_media.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- POLITYKI RLS - LIKES & SAVES
-- ============================================================================

CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own likes"
  ON post_likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view saves"
  ON post_saves FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own saves"
  ON post_saves FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - COMMENTS
-- ============================================================================

CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - PHOTOS & MOVIES
-- ============================================================================

CREATE POLICY "Anyone can view photos"
  ON photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own photos"
  ON photos FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view movies"
  ON movies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own movies"
  ON movies FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - CONVERSATIONS & MESSAGES
-- ============================================================================

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Participants can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Senders can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- ============================================================================
-- POLITYKI RLS - NOTIFICATIONS
-- ============================================================================

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - PROMOTIONS
-- ============================================================================

CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can manage promotions"
  ON promotions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = promotions.business_id
      AND business_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = promotions.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- POLITYKI RLS - REVIEWS
-- ============================================================================

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners can respond to reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = reviews.business_id
      AND business_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = reviews.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- POLITYKI RLS - CAMPAIGNS
-- ============================================================================

CREATE POLICY "Business owners can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = campaigns.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can manage campaigns"
  ON campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = campaigns.business_id
      AND business_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = campaigns.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- POLITYKI RLS - PAYMENT METHODS
-- ============================================================================

CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own payment methods"
  ON payment_methods FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - SUBSCRIPTIONS
-- ============================================================================

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - TRANSACTIONS
-- ============================================================================

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can view business transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = transactions.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- POLITYKI RLS - INVOICES
-- ============================================================================

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - PAYOUTS
-- ============================================================================

CREATE POLICY "Business owners can view own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = payouts.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- POLITYKI RLS - ANALYTICS
-- ============================================================================

CREATE POLICY "Business owners can view own analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = analytics_events.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analytics"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- POLITYKI RLS - FOLLOWS
-- ============================================================================

CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own follows"
  ON follows FOR ALL
  TO authenticated
  USING (auth.uid() = follower_id)
  WITH CHECK (auth.uid() = follower_id);

-- ============================================================================
-- POLITYKI RLS - SAVED SEARCHES
-- ============================================================================

CREATE POLICY "Users can manage own saved searches"
  ON saved_searches FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLITYKI RLS - SOCIAL MEDIA & ATTACHMENTS (wszystkie pozostałe)
-- ============================================================================

CREATE POLICY "Anyone can view business social media"
  ON business_social_media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can manage social media"
  ON business_social_media FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = business_social_media.business_id
      AND business_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = business_social_media.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view review photos"
  ON review_photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Review owners can add photos"
  ON review_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reviews
      WHERE reviews.id = review_photos.review_id
      AND reviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can view message attachments"
  ON message_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages
      JOIN conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = message_attachments.message_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Senders can add attachments"
  ON message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages
      WHERE messages.id = message_attachments.message_id
      AND messages.sender_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view campaign media"
  ON campaign_media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Campaign owners can manage media"
  ON campaign_media FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN business_profiles ON business_profiles.id = campaigns.business_id
      WHERE campaigns.id = campaign_media.campaign_id
      AND business_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN business_profiles ON business_profiles.id = campaigns.business_id
      WHERE campaigns.id = campaign_media.campaign_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- FUNKCJE POMOCNICZE
-- ============================================================================

-- Funkcja do aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery dla updated_at
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
