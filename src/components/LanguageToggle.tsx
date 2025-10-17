import { Globe } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { useTranslation } from "@/hooks/use-translation"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()
  const { t } = useTranslation()
  
  const getLanguageDisplay = () => {
    switch (language) {
      case 'nl': return 'NL'
      case 'en': return 'EN'
      case 'pl': return 'PL'
      default: return 'NL'
    }
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
    >
      <Globe size={16} />
      <span className="font-medium">
        {getLanguageDisplay()}
      </span>
    </Button>
  )
}