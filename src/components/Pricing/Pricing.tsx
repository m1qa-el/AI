import { useState } from 'react';
import { PricingToggle } from './PricingToggle';
import { PricingCard } from './PricingCard';
import { ComparisonTable } from './ComparisonTable';
import { PricingFAQ } from './PricingFAQ';
import { TrustBadges } from './TrustBadges';

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        '10,000 API calls/month',
        'Basic neural models',
        'Email support',
        '99.9% uptime SLA',
        'Standard analytics',
        '5 team members',
        'API access',
        'Community support',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      description: 'Advanced features for growing businesses',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        '100,000 API calls/month',
        'Advanced neural models',
        'Priority support 24/7',
        '99.99% uptime SLA',
        'Advanced analytics & insights',
        'Unlimited team members',
        'Full API access',
        'Custom integrations',
        'Dedicated account manager',
        'Early access to features',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for large organizations',
      monthlyPrice: null,
      annualPrice: null,
      features: [
        'Unlimited API calls',
        'Custom neural models',
        'Dedicated support team',
        '99.999% uptime SLA',
        'Enterprise analytics suite',
        'Unlimited team members',
        'White-label options',
        'On-premise deployment',
        'Custom training & onboarding',
        'SLA guarantees',
        'Security audits',
        'Compliance assistance',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pearl/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pearl/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-h1 font-display font-bold text-gradient mb-6">
            Choose Your Intelligence Level
          </h2>
          <p className="text-h4 text-silver max-w-3xl mx-auto font-light mb-12">
            Transparent pricing that scales with your ambition. All plans include a 14-day free trial.
          </p>

          <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isAnnual={isAnnual}
              delay={index * 100}
            />
          ))}
        </div>

        <ComparisonTable isAnnual={isAnnual} />

        <TrustBadges />

        <PricingFAQ />
      </div>
    </section>
  );
};
