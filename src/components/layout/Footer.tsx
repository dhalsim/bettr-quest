
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
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
              Challenge yourself to be better, one quest at a time. Create, share, and complete personal challenges with a community that supports your growth.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Navigation</h3>
            <nav className="flex flex-col space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/explore">Explore</FooterLink>
              <FooterLink to="/my-challenges">My Challenges</FooterLink>
              <FooterLink to="/create">Create Challenge</FooterLink>
            </nav>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <nav className="flex flex-col space-y-3">
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/privacy">Privacy</FooterLink>
              <FooterLink to="/terms">Terms</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} bettrquest. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
          </div>
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
