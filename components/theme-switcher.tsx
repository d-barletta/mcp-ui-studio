'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const themes = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Light theme',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Dark theme',
    },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
      description: 'Follow system preference',
    },
  ];

  // Show the resolved theme icon (light or dark) in header, not system icon
  const displayTheme = theme === 'system' ? resolvedTheme : theme;
  const Icon = displayTheme === 'light' ? Sun : Moon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Theme</DialogTitle>
          <DialogDescription>
            Select your preferred color theme. System will follow your OS preference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {themes.map((themeOption) => {
            const ThemeIcon = themeOption.icon;
            const isSelected = theme === themeOption.value;
            
            return (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                }`}
              >
                <ThemeIcon className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{themeOption.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {themeOption.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
