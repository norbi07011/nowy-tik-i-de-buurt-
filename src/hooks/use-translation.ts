import { useLanguage, Language } from './use-language'

export function useTranslation() {
  const { language } = useLanguage()
  
  const translations: Record<Language, Record<string, string>> = {
    nl: {
      // Navigation
      "movies": "Films",
      "photos": "Foto's", 
      "discounts": "Kortingen",
      "realEstate": "Onroerend goed",
      "search": "Zoeken",
      "home": "Home",
      "feed": "Hoofdpagina",
      "saved": "Opgeslagen",
      "messages": "Berichten",
      "liked": "Geliket",
      "profile": "Profil",
      "notifications": "Notificaties",
      "settings": "Instellingen",
      "logout": "Uitloggen",
      "discover": "Ontdekken",
      "browse": "Bladeren",
      "menu": "Menu",
      "hoofdpagina": "Hoofdpagina",
      "opgeslagen": "Opgeslagen",
      "berichten": "Berichten",
      "geliket": "Geliket",
      "profil": "Profiel",
      "notificaties": "Notificaties",
      "instellingen": "Instellingen",
      
      // Languages
      "dutch": "Nederlands",
      "english": "Engels",
      "polish": "Pools",
      
      // Common
      "loading": "Laden...",
      "appName": "Tik in de Buurt",
      "tagline": "Lokale apps in je stad",
      "personal": "Persoonlijk",
      "free": "Gratis",
      "online": "online",
      
      // Auth
      "login": "Inloggen",
      "register": "Registreren",
      "email": "E-mail",
      "password": "Wachtwoord",
      "confirmPassword": "Bevestig wachtwoord",
      "loginSuccess": "Succesvol ingelogd!",
      "logoutSuccess": "Succesvol uitgelogd",
      "loginError": "Inloggen mislukt",
      "logoutError": "Er is een fout opgetreden bij het uitloggen",
      "loginDesc": "Log in op je Tik in de Buurt account",
      "loggingIn": "Inloggen...",
      "noAccount": "Heb je nog geen account?",
      "createUserAccount": "Maak gebruikersaccount aan",
      "createBusinessAccount": "Maak bedrijfsaccount aan",
      
      // Registration
      "userRegistration": "Gebruikersregistratie",
      "userRegistrationDesc": "Gratis account om lokale aanbiedingen te bekijken",
      "firstName": "Voornaam",
      "lastName": "Achternaam",
      "phone": "Telefoon",
      "city": "Stad",
      "firstNamePlaceholder": "Jan",
      "lastNamePlaceholder": "de Vries",
      "emailPlaceholder": "jan@voorbeeld.nl",
      "phonePlaceholder": "+31 6 12345678",
      "cityPlaceholder": "Amsterdam",
      "acceptTerms": "Ik accepteer de",
      "terms": "voorwaarden",
      "and": "en",
      "privacy": "privacybeleid",
      "newsletterOptIn": "Ik wil nieuwsbrieven ontvangen met de nieuwste aanbiedingen",
      "createFreeAccount": "Maak gratis account aan",
      "creatingAccount": "Account aanmaken...",
      "passwordMismatch": "Wachtwoorden komen niet overeen",
      "acceptTermsRequired": "Je moet de voorwaarden accepteren",
      "userExistsError": "Er bestaat al een gebruiker met dit e-mailadres",
      "accountCreatedSuccess": "Account succesvol aangemaakt!",
      
      // Business
      "myBusiness": "Mijn bedrijf",
      "management": "Beheer",
      "businessProfile": "Bedrijfsprofiel bijgewerkt!",
      "businessProfileError": "Fout bij het bijwerken van het profiel",
      "workers": "Werknemers",
      "properties": "Panden",
      "marketing": "Marketing Services",
      "payments": "Betalingen",
      "customers": "Klanten",
      "account": "Account",
      "support": "Ondersteuning",
      "analytics": "Analytics",
      
      // User types
      "regularUser": "Gewone gebruiker",
      "businessUser": "Zakelijke gebruiker",
      "userDashboard": "Gebruikersdashboard",
      "businessDashboard": "Bedrijfsdashboard"
    },
    en: {
      // Navigation
      "movies": "Movies",
      "photos": "Photos", 
      "discounts": "Discounts",
      "realEstate": "Real Estate",
      "search": "Search",
      "home": "Home",
      "feed": "Feed",
      "saved": "Saved",
      "messages": "Messages",
      "liked": "Liked",
      "profile": "Profile",
      "notifications": "Notifications",
      "settings": "Settings",
      "logout": "Logout",
      "discover": "Discover",
      "browse": "Browse",
      "menu": "Menu",
      
      // Languages
      "dutch": "Dutch",
      "english": "English",
      "polish": "Polish",
      
      // Common
      "loading": "Loading...",
      "appName": "Tik in de Buurt",
      "tagline": "Local apps in your city",
      "personal": "Personal",
      "free": "Free",
      "online": "online",
      
      // Auth
      "login": "Login",
      "register": "Register",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "loginSuccess": "Successfully logged in!",
      "logoutSuccess": "Successfully logged out",
      "loginError": "Login failed",
      "logoutError": "An error occurred during logout",
      "loginDesc": "Sign in to your Tik in de Buurt account",
      "loggingIn": "Logging in...",
      "noAccount": "Don't have an account yet?",
      "createUserAccount": "Create User Account",
      "createBusinessAccount": "Create Business Account",
      
      // Registration
      "userRegistration": "User Registration",
      "userRegistrationDesc": "Free account to browse local offers",
      "firstName": "First Name",
      "lastName": "Last Name",
      "phone": "Phone",
      "city": "City",
      "firstNamePlaceholder": "John",
      "lastNamePlaceholder": "Doe",
      "emailPlaceholder": "john@example.com",
      "phonePlaceholder": "+31 6 12345678",
      "cityPlaceholder": "Amsterdam",
      "acceptTerms": "I accept the",
      "terms": "terms",
      "and": "and",
      "privacy": "privacy policy",
      "newsletterOptIn": "I want to receive newsletters with the latest offers",
      "createFreeAccount": "Create Free Account",
      "creatingAccount": "Creating account...",
      "passwordMismatch": "Passwords do not match",
      "acceptTermsRequired": "You must accept the terms",
      "userExistsError": "A user with this email already exists",
      "accountCreatedSuccess": "Account created successfully!",
      
      // Business
      "myBusiness": "My Business",
      "management": "Management",
      "businessProfile": "Business profile updated!",
      "businessProfileError": "Error updating profile",
      "workers": "Workers",
      "properties": "Properties",
      "marketing": "Marketing Services",
      "payments": "Payments",
      "customers": "Customers",
      "account": "Account",
      "support": "Support",
      "analytics": "Analytics",
      
      // User types
      "regularUser": "Regular User",
      "businessUser": "Business User",
      "userDashboard": "User Dashboard",
      "businessDashboard": "Business Dashboard"
    },
    pl: {
      // Navigation
      "movies": "Filmy",
      "photos": "Zdjęcia", 
      "discounts": "Promocje",
      "realEstate": "Nieruchomości",
      "search": "Szukaj",
      "home": "Główna",
      "feed": "Strona główna",
      "saved": "Zapisane",
      "messages": "Wiadomości",
      "liked": "Polubione",
      "profile": "Profil",
      "notifications": "Powiadomienia",
      "settings": "Ustawienia",
      "logout": "Wyloguj się",
      "discover": "Odkrywaj",
      "browse": "Przeglądaj",
      "menu": "Menu",
      
      // Languages
      "dutch": "Holenderski",
      "english": "Angielski",
      "polish": "Polski",
      
      // Common
      "loading": "Ładowanie...",
      "appName": "Tik in de Buurt",
      "tagline": "Lokalne aplikacje w Twoim mieście",
      "personal": "Osobiste",
      "free": "Darmowe",
      "online": "online",
      
      // Auth
      "login": "Zaloguj się",
      "register": "Zarejestruj się",
      "email": "E-mail",
      "password": "Hasło",
      "confirmPassword": "Potwierdź hasło",
      "loginSuccess": "Pomyślnie zalogowano!",
      "logoutSuccess": "Pomyślnie wylogowano",
      "loginError": "Logowanie nie powiodło się",
      "logoutError": "Wystąpił błąd podczas wylogowywania",
      "loginDesc": "Zaloguj się do swojego konta Tik in de Buurt",
      "loggingIn": "Logowanie...",
      "noAccount": "Nie masz jeszcze konta?",
      "createUserAccount": "Załóż konto użytkownika",
      "createBusinessAccount": "Załóż konto firmowe",
      
      // Registration
      "userRegistration": "Rejestracja użytkownika",
      "userRegistrationDesc": "Darmowe konto do przeglądania lokalnych ofert",
      "firstName": "Imię",
      "lastName": "Nazwisko",
      "phone": "Telefon",
      "city": "Miasto",
      "firstNamePlaceholder": "Jan",
      "lastNamePlaceholder": "Kowalski",
      "emailPlaceholder": "jan@example.com",
      "phonePlaceholder": "+31 6 12345678",
      "cityPlaceholder": "Amsterdam",
      "acceptTerms": "Akceptuję",
      "terms": "regulamin",
      "and": "i",
      "privacy": "politykę prywatności",
      "newsletterOptIn": "Chcę otrzymywać newsletter z najnowszymi ofertami",
      "createFreeAccount": "Załóż darmowe konto",
      "creatingAccount": "Tworzenie konta...",
      "passwordMismatch": "Hasła nie są identyczne",
      "acceptTermsRequired": "Musisz zaakceptować regulamin",
      "userExistsError": "Użytkownik o podanym email już istnieje",
      "accountCreatedSuccess": "Konto zostało utworzone pomyślnie!",
      
      // Business
      "myBusiness": "Moja firma",
      "management": "Zarządzanie",
      "businessProfile": "Profil firmy zaktualizowany!",
      "businessProfileError": "Błąd podczas aktualizacji profilu",
      "workers": "Pracownicy",
      "properties": "Nieruchomości",
      "marketing": "Usługi marketingowe",
      "payments": "Płatności",
      "customers": "Klienci",
      "account": "Konto",
      "support": "Wsparcie",
      "analytics": "Analityka",
      
      // User types
      "regularUser": "Zwykły użytkownik",
      "businessUser": "Użytkownik biznesowy",
      "userDashboard": "Panel użytkownika",
      "businessDashboard": "Panel biznesowy"
    }
  }
  
  const t = (key: string): string => {
    return translations[language || 'nl']?.[key] || key
  }
  
  return { t, language }
}