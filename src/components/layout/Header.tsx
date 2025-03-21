
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PlusCircle } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 
      ${isScrolled ? 'py-3 glass' : 'py-5 bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="font-display text-foreground font-bold text-2xl flex items-center"
        >
          <span className="text-primary">bettr</span>quest
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
          <Link 
            to="/create" 
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>New Challenge</span>
          </Link>
        </div>

        <button 
          className="md:hidden text-foreground" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass animate-fade-in py-6 px-6 md:hidden">
          <nav className="flex flex-col space-y-6">
            <NavLinks mobile />
            <Link 
              to="/create" 
              className="btn-primary flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} />
              <span>New Challenge</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/my-challenges", label: "My Challenges" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`${mobile ? 'text-lg py-2' : ''} transition-colors font-medium
          ${isActive(link.to) 
            ? 'text-primary' 
            : 'text-foreground/80 hover:text-foreground'}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default Header;
