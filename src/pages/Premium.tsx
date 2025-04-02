import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Award, Zap, Star, Gift, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Premium = () => {
  const { t } = useTranslation(null, { keyPrefix: "premium" });

  const benefits = [
    {
      icon: <Shield className="text-primary" size={24} />,
      title: t('Zero Platform Fees'),
      description: t('No fees for quest creation, AI services, or private coaching')
    },
    {
      icon: <Award className="text-primary" size={24} />,
      title: t('Exclusive Events'),
      description: t('Access to special bettr.quest events and contests')
    },
    {
      icon: <Gift className="text-primary" size={24} />,
      title: t('Prize Opportunities'),
      description: t('Chance to win exclusive prizes in premium contests')
    },
    {
      icon: <Star className="text-primary" size={24} />,
      title: t('Early Access'),
      description: t('Be the first to try new features and improvements')
    },
    {
      icon: <Sparkles className="text-primary" size={24} />,
      title: t('Exclusive Badges'),
      description: t('Show off your premium status with special profile badges')
    }
  ];

  const faq = [
    {
      question: t('How long does premium access last?'),
      answer: t('Premium access is valid for 30 days from the date of purchase.')
    },
    {
      question: t('Can I purchase premium access again?'),
      answer: t('Yes, you can purchase premium access once your current access expires.')
    },
    {
      question: t('What payment methods are accepted?'),
      answer: t('We accept Bitcoin payments through the Lightning Network. All payments are processed securely.')
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            bettr<span className="text-primary">.quest</span>{' '}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Premium
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('Unlock exclusive benefits and save on fees with our premium access')}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="glass rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{t('Premium Benefits')}</h2>
                  <p className="text-muted-foreground">{t('One-time payment of 10,000 sats for 30 days of access')}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10,000</div>
                <div className="text-muted-foreground mb-6">{t('sats for 30 days')}</div>
                <Button size="lg" className="w-full max-w-xs">
                  {t('Get Premium Access')}
                  <ArrowRight size={18} className="ml-2" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  {t('Access valid for 30 days from purchase')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('Frequently Asked Questions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faq.map((item, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('Ready to Get Premium?')}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('Join thousands of users who are already enjoying the benefits of bettr.quest Premium')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              {t('Get Premium Now')}
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Link to="/">
              <Button variant="outline" size="lg">
                {t('Back to Home')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium; 