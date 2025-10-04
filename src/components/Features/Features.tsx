import { Brain, Zap, Network, Shield, Gauge, Globe } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'Contextual Understanding',
      description: 'Deep learning models that truly comprehend context, nuance, and intent beyond simple pattern matching.',
    },
    {
      icon: Zap,
      title: 'Instant Insights',
      description: 'Real-time analysis and decision-making powered by optimized neural architectures.',
    },
    {
      icon: Network,
      title: 'Seamless Integration',
      description: 'Connect with your existing tools and workflows through our comprehensive API ecosystem.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.',
    },
    {
      icon: Gauge,
      title: 'Lightning Performance',
      description: 'Consistently fast response times under 50ms, even at massive scale.',
    },
    {
      icon: Globe,
      title: 'Global Deployment',
      description: 'Edge computing infrastructure across 100+ locations worldwide for optimal latency.',
    },
  ];

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-h1 font-display font-bold text-gradient mb-6">
            Capabilities That Redefine Possible
          </h2>
          <p className="text-h4 text-silver max-w-3xl mx-auto font-light">
            Experience AI that doesn't just process—it understands, adapts, and evolves
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
