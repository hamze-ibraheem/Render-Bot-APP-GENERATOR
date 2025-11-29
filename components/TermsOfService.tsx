import React from 'react';
import { FileText, Shield, Globe, CreditCard } from './Icons';

export const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
          <FileText className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Terms of Service
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Last updated: March 2024. Please read these terms carefully before using RenderBot.
        </p>
      </div>

      <div className="space-y-12 text-slate-700 dark:text-slate-300">
        {/* Introduction */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction</h2>
          <p className="leading-relaxed mb-4">
            Welcome to RenderBot ("Company", "we", "our", "us"), a platform operated by Task Foundation LLC. These Terms of Service ("Terms") govern your use of our website located at renderbot.ai (together or individually "Service").
          </p>
          <p className="leading-relaxed">
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>
        </section>

        {/* User Accounts */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
               <Shield className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Accounts & Security</h2>
           </div>
          <p className="leading-relaxed mb-4">
            When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
            <li>You agree to accept responsibility for all activities that occur under your account.</li>
            <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
          </ul>
        </section>

        {/* Marketplace Terms */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
               <Globe className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Marketplace & Licensing</h2>
           </div>
          <p className="leading-relaxed mb-4">
            RenderBot serves as a venue for Buyers and Vendors.
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">For Buyers:</h3>
          <p className="mb-4">
             When you purchase an item, you are acquiring a non-exclusive license to use the item, not ownership of the original intellectual property. The scope of this license (Standard, Extended, or Exclusive) is defined in our Copyright Policy.
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">For Vendors:</h3>
          <p className="mb-4">
             By listing products, you warrant that you own the rights to the content and are authorized to sell it. Task Foundation LLC retains a commission on sales as defined in the Vendor Agreement.
          </p>
        </section>

        {/* Payments */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
               <CreditCard className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Purchases & Subscriptions</h2>
           </div>
          <p className="leading-relaxed mb-4">
            If you wish to purchase any product or service made available through the Service, you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, and your billing address.
          </p>
          <p className="leading-relaxed">
            All payments are processed through secure third-party payment processors. We do not store your full credit card information. Subscription fees are billed on a recurring basis as selected by you (monthly or annually).
          </p>
        </section>

        {/* Termination */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Termination</h2>
          <p className="leading-relaxed">
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
        </section>

        {/* Disclaimer */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Limitation of Liability</h2>
          <p className="leading-relaxed mb-4">
            In no event shall Task Foundation LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>
        
        <p className="text-sm text-slate-500 text-center pt-8">
           Contact us at support@renderbot.ai if you have any questions regarding these Terms.
        </p>
      </div>
    </div>
  );
};