
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PlusCircle, UserCircle, LogOut } from 'lucide-react';

// Mock authentication state - in a real app this would come from a Nostr context
const useNostrAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('nostr_logged_in') === 'true';
  });

  const logout = () => {
    localStorage.removeItem('nostr_logged_in');
    setIsLoggedIn(false);
  };

  return { isLoggedIn, logout };
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout } = useNostrAuth();

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
          <span className="text-primary">bettr</span>
          <span className="text-primary">.</span>
          quest
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks isLoggedIn={isLoggedIn} />
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/create" 
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle size={18} />
                <span>New Challenge</span>
              </Link>
              <button
                onClick={logout}
                className="text-foreground/80 hover:text-foreground flex items-center gap-2"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/connect" 
              className="btn-primary flex items-center gap-2"
            >
              <UserCircle size={18} />
              <span>Connect with Nostr</span>
            </Link>
          )}
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
            <NavLinks mobile isLoggedIn={isLoggedIn} />
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/create" 
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  <span>New Challenge</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <Link 
                to="/connect" 
                className="btn-primary flex items-center justify-center gap-2"
              >
                <UserCircle size={18} />
                <span>Connect with Nostr</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ mobile = false, isLoggedIn = false }: { mobile?: boolean, isLoggedIn?: boolean }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const links = [
    { to: "/explore", label: "Explore" },
    ...(isLoggedIn ? [{ to: "/timeline", label: "Timeline" }] : []),
    { to: "/my-challenges", label: "My Challenges" },
    { to: "/coach-directory", label: "Coach Directory" },
    ...(isLoggedIn ? [{ to: "/register-coach", label: "Register as Coach" }] : []),
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
