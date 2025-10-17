import { useKV } from "@github/spark/hooks"

export type Language = 'nl' | 'en' | 'pl'

export function useLanguage() {
  const [language, setLanguage] = useKV<Language>("app-language", "nl")
  
  const toggleLanguage = () => {
    setLanguage(current => {
      switch (current) {
        case 'nl': return 'en'
        case 'en': return 'pl'
        case 'pl': return 'nl'
        default: return 'nl'
      }
    })
  }
  
  return { language, setLanguage, toggleLanguage }
}