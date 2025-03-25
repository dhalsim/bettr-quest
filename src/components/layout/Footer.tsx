import React from 'react';
import { Link } from 'react-router-dom';
import GitHubIcon from '@/components/icons/GitHubIcon';

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-display text-foreground font-bold text-2xl flex items-center">
              <span className="text-primary">bettr</span>
              <span className="text-primary">.</span>
              quest
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Quest yourself to be better, one quest at a time. Create, share, and complete personal quests with a community that supports your growth.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Navigation</h3>
            <nav className="flex flex-col space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/explore">Explore</FooterLink>
              <FooterLink to="/my-quests">My Quests</FooterLink>
              <FooterLink to="/create">Create Quest</FooterLink>
              <a 
                href="https://github.com/dhalsim/bettr-quest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
              >
                <GitHubIcon size={16} />
                Open Source on GitHub
              </a>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} bettr.quest. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Open source project built with ❤️
          </p>
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
