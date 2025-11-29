
import React, { useState, useEffect } from 'react';
import { AppProduct } from '../types';
import { Server, Terminal, Database, Cloud, Check, ExternalLink, X, Rocket } from './Icons';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppProduct;
  onDeployComplete: (url: string) => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose, app, onDeployComplete }) => {
  const [step, setStep] = useState<'config' | 'deploying' | 'success'>('config');
  const [logs, setLogs] = useState<string[]>([]);
  const [projectName, setProjectName] = useState(app.name.toLowerCase().replace(/\s+/g, '-'));
  const [region, setRegion] = useState('us-east-1');

  useEffect(() => {
    if (step === 'deploying') {
      const deploySteps = [
        "Initializing deployment container...",
        "Cloning repository...",
        "Installing dependencies (npm install)...",
        "Setting up Supabase project...",
        `Creating database in ${region}...`,
        "Running migrations...",
        "Building frontend assets...",
        "Optimizing build...",
        "Deploying to Edge Network...",
        "Verifying health checks...",
        "Deployment Successful!"
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < deploySteps.length) {
          setLogs(prev => [...prev, `> ${deploySteps[currentStep]}`]);
          currentStep++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
             setStep('success');
             onDeployComplete(`https://${projectName}.renderbot.app`);
          }, 1000);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [step, region, projectName, onDeployComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
               <Rocket className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">Deploy to Supabase</h3>
               <p className="text-xs text-slate-500 dark:text-slate-400">Powered by RenderBot Cloud</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
             <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {step === 'config' && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Name</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 sm:text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <span className="inline-flex items-center px-3 text-slate-500 dark:text-slate-400 sm:text-sm">
                    .renderbot.app
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Region</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-1">US West (California)</option>
                  <option value="eu-central-1">EU Central (Frankfurt)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Infrastructure</label>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex flex-col items-center text-center">
                    <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
                    <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Postgres DB</span>
                    <span className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">Included</span>
                  </div>
                  <div className="flex-1 p-4 border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex flex-col items-center text-center">
                     <Cloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
                     <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Edge Functions</span>
                     <span className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">Auto-scaled</span>
                  </div>
                  <div className="flex-1 p-4 border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex flex-col items-center text-center">
                     <Server className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
                     <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Auth</span>
                     <span className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">Configured</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30 text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> This will create a new project in your Supabase organization. Standard usage rates apply.
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setStep('deploying')}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" /> Start Deployment
                </button>
              </div>
            </div>
          )}

          {step === 'deploying' && (
            <div className="animate-fade-in-up">
               <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto shadow-inner border border-slate-700">
                  {logs.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                  ))}
                  <div className="animate-pulse">_</div>
               </div>
               <div className="mt-4 flex items-center justify-center text-slate-500 dark:text-slate-400 gap-2">
                 <Terminal className="w-4 h-4" />
                 <span className="text-sm">Building and deploying resources...</span>
               </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center animate-fade-in-up py-4">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Check className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Deployment Complete!</h3>
               <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                 Your app is now live and ready to scale. You can manage your database and users from the admin dashboard.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <a 
                   href={`https://${projectName}.renderbot.app`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg"
                 >
                    <ExternalLink className="w-4 h-4" /> Visit Live App
                 </a>
                 <button 
                   onClick={onClose}
                   className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                 >
                    Back to Dashboard
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
