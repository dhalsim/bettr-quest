import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Target, Zap, Award, PlusCircle, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestCard from '@/components/quest-card/QuestCard';
import { useTranslation } from 'react-i18next';
import { mockQuests, mockProofs } from '@/mock/data';
import { isLockedQuest } from '@/types/quest';
import { useNostrAuth } from '@/hooks/useNostrAuth';

// Use existing quests from mockQuests
const featuredQuests = [
  mockQuests["1"], // Meditate for 20 minutes
  mockQuests["2"], // Learn 5 phrases in Italian
  mockQuests["8"]  // Zero Waste Day
];

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const coachSectionRef = useRef<HTMLDivElement>(null);
  const premiumSectionRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(null, { keyPrefix: "home" });
  const navigate = useNavigate();
  const { profile } = useNostrAuth();
  
  // Scroll to coach section functionality
  const scrollToCoachSection = () => {
    coachSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to premium section functionality
  const scrollToPremiumSection = () => {
    premiumSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Intersection Observer for animated entry
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0');
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const featureElements = document.querySelectorAll('.feature-item');
    featureElements.forEach((el) => {
      el.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      observer.observe(el);
    });
    
    return () => {
      featureElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const handleSpecializationClick = (e: React.MouseEvent, specialization: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/explore?specialization=${specialization}`);
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement follow toggle functionality
  };

  const handleLockSats = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement lock sats functionality
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            {t('Quest Yourself to')}{' '}
            <span className="text-primary">{t('Become Better')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            {t('Start your personal growth journey today by creating your first quest or exploring what others are achieving')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight size={18} />} className="hover:bg-primary/90 transition-colors">
                {t('Explore Quests')}
              </Button>
            </Link>
            <Link to="/create-quest">
              <Button size="lg" variant="outline" rightIcon={<PlusCircle size={18} />} className="hover:bg-primary hover:text-primary-foreground transition-colors">
                {t('Create Your Own')}
              </Button>
            </Link>
            <Link to="#" onClick={scrollToCoachSection}>
              <Button size="lg" variant="outline" rightIcon={<ArrowRight size={18} />} className="hover:bg-primary hover:text-primary-foreground transition-colors">
                {t('Become a Coach')}
              </Button>
            </Link>
            <Link to="#" onClick={scrollToPremiumSection}>
              <Button size="lg" variant="outline" className="hover:bg-gradient-to-r from-pink-500 via-purple-500 to-primary group">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:text-black transition-colors">
                  {t('View Premium Benefits')}
                </span>
                <ArrowRight size={18} className="ml-2 group-hover:text-black transition-colors" />
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-muted-foreground">{t('Quests Created')}</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">8,500+</div>
              <div className="text-muted-foreground">{t('Quests Completed')}</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
              <div className="text-muted-foreground">{t('Users Growing')}</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">{t('Coaches Registered')}</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Quests */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('Featured Quests')}</h2>
              <p className="text-muted-foreground max-w-2xl">
                {t('Discover popular quests that others are taking on to improve themselves')}
              </p>
              <p className="text-muted-foreground max-w-2xl mt-2">
                {t('Verify or Contest proofs of others and earn Bitcoin rewards for your participation')}
              </p>
            </div>
            <Link to="/explore" className="hidden md:flex items-center text-primary hover:underline">
              {t('View all')} <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredQuests.map((quest) => (
              <QuestCard 
                key={quest.id} 
                quest={quest}
                proof={isLockedQuest(quest) ? mockProofs[quest.id]?.[0] : undefined}
                isOwnedByCurrentUser={quest.userId === profile?.pubkey}
                isFollowing={false}
                onSpecializationClick={handleSpecializationClick}
                onFollowToggle={handleFollowToggle}
                onLockSats={handleLockSats}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/explore">
              <Button variant="outline">
                {t('View all')}
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary/30" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('How It Works')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('Our platform makes it easy to challenge yourself and get community validation for your achievements')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Create Quest')}</h3>
              <p className="text-muted-foreground">
                {t('Define your quest with title, description, tags and set a due date')}
              </p>
            </div>
            
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Choose Visibility')}</h3>
              <p className="text-muted-foreground">
                {t('Select public or private visibility. Choose a coach or AI to assist your goal. Lock your Bitcoin as motivation')}
              </p>
            </div>
            
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Take Action')}</h3>
              <p className="text-muted-foreground">
                {t('Work on your quest and collect relevant metrics to track your progress')}
              </p>
            </div>
            
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Submit Proof')}</h3>
              <p className="text-muted-foreground">
                {t('Upload your proof of completion - data, images, or videos showing your achievement')}
              </p>
            </div>
            
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Get Validated')}</h3>
              <p className="text-muted-foreground">
                {t('Receive community validation and get your locked Bitcoin back (minus fees)')}
              </p>
            </div>
            
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Get Your Bitcoin Back')}</h3>
              <p className="text-muted-foreground">
                {t('Get your locked Bitcoin back and receive donations from supporters when you complete your quest successfully')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Coach Section */}
      <section ref={coachSectionRef} className="py-20 px-6 bg-gradient-to-b from-background to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-6">{t('Become a Coach')}</h2>
              <p className="text-xl text-muted-foreground mb-6">
                {t('Help others achieve their goals and earn Bitcoin')}
              </p>
              <p className="text-muted-foreground mb-8">
                {t('As a coach, you can guide, verify, and support others on their quests')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register-coach">
                  <Button size="lg">
                    {t('Register as Coach')}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={scrollToPremiumSection}>
                  {t('View Premium Benefits')}
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 glass rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t('Review & Guide')}</h3>
                    <p className="text-muted-foreground text-sm">
                      {t('Review quest submissions, provide constructive feedback, and guide users towards their goals. Work one-on-one with users who choose private coaching.')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t('Verify Achievements')}</h3>
                    <p className="text-muted-foreground text-sm">
                      {t('Validate proof submissions and ensure users meet their quest requirements. Provide detailed feedback for private quests.')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t('Monetize Your Expertise')}</h3>
                    <p className="text-muted-foreground text-sm">
                      {t('Get paid in Bitcoin by helping users achieve their goals. Schedule text, audio, or video coaching sessions and monetize your time.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Subscription Section */}
      <section ref={premiumSectionRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              bettr<span className="text-primary">.quest</span>{' '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Premium
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('Save on platform fees and unlock exclusive benefits with our premium membership')}
            </p>
          </div>
          
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{t('Premium Benefits')}</h3>
                    <p className="text-muted-foreground">{t('Only 10,000 sats for 30 days')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold">{t('Zero Platform Fees')}</h4>
                      <p className="text-muted-foreground text-sm">{t('No fees for quest creation, AI services, or private coaching')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold">{t('Exclusive Events')}</h4>
                      <p className="text-muted-foreground text-sm">{t('Access to special bettr.quest events and contests')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold">{t('Get Out of Jail Free Card')}</h4>
                      <p className="text-muted-foreground text-sm">{t('You can once get your funds back before due date and proof submission')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold">{t('Give Reference')}</h4>
                      <p className="text-muted-foreground text-sm">{t('Share a reference code and win 5% of their premium subscription')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2 flex items-end justify-center">
                    10,000
                    <span className="text-lg ml-1">sats</span>
                  </div>
                  <div className="text-muted-foreground mb-6">{t('For 30 days')}</div>
                  <Link to="/premium">
                    <Button size="lg" className="w-full max-w-xs">
                      {t('Get Premium Access')}
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-6">{t('Ready to Become Better?')}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('Start your personal growth journey today by creating your first quest or exploring what others are achieving')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-quest">
              <Button size="lg">
                {t('Start Your First Quest')}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={scrollToCoachSection}>
              {t('Become a Coach')}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
