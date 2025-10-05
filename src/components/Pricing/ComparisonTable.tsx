import { useState, useRef } from 'react';
import { Check, X, Info, ChevronDown } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface ComparisonTableProps {
  isAnnual: boolean;
}

interface Feature {
  name: string;
  description?: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

interface FeatureCategory {
  category: string;
  features: Feature[];
}

export const ComparisonTable = ({ isAnnual: _isAnnual }: ComparisonTableProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Core Features'])
  );
  const tableRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(tableRef, { threshold: 0.1 });

  const featureCategories: FeatureCategory[] = [
    {
      category: 'Core Features',
      features: [
        {
          name: 'API Calls',
          starter: '10,000/mo',
          professional: '100,000/mo',
          enterprise: 'Unlimited',
        },
        {
          name: 'Neural Model Access',
          description: 'Access to AI models and capabilities',
          starter: 'Basic',
          professional: 'Advanced',
          enterprise: 'Custom',
        },
        {
          name: 'Response Time',
          starter: '< 100ms',
          professional: '< 50ms',
          enterprise: '< 25ms',
        },
        {
          name: 'Uptime SLA',
          starter: '99.9%',
          professional: '99.99%',
          enterprise: '99.999%',
        },
      ],
    },
    {
      category: 'Team & Collaboration',
      features: [
        {
          name: 'Team Members',
          starter: '5',
          professional: 'Unlimited',
          enterprise: 'Unlimited',
        },
        {
          name: 'Role-based Access',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Team Analytics',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Dedicated Account Manager',
          starter: false,
          professional: true,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Analytics & Insights',
      features: [
        {
          name: 'Basic Analytics',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Advanced Analytics',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Custom Dashboards',
          starter: false,
          professional: false,
          enterprise: true,
        },
        {
          name: 'Data Export',
          starter: false,
          professional: true,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Support & Training',
      features: [
        {
          name: 'Email Support',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: '24/7 Priority Support',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Dedicated Support Team',
          starter: false,
          professional: false,
          enterprise: true,
        },
        {
          name: 'Custom Training',
          starter: false,
          professional: false,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Security & Compliance',
      features: [
        {
          name: 'SOC 2 Type II',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'GDPR Compliant',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'HIPAA Compliant',
          starter: false,
          professional: false,
          enterprise: true,
        },
        {
          name: 'Security Audits',
          starter: false,
          professional: false,
          enterprise: true,
        },
        {
          name: 'On-premise Deployment',
          starter: false,
          professional: false,
          enterprise: true,
        },
      ],
    },
  ];

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-slate mx-auto" />
      );
    }
    return <span className="text-pearl font-semibold">{value}</span>;
  };

  return (
    <div
      ref={tableRef}
      className={`mb-32 transition-all duration-987 ease-ai-emerge ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="text-center mb-12">
        <h3 className="text-h2 font-display font-bold text-gradient mb-4">
          Compare All Features
        </h3>
        <p className="text-h4 text-silver max-w-2xl mx-auto font-light">
          Detailed breakdown of what's included in each plan
        </p>
      </div>

      <div className="glass-heavy rounded-3xl overflow-hidden border border-pearl/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pearl/10">
                <th className="text-left p-6 text-pearl font-display font-semibold text-lg min-w-[250px]">
                  Features
                </th>
                <th className="p-6 text-pearl font-display font-semibold text-lg min-w-[150px]">
                  Starter
                </th>
                <th className="p-6 text-pearl font-display font-semibold text-lg min-w-[150px] bg-pearl/5">
                  Professional
                </th>
                <th className="p-6 text-pearl font-display font-semibold text-lg min-w-[150px]">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {featureCategories.map((category) => {
                const isExpanded = expandedCategories.has(category.category);
                return (
                  <tr key={category.category} className="border-b border-pearl/5 last:border-b-0">
                    <td colSpan={4} className="p-0">
                      <button
                        onClick={() => toggleCategory(category.category)}
                        className="w-full text-left p-6 bg-carbon/30 hover:bg-carbon/50 transition-colors duration-233 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-pearl font-display font-semibold text-base">
                            {category.category}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-silver transition-transform duration-233 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        className={`transition-all duration-377 ease-ai-emerge overflow-hidden ${
                          isExpanded ? 'max-h-[2000px]' : 'max-h-0'
                        }`}
                      >
                        <table className="w-full">
                          <tbody>
                            {category.features.map((feature) => (
                              <tr
                                key={feature.name}
                                className="border-b border-pearl/5 last:border-b-0 hover:bg-pearl/5 transition-colors duration-144"
                              >
                                <td className="p-4 pl-8 min-w-[250px]">
                                  <div className="flex items-center gap-2">
                                    <span className="text-silver text-sm">
                                      {feature.name}
                                    </span>
                                    {feature.description && (
                                      <div className="group/tooltip relative">
                                        <Info className="w-4 h-4 text-slate hover:text-silver transition-colors cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-carbon rounded-lg text-xs text-pearl opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-233 pointer-events-none whitespace-nowrap z-20 shadow-depth-3">
                                          {feature.description}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center min-w-[150px]">
                                  {renderCell(feature.starter)}
                                </td>
                                <td className="p-4 text-center min-w-[150px] bg-pearl/5">
                                  {renderCell(feature.professional)}
                                </td>
                                <td className="p-4 text-center min-w-[150px]">
                                  {renderCell(feature.enterprise)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
