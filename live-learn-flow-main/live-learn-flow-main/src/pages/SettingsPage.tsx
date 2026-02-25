import { GlassCard } from "@/components/ui/GlassCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Bell,
  Globe,
  User,
  Info,
  Palette,
  Moon,
  Sun,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  // Apply theme on mount and change
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    setLanguage(newLanguage);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{t('settings')}</h1>

      {/* Profile Settings */}
      <Card className="border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('account')}
          </CardTitle>
          <CardDescription>{t('profile_info')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            {t('edit_profile')}
          </Button>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t('theme')}
          </CardTitle>
          <CardDescription>Customize your appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              className="flex items-center gap-2"
            >
              <Sun className="w-4 h-4" />
              {t('light_mode')}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="w-4 h-4" />
              {t('dark_mode')}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Current theme: {theme === "dark" ? t('dark_mode') : t('light_mode')}
          </p>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('languages')}
          </CardTitle>
          <CardDescription>Choose your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 border border-sidebar-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="en">English (English)</option>
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="de">Deutsch (German)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="zh">中文 (Chinese)</option>
            <option value="ja">日本語 (Japanese)</option>
            <option value="pt">Português (Portuguese)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            Page will refresh in selected language
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t('notifications')}
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable notifications</label>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Email notifications</label>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              disabled={!notifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Push notifications</label>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
              disabled={!notifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* About App */}
      <Card className="border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t('about_app')}
          </CardTitle>
          <CardDescription>Application information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">App Name</span>
            <span className="font-medium">EduFlow</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('version')}</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('build')}</span>
            <span className="font-medium">2026.02.25</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('platform')}</span>
            <span className="font-medium">Web</span>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            EduFlow is a comprehensive learning management system designed for students, teachers, and parents.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button className="w-full" size="lg">
        {t('save_changes')}
      </Button>
    </div>
  );
}
