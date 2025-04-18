import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, PlusCircle, UserCircle, LogOut, User, Settings, Moon, Sun, Bell, BadgeCheck } from 'lucide-react';
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
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { pages } from '@/lib/pages';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout, profile } = useNostrAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { getUnreadCount, hasUnread } = useNotifications();


  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    
    navigate(pages.home.location);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-100 py-3 glass`}>
      <header className="px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="font-display text-foreground font-bold text-2xl flex flex-col items-center relative"
          >
            <div className="flex items-center">
              <span className="text-primary">bettr</span>
              <span className="text-primary">.</span>
              quest
            </div>
            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium leading-none shadow-md">
              <BadgeCheck size={12} className="mr-1" />
              DEMO
            </div>
          </Link>
          
          <div className="hidden custom-header-md:flex items-center space-x-8">
            <NavLinks isLoggedIn={isLoggedIn} />
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                
                {location.pathname !== '/create-quest' && (
                  <Link 
                    to="/create-quest" 
                    className="btn-primary flex items-center gap-2"
                  >
                    <PlusCircle size={18} />
                    <span>{t('header.New Quest')}</span>
                  </Link>
                )}
                
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
                <LanguageSelector />
                
                <Link 
                  to="/connect" 
                  className="btn-primary flex items-center gap-2"
                >
                  <UserCircle size={18} />
                  <span>{t('header.Connect with Nostr')}</span>
                </Link>
              </div>
            )}
          </div>

          <button 
            className="custom-header-md:hidden text-foreground relative" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isLoggedIn && hasUnread && (
              <NotificationBadge showDot className="z-10" />
            )}
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed top-[72px] left-0 right-0 bottom-0 bg-background overflow-y-auto h-[calc(100vh-72px)]">
          <div className="px-6 py-6">
            <nav className="flex flex-col space-y-6">
              <NavLinks mobile isLoggedIn={isLoggedIn} />
              
              <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
                <span className="text-sm text-foreground/80">{t('header.Dark Mode')}</span>
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                  aria-label="Toggle dark mode"
                />
              </div>

              <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
                <span className="text-sm text-foreground/80">Language</span>
                <LanguageSelector variant="ghost" />
              </div>
              
              {isLoggedIn ? (
                <>
                  {location.pathname !== '/create-quest' && (
                    <Link 
                      to="/create-quest" 
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={18} />
                      <span>{t('header.New Quest')}</span>
                    </Link>
                  )}
                  <Link
                    to="/my-quests"
                    className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2"
                  >
                    <User size={18} />
                    <span>{t('header.My Quests')}</span>
                  </Link>
                  <Link
                    to={pages.notifications.location}
                    className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2 relative"
                  >
                    <Bell size={18} />
                    <span>{t('header.Notifications')}</span>
                    {getUnreadCount() > 0 && (
                      <NotificationBadge count={getUnreadCount()} className="static ml-2 -mt-0" />
                    )}
                  </Link>
                  <Link
                    to={`/profile/${profile?.username || 'user'}`}
                    className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2"
                  >
                    <Settings size={18} />
                    <span>{t('header.Profile')}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-foreground/80 hover:text-foreground flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    <span>{t('header.Log Out')}</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/connect" 
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <UserCircle size={18} />
                  <span>{t('header.Connect with Nostr')}</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
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
  const { t } = useTranslation();
  const initials = profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U';
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative">
          {hasUnread && (
            <NotificationBadge showDot />
          )}
          <Avatar className="h-10 w-10 border-2 border-primary hover:border-primary/80 transition-colors">
            <AvatarImage 
              src={profile?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=bettrquest"} 
              alt={profile?.displayName || "User"} 
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 bg-popover" align="end">
        <DropdownMenuItem asChild>
          <Link to="/my-quests" className="flex items-center gap-2 cursor-pointer">
            <User size={16} />
            <span>{t('header.My Quests')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(pages.notifications.location)} className="flex items-center gap-2 cursor-pointer relative">
          <Bell size={16} />
          <span>{t('header.Notifications')}</span>
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
              {unreadCount}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/profile/${profile?.username || 'user'}`} className="flex items-center gap-2 cursor-pointer">
            <Settings size={16} />
            <span>{t('header.Profile')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <LanguageSelector variant="ghost" className="w-full justify-start" closeParent={() => setOpen(false)} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-red-500">
          <LogOut size={16} />
          <span>{t('header.Log Out')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavLinks = ({ mobile = false, isLoggedIn = false }: { mobile?: boolean, isLoggedIn?: boolean }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const isActive = (path: string) => location.pathname === path;
  
  const links = [
    { to: pages.explore.location, label: t(`pages.${pages.explore.name}`) },
    ...(isLoggedIn ? [{ to: pages.timeline.location, label: t(`pages.${pages.timeline.name}`) }] : []),
    { to: pages.coachDirectory.location, label: t(`pages.${pages.coachDirectory.name}`) },
    ...(isLoggedIn ? [{ to: pages.registerCoach.location, label: t(`pages.${pages.registerCoach.name}`) }] : []),
    { 
      to: "/premium", 
      label: (
        <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {t('header.Get Premium')}
        </span>
      )
    },
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
