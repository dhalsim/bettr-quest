import React from 'react';
import { Link } from 'react-router-dom';
import GitHubIcon from '@/components/icons/GitHubIcon';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation(null, { keyPrefix: "footer" });
  
  return (
    <footer className="py-12 px-6 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-display text-foreground font-bold text-2xl flex items-center">
              <span className="text-primary">bettr</span>
              <span className="text-primary">.</span>
              quest
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              {t('Quest yourself to be better, one quest at a time. Create, share, and complete personal quests with a community that supports your growth.')}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">{t('Navigation')}</h3>
            <div className="grid grid-cols-2 gap-10">
              <nav className="flex flex-col space-y-3 text-nowrap">
                <FooterLink to="/">{t('Home')}</FooterLink>
                <FooterLink to="/explore">{t('Explore')}</FooterLink>
                <FooterLink to="/coach-directory">{t('Coach Directory')}</FooterLink>
                <FooterLink to="/register-coach">{t('Register as Coach')}</FooterLink>
              </nav>
              <nav className="flex flex-col space-y-3 text-nowrap">
                <FooterLink to="/my-quests">{t('My Quests')}</FooterLink>
                <FooterLink to="/create">{t('Create Quest')}</FooterLink>
                <FooterLink to="/timeline">{t('Timeline')}</FooterLink>
                <FooterLink to="/premium">
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {t('Get Premium')}
                  </span>
                </FooterLink>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t('© {{year}} bettr.quest. All rights reserved.', { year: new Date().getFullYear() })}
          </p>
          <a 
            href="https://github.com/dhalsim/bettr-quest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            {t('Free Open Source Software')} <GitHubIcon size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    {children}
  </Link>
);

export default Footer;
