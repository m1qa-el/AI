import { useState, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface FAQ {
  question: string;
  answer: string;
}

export const PricingFAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const faqRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(faqRef, { threshold: 0.1 });

  const faqs: FAQ[] = [
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoice-based billing with NET 30 payment terms.',
    },
    {
      question: 'Can I change plans at any time?',
      answer:
        'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you will be charged a prorated amount for the remainder of your billing period. When downgrading, your new rate will take effect at the start of your next billing cycle.',
    },
    {
      question: 'Is there a free trial available?',
      answer:
        'Yes, all plans include a 14-day free trial with full access to features. No credit card is required to start your trial. You can cancel at any time during the trial period with no charges.',
    },
    {
      question: 'What happens if I exceed my API call limit?',
      answer:
        'If you exceed your monthly API call limit, your requests will continue to work but you will be charged for overage at a rate of $0.002 per additional call. You will receive notifications at 80% and 100% of your limit.',
    },
    {
      question: 'Do you offer discounts for non-profits or educational institutions?',
      answer:
        'Yes, we offer 30% discounts for qualified non-profit organizations and educational institutions. Please contact our sales team with proof of your organization status to apply for the discount.',
    },
    {
      question: 'What is your refund policy?',
      answer:
        'We offer a 30-day money-back guarantee for annual plans. If you are not satisfied with our service within the first 30 days, you can request a full refund. Monthly plans are non-refundable but you can cancel at any time.',
    },
    {
      question: 'Can I get a custom plan?',
      answer:
        'Yes, for organizations with unique needs, we can create custom plans with tailored features, API limits, and pricing. Please contact our Enterprise sales team to discuss your requirements.',
    },
    {
      question: 'Are there any setup fees or hidden costs?',
      answer:
        'No, there are no setup fees or hidden costs. The price you see is the price you pay. All features listed in your plan are included in your subscription price.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div
      ref={faqRef}
      className={`transition-all duration-987 ease-ai-emerge ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <HelpCircle className="w-8 h-8 text-silver" />
          <h3 className="text-h2 font-display font-bold text-gradient">
            Frequently Asked Questions
          </h3>
        </div>
        <p className="text-h4 text-silver max-w-2xl mx-auto font-light">
          Everything you need to know about our pricing
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              className="glass-heavy rounded-2xl overflow-hidden border border-pearl/10 transition-all duration-233 hover:border-pearl/20"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 flex items-start justify-between gap-4 group"
              >
                <span className="text-pearl font-semibold text-base flex-1 group-hover:text-gradient transition-all duration-233">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-silver flex-shrink-0 mt-0.5 transition-all duration-233 group-hover:text-pearl ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-377 ease-ai-emerge overflow-hidden ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-pearl/10 pt-4">
                    <p className="text-silver text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-silver text-base mb-4">Still have questions?</p>
        <button className="btn-secondary">Contact Sales Team</button>
      </div>
    </div>
  );
};
