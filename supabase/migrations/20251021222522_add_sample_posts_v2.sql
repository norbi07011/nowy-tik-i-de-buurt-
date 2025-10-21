/*
  # Dodaj przykładowe posty do aplikacji

  ## Opis
  Tworzy przykładowe posty dla użytkowników biznesowych aby feed miał zawartość.

  ## Co robi
  1. Sprawdza czy istnieją posty
  2. Dodaje 10 przykładowych postów z różnych kategorii biznesowych
  3. Używa istniejących użytkowników biznesowych z tabeli profiles

  ## Uwaga
  To są tylko dane demonstracyjne - użytkownicy mogą je usunąć.
*/

DO $$
DECLARE
  business_user_id uuid;
BEGIN
  -- Znajdź dowolnego użytkownika biznesowego
  SELECT id INTO business_user_id
  FROM profiles
  WHERE account_type = 'business'
  LIMIT 1;

  -- Jeśli nie ma użytkownika biznesowego, nie dodawaj postów
  IF business_user_id IS NULL THEN
    RAISE NOTICE 'No business users found, skipping sample posts';
    RETURN;
  END IF;

  -- Dodaj przykładowe posty tylko jeśli tabela jest pusta
  IF NOT EXISTS (SELECT 1 FROM posts LIMIT 1) THEN

    INSERT INTO posts (user_id, title, content, type, is_promoted, created_at) VALUES
    (business_user_id, 'Świeże pieczywo codziennie!', '🥐 Nasze pieczywo wypiekane jest każdego ranka z najlepszych składników. Zajrzyj do nas i poczuj aromat świeżo upieczonych croissantów!', 'promotion', false, now() - interval '2 hours'),

    (business_user_id, 'Wiosenna promocja -35%', '🌸 Specjalna oferta na wszystkie usługi! Tylko do końca miesiąca. Zarezerwuj swoją wizytę już dziś!', 'promotion', true, now() - interval '5 hours'),

    (business_user_id, 'Nowe menu sezonowe', '🍽️ Odkryj nasz nowe menu przygotowane z lokalnych, sezonowych produktów. Rezerwacje dostępne online!', 'standard', false, now() - interval '1 day'),

    (business_user_id, 'Weekend otwarcia!', '🎉 Zapraszamy na weekend pełen atrakcji! Specjalne ceny, konkursy i niespodzianki dla wszystkich gości.', 'event', false, now() - interval '3 days'),

    (business_user_id, 'Poszukujemy pracownika', '👷 Dołącz do naszego zespołu! Szukamy osoby na stanowisko sprzedawcy. Mile widziane doświadczenie.', 'job', false, now() - interval '5 days'),

    (business_user_id, 'Lokale do wynajęcia', '🏠 Atrakcyjne lokale w centrum miasta. Świetna lokalizacja, konkurencyjne ceny. Kontakt: email lub telefon.', 'property', false, now() - interval '1 week'),

    (business_user_id, 'Warsztaty dla dzieci', '🎨 Organizujemy warsztaty twórcze dla najmłodszych! Rozwijajcie talenty swoich pociech w przyjaznej atmosferze.', 'event', false, now() - interval '1 week'),

    (business_user_id, 'Profesjonalne konsultacje', '💼 Oferujemy konsultacje biznesowe i prawne. Doświadczeni specjaliści pomogą rozwiązać Twoje problemy.', 'service', false, now() - interval '2 weeks'),

    (business_user_id, 'Dzień otwarty w firmie', '👥 Zapraszamy wszystkich zainteresowanych na dzień otwarty! Poznaj naszą firmę od środka i dowiedz się więcej o naszej ofercie.', 'announcement', false, now() - interval '2 weeks'),

    (business_user_id, 'Letnia wyprzedaż', '☀️ Wielka wyprzedaż letniej kolekcji! Rabaty do 50% na wybrane produkty. Nie przegap okazji!', 'promotion', true, now() - interval '3 weeks');

    RAISE NOTICE 'Added % sample posts', (SELECT count(*) FROM posts);
  ELSE
    RAISE NOTICE 'Posts table not empty, skipping sample data';
  END IF;
END $$;