import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, PlusCircle, UserCircle, LogOut, User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNostrAuth } from '@/hooks/useNostrAuth';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout, profile } = useNostrAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              
              <UserMenu logout={handleLogout} profile={profile} />
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
                <Link
                  to="/my-challenges"
                  className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2"
                >
                  <User size={18} />
                  <span>My Challenges</span>
                </Link>
                <Link
                  to="/profile"
                  className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2"
                >
                  <Settings size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
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

const UserMenu = ({ logout, profile }: { logout: () => void, profile: any }) => {
  const initials = profile?.name ? profile.name.charAt(0).toUpperCase() : 'U';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-10 w-10 border-2 border-primary hover:border-primary/80 transition-colors">
            <AvatarImage 
              src={profile?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=bettrquest"} 
              alt={profile?.name || "User"} 
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 bg-popover" align="end">
        <DropdownMenuItem asChild>
          <Link to="/my-challenges" className="flex items-center gap-2 cursor-pointer">
            <User size={16} />
            <span>My Challenges</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/profile/${profile?.username || 'user'}`} className="flex items-center gap-2 cursor-pointer">
            <Settings size={16} />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive">
          <LogOut size={16} />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavLinks = ({ mobile = false, isLoggedIn = false }: { mobile?: boolean, isLoggedIn?: boolean }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const links = [
    { to: "/explore", label: "Explore" },
    ...(isLoggedIn ? [{ to: "/timeline", label: "Timeline" }] : []),
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
