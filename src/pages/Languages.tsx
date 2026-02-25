import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧", native: "English" },
  { code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", native: "Deutsch" },
  { code: "it", name: "Italian", flag: "🇮🇹", native: "Italiano" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", native: "Português" },
  { code: "ru", name: "Russian", flag: "🇷🇺", native: "Русский" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", native: "日本語" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", native: "中文" },
  { code: "ko", name: "Korean", flag: "🇰🇷", native: "한국어" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिंदी" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", native: "العربية" },
];

export default function Languages() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    // You can add logic here to change the app language
    localStorage.setItem("preferredLanguage", code);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Languages</h1>
          <p className="text-sm text-muted-foreground">Choose your preferred language</p>
        </div>
      </div>

      <Card className="border-sidebar-border">
        <CardHeader>
          <CardTitle>Available Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedLanguage === lang.code
                    ? "border-primary bg-primary/5"
                    : "border-sidebar-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl mb-2">{lang.flag}</div>
                    <h3 className="font-semibold text-foreground">{lang.name}</h3>
                    <p className="text-sm text-muted-foreground">{lang.native}</p>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-sidebar-border bg-info/5">
        <CardHeader>
          <CardTitle className="text-base">Language Features</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>✓ Course content in selected language</p>
          <p>✓ Platform interface translation</p>
          <p>✓ AI Assistant responds in your language</p>
          <p>✓ Subtitles and transcripts available</p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="flex-1" size="lg">
          Save Language Preference
        </Button>
        <Button variant="outline" className="flex-1" size="lg">
          Preview
        </Button>
      </div>
    </div>
  );
}
