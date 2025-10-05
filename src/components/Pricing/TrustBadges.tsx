import { useRef } from 'react';
import { Shield, Lock, CheckCircle, CreditCard, Award, Users } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export const TrustBadges = () => {
  const badgesRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(badgesRef, { threshold: 0.1 });

  const trustMetrics = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users',
    },
    {
      icon: CheckCircle,
      value: '99.99%',
      label: 'Uptime',
    },
    {
      icon: Award,
      value: '4.9/5',
      label: 'Customer Rating',
    },
  ];

  const certifications = [
    {
      icon: Shield,
      name: 'SOC 2 Type II',
      description: 'Security audited',
    },
    {
      icon: Lock,
      name: 'GDPR Compliant',
      description: 'Data protection',
    },
    {
      icon: Shield,
      name: 'ISO 27001',
      description: 'Security certified',
    },
    {
      icon: Lock,
      name: 'HIPAA Ready',
      description: 'Healthcare compliance',
    },
  ];

  const paymentMethods = [
    'Visa',
    'Mastercard',
    'Amex',
    'Discover',
    'PayPal',
    'Apple Pay',
  ];

  return (
    <div
      ref={badgesRef}
      className={`mb-32 transition-all duration-987 ease-ai-emerge ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="text-center mb-12">
        <h3 className="text-h2 font-display font-bold text-gradient mb-4">
          Trusted by Industry Leaders
        </h3>
        <p className="text-h4 text-silver max-w-2xl mx-auto font-light">
          Enterprise-grade security and reliability you can depend on
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {trustMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`glass-heavy rounded-2xl p-8 text-center border border-pearl/10 transition-all duration-610 ease-ai-emerge hover:scale-105 hover:border-pearl/20 hover:shadow-depth-4`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <metric.icon className="w-10 h-10 text-pearl mx-auto mb-4" />
            <div className="text-4xl font-display font-bold text-pearl mb-2">
              {metric.value}
            </div>
            <div className="text-silver text-sm">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-heavy rounded-3xl p-8 border border-pearl/10 mb-12">
        <div className="text-center mb-8">
          <h4 className="text-h4 font-display font-semibold text-pearl mb-2">
            Security & Compliance
          </h4>
          <p className="text-silver text-sm">
            Your data is protected by industry-leading security standards
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={cert.name}
              className={`flex flex-col items-center text-center p-4 rounded-xl glass transition-all duration-377 ease-ai-emerge hover:scale-105 hover:shadow-depth-2`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-pearl/10 flex items-center justify-center mb-3">
                <cert.icon className="w-6 h-6 text-pearl" />
              </div>
              <div className="text-pearl font-semibold text-sm mb-1">
                {cert.name}
              </div>
              <div className="text-silver text-xs">{cert.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-heavy rounded-3xl p-8 border border-pearl/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-silver" />
            <div>
              <div className="text-pearl font-semibold text-base mb-1">
                Secure Payment Methods
              </div>
              <div className="text-silver text-sm">
                Bank-level encryption for all transactions
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method}
                className={`px-4 py-2 rounded-lg glass border border-pearl/10 transition-all duration-233 hover:border-pearl/20 hover:scale-105`}
              >
                <span className="text-silver text-sm font-semibold">
                  {method}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-pearl/10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
            <div className="flex items-center gap-2 text-silver text-sm">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-silver text-sm">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Cancel anytime, no questions asked</span>
            </div>
            <div className="flex items-center gap-2 text-silver text-sm">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No hidden fees or charges</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
