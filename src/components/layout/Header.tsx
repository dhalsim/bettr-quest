
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, PlusCircle, UserCircle, LogOut, User, Settings, Moon, Sun, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { NostrProfile } from '@/contexts/NostrAuthContext';
import { Switch } from '@/components/ui/switch';
import { useDarkMode } from '@/hooks/useDarkMode';
import NotificationBadge from '@/components/ui/NotificationBadge';
import { useNotifications } from '@/hooks/useNotifications';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout, profile } = useNostrAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { getUnreadCount, hasUnread } = useNotifications();

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
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              
              <Link 
                to="/create" 
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle size={18} />
                <span>New Quest</span>
              </Link>
              
              <UserMenu 
                logout={handleLogout} 
                profile={profile} 
                unreadCount={getUnreadCount()}
                hasUnread={hasUnread} 
              />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              
              <Link 
                to="/connect" 
                className="btn-primary flex items-center gap-2"
              >
                <UserCircle size={18} />
                <span>Connect with Nostr</span>
              </Link>
            </div>
          )}
        </div>

        <button 
          className="md:hidden text-foreground relative" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isLoggedIn && hasUnread && (
            <NotificationBadge showDot className="z-10" />
          )}
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass animate-fade-in py-6 px-6 md:hidden">
          <nav className="flex flex-col space-y-6">
            <NavLinks mobile isLoggedIn={isLoggedIn} />
            
            <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
              <span className="text-sm text-foreground/80">Dark Mode</span>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/create" 
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  <span>New Quest</span>
                </Link>
                <Link
                  to="/my-quests"
                  className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2"
                >
                  <User size={18} />
                  <span>My Quests</span>
                </Link>
                <Link
                  to="/notifications"
                  className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2 relative"
                >
                  <Bell size={18} />
                  <span>Notifications</span>
                  {getUnreadCount() > 0 && (
                    <NotificationBadge count={getUnreadCount()} className="static ml-2" />
                  )}
                </Link>
                <Link
                  to={`/profile/${profile?.username || 'user'}`}
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

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean; toggleDarkMode: () => void }) => {
  return (
    <button 
      onClick={toggleDarkMode}
      className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun size={20} className="text-foreground" />
      ) : (
        <Moon size={20} className="text-foreground" />
      )}
    </button>
  );
};

const UserMenu = ({ 
  logout, 
  profile,
  unreadCount,
  hasUnread
}: { 
  logout: () => void, 
  profile: NostrProfile,
  unreadCount: number,
  hasUnread: boolean
}) => {
  const initials = profile?.name ? profile.name.charAt(0).toUpperCase() : 'U';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative">
          {hasUnread && (
            <NotificationBadge showDot />
          )}
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
          <Link to="/my-quests" className="flex items-center gap-2 cursor-pointer">
            <User size={16} />
            <span>My Quests</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="flex items-center gap-2 cursor-pointer relative">
            <Bell size={16} />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                {unreadCount}
              </span>
            )}
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
