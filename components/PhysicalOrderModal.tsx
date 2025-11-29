
import React, { useState } from 'react';
import { Order } from '../types';
import { Package, MapPin, Truck, X, Usb, Box } from './Icons';

interface PhysicalOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onConfirmOrder: () => void;
}

export const PhysicalOrderModal: React.FC<PhysicalOrderModalProps> = ({ isOpen, onClose, order, onConfirmOrder }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmOrder();
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-start">
           <div>
             <div className="flex items-center gap-2 mb-2 text-indigo-300 text-sm font-bold uppercase tracking-wider">
               <Package className="w-4 h-4" /> Premium Upgrade
             </div>
             <h3 className="text-2xl font-bold">Order Physical Copy</h3>
             <p className="text-slate-300 text-sm mt-1">Get your codebase delivered on a secure drive.</p>
           </div>
           <button onClick={onClose} className="text-white/70 hover:text-white">
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Box Preview */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8 flex items-center gap-6 border border-slate-100 dark:border-slate-700">
             <div className="w-24 h-24 bg-indigo-600 rounded-lg shadow-xl flex items-center justify-center text-white relative transform rotate-3">
                <Box className="w-10 h-10" />
                <div className="absolute bottom-2 right-2 text-[10px] font-bold opacity-70">RENDERBOT</div>
             </div>
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Developer Box Set</h4>
                <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                   <li className="flex items-center gap-2"><Usb className="w-3 h-3 text-indigo-500" /> 64GB Metal USB-C Drive</li>
                   <li className="flex items-center gap-2"><Package className="w-3 h-3 text-indigo-500" /> Source Code Pre-loaded</li>
                   <li className="flex items-center gap-2"><Package className="w-3 h-3 text-indigo-500" /> Metal License Card</li>
                </ul>
                <div className="mt-3 font-bold text-indigo-600 dark:text-indigo-400">$49.00 <span className="text-xs font-normal text-slate-400 ml-1">+ Free Shipping</span></div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shipping Address</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <MapPin className="h-4 w-4 text-slate-400" />
                 </div>
                 <input 
                   required
                   type="text" 
                   value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
                   placeholder="123 Developer Lane"
                 />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input 
                    required
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
                    placeholder="San Francisco"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ZIP / Postal</label>
                  <input 
                    required
                    type="text" 
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
                    placeholder="94103"
                  />
               </div>
             </div>

             <button 
               type="submit"
               disabled={isProcessing}
               className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 mt-4"
             >
                {isProcessing ? 'Processing Order...' : (
                   <>
                     <Truck className="w-5 h-5" /> Confirm Order ($49)
                   </>
                )}
             </button>
             <p className="text-xs text-center text-slate-400 mt-2">
                Estimated delivery: 5-7 business days
             </p>
          </form>
        </div>
      </div>
    </div>
  );
};
