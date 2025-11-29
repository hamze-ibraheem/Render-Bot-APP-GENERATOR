import React from 'react';
import { Shield, Copyright, FileText, Check, Flag } from './Icons';

export const CopyrightPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
          <Copyright className="w-4 h-4" />
          <span>Intellectual Property</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Copyright & License Policy
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Understanding your rights as a creator and a buyer on RenderBot, a platform by Task Foundation LLC.
        </p>
      </div>

      <div className="space-y-12">
        {/* Vendor Rights Section */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Vendor Ownership Rights</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-6">
            When you list an item on RenderBot, you retain ownership of your work. You are granting buyers a license to use your product in their projects, but you do not transfer the copyright unless explicitly stated in an "Exclusive" license agreement.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-700">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>You retain full copyright and intellectual property rights to your source code and design assets.</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>You determine the pricing and the type of license offered to buyers.</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>RenderBot acts as a marketplace facilitator and does not claim ownership of your submissions.</span>
            </li>
          </ul>
        </section>

        {/* License Types Section */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Buyer License Agreements</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-8">
            We offer three distinct license types to cater to different project needs. Buyers must adhere to the specific terms of the license purchased.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Standard License</h3>
              <p className="text-sm text-slate-600 mb-4">For a single end product which end users are not charged for.</p>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> One personal or commercial project</li>
                <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> No resale rights</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Extended License</h3>
              <p className="text-sm text-slate-600 mb-4">For a single end product which end users can be charged for.</p>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Monetized end product (SaaS)</li>
                <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Unlimited users</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Exclusive License</h3>
              <p className="text-sm text-slate-600 mb-4">Full transfer of rights. The item is removed from the store after purchase.</p>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Full IP ownership transfer</li>
                <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Resale rights included</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DMCA Section */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Reporting Infringement (DMCA)</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-6">
            RenderBot respects the intellectual property rights of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please report it immediately using the "Report" button on the product page.
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800">
            <strong>Note:</strong> Filing a false DMCA report can have legal consequences. Please ensure you are the copyright holder or an authorized agent before submitting a report.
          </div>
        </section>
      </div>
    </div>
  );
};