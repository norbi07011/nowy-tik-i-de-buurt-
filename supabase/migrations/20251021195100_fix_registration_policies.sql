/*
  # Fix Registration RLS Policies

  ## Problem
  Użytkownicy nie mogą się zarejestrować bo polityka `profiles_insert` wymaga
  auth.uid() = id, ale podczas signUp użytkownik jest authenticated ale dopiero
  tworzy swój profil.

  ## Rozwiązanie
  Zaktualizuj politykę INSERT aby pozwalała nowym użytkownikom na utworzenie profilu.

  ## Changes
  1. Drop istniejącej polityki INSERT dla profiles
  2. Utwórz nową politykę która pozwala authenticated użytkownikom na INSERT
*/

-- Drop istniejącej polityki
DROP POLICY IF EXISTS "profiles_insert" ON profiles;

-- Nowa polityka: authenticated użytkownicy mogą tworzyć swój profil
CREATE POLICY "profiles_insert_own"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Dodatkowo: pozwól na INSERT przez service_role (dla edge functions)
CREATE POLICY "profiles_insert_service"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- To samo dla business_profiles
DROP POLICY IF EXISTS "business_profiles_insert" ON business_profiles;

CREATE POLICY "business_profiles_insert_own"
  ON business_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "business_profiles_insert_service"
  ON business_profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);
