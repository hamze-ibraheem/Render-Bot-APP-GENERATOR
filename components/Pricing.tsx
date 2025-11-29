
import React from 'react';
import { Check, Sparkles, Zap } from './Icons';
import { Page } from '../types';

interface PricingProps {
  onNavigate: (page: Page) => void;
}

const PLANS = [
  {
    name: 'Free',
    price: 0,
    credits: 20,
    description: 'Perfect for hobbyists exploring app ideas.',
    features: [
      '20 AI Generation Credits / mo',
      'Download 3 AI-Gen UI Screens',
      'Demo Flutter Source Code',
      'App Documentation & Features',
      'Access to Public Marketplace'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    price: 29,
    credits: 500,
    description: 'For serious creators launching multiple apps.',
    features: [
      '500 AI Generation Credits / mo',
      'Download Full UI Kits (Figma)',
      'Complete React/Flutter Codebase',
      'Commercial Usage License',
      'Advanced "Thinking" Model',
      'Priority Email Support'
    ],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 299,
    credits: 10000,
    description: 'For agencies and large teams.',
    features: [
      '10,000 AI Generation Credits / mo',
      'Unlimited Downloads',
      'White-label License',
      'API Access',
      'Dedicated Account Manager',
      'Custom Integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Flexible Plans</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Simple Pricing for Everyone
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Start for free and upgrade as you grow. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PLANS.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-indigo-500 ring-2 ring-indigo-500 shadow-xl' 
                  : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{plan.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-2">/month</span>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.popular ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigate('login')}
                className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Need a custom plan for a large organization?</p>
          <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Contact our Enterprise Sales Team</button>
        </div>
      </div>
    </div>
  );
};
