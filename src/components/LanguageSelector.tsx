import React from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  closeParent?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'default',
  className = '',
  closeParent,
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = languages[i18n.language as keyof typeof languages];

  const changeLanguage = (lng: string) => {
    // First close the parent dropdown if provided
    if (closeParent) {
      closeParent();
    }
    
    // Then change the language after a small delay
    setTimeout(() => {
      i18n.changeLanguage(lng);
    }, 100);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={className}>
          {currentLanguage.flag} {currentLanguage.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(languages).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeLanguage(lang.code);
            }}
            className="cursor-pointer"
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 