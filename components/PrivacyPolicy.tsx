import React from 'react';
import { Lock, Eye, Database, Globe } from './Icons';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
          <Lock className="w-4 h-4" />
          <span>Data Protection</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Task Foundation LLC is committed to protecting your privacy. This policy explains how your information is collected, used, and disclosed by RenderBot.
        </p>
      </div>

      <div className="space-y-12 text-slate-700 dark:text-slate-300">
        
        {/* Collection */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
               <Database className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
           </div>
          <p className="leading-relaxed mb-4">
            We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Name, email address, and contact information.</li>
            <li>Billing information (processed securely by payment providers).</li>
            <li>Profile information (avatar, bio).</li>
            <li>Content you generate using our AI tools.</li>
          </ul>
          <p className="leading-relaxed">
             We also automatically collect certain information when you access our Service, such as your IP address, browser type, and usage data via cookies and similar technologies.
          </p>
        </section>

        {/* Usage */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
               <Eye className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. How We Use Information</h2>
           </div>
          <p className="leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Process transactions and send related information, including confirmations and invoices.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
          </ul>
        </section>

        {/* Sharing */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
               <Globe className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Data Sharing</h2>
           </div>
          <p className="leading-relaxed mb-4">
            We do not sell your personal information. We may share your information as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., hosting, payment processing).</li>
            <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of RenderBot or others.</li>
          </ul>
        </section>

        {/* Security */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Security</h2>
          <p className="leading-relaxed">
            RenderBot takes reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is completely secure.
          </p>
        </section>

        {/* User Rights */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Your Rights</h2>
          <p className="leading-relaxed mb-4">
            Depending on your location, you may have rights to access, correct, delete, or restrict use of your personal data. To exercise these rights, please contact our Data Protection Officer at privacy@renderbot.ai.
          </p>
        </section>

      </div>
    </div>
  );
};