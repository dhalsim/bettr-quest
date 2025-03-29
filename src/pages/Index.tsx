import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Target, Zap, Award, PlusCircle, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestCard from '@/components/ui/QuestCard';
import { useTranslation } from 'react-i18next';
import { mockQuests } from '@/mock/data';

// Use existing quests from mockQuests
const featuredQuests = [
  mockQuests["1"], // Meditate for 20 minutes
  mockQuests["2"], // Learn 5 phrases in Italian
  mockQuests["8"]  // Zero Waste Day
];

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const coachSectionRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation(null, { keyPrefix: "home" });
  
  // Scroll to coach section functionality
  const scrollToCoachSection = () => {
    coachSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Quest Yourself to <span className="text-primary">Become Better</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            {t('Start your personal growth journey today by creating your first quest or exploring what others are achieving')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                {t('Explore Quests')}
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="outline" size="lg" rightIcon={<PlusCircle size={18} />}>
                {t('Create Your Own')}
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={scrollToCoachSection}>
              {t('Become a Coach')}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-muted-foreground">Quests Created</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">8,500+</div>
              <div className="text-muted-foreground">Quests Completed</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
              <div className="text-muted-foreground">Users Growing</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Coaches Registered</div>
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
            </div>
            <Link to="/explore" className="hidden md:flex items-center text-primary hover:underline">
              {t('View all')} <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Create Quest')}</h3>
              <p className="text-muted-foreground">
                {t('Define your personal quest with clear goals and timeframes')}
              </p>
            </div>
            
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Take Action')}</h3>
              <p className="text-muted-foreground">
                {t('Work on your quest consistently and track your progress')}
              </p>
            </div>
            
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Submit Proof')}</h3>
              <p className="text-muted-foreground">
                {t('When completed, share evidence of your achievement with the community')}
              </p>
            </div>
            
            <div className="feature-item glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('Get Validated')}</h3>
              <p className="text-muted-foreground">
                {t('Receive community validation and celebrate your accomplishment')}
              </p>
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
            <Link to="/create">
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
      
      {/* Become a Coach Section - Moved below CTA */}
      <section ref={coachSectionRef} className="py-20 px-6 bg-gradient-to-b from-background to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-6">{t('Become a Coach')}</h2>
              <p className="text-xl text-muted-foreground mb-6">
                {t('Help others achieve their goals and earn rewards')}
              </p>
              <p className="text-muted-foreground mb-8">
                {t('As a coach, you can guide, verify, and support others on their quests')}
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link to="/register-coach">
                  <Button size="lg">
                    {t('Register as Coach')}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 glass rounded-2xl p-8 flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-video flex items-center justify-center">
                <div className="absolute w-24 h-24 bg-primary/10 rounded-full -top-4 -left-4 flex items-center justify-center">
                  <Users size={32} className="text-primary" />
                </div>
                <div className="absolute w-16 h-16 bg-secondary/30 rounded-full bottom-8 -right-4 flex items-center justify-center">
                  <Globe size={24} className="text-primary" />
                </div>
                <div className="glass rounded-xl p-6 w-full text-center">
                  <div className="text-2xl font-bold mb-2">500+</div>
                  <div className="text-muted-foreground">Active Coaches</div>
                  <div className="mt-4 text-2xl font-bold mb-2">10,000+</div>
                  <div className="text-muted-foreground">Quests Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
