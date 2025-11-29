
import React from 'react';
import { CartItem } from '../types';
import { Trash2, X, ShoppingBag } from './Icons';
import { generateAppScreenSvg } from './AppCard';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  language?: 'en' | 'ar';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemove, language = 'en' }) => {
  const total = cart.reduce((sum, item) => sum + item.product.price, 0);
  const isAr = language === 'ar';

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : (isAr ? '-translate-x-full' : 'translate-x-full')}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isAr ? 'سلة التسوق' : 'Your Cart'}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              <p>{isAr ? 'سلتك فارغة.' : 'Your cart is empty.'}</p>
              <button 
                onClick={onClose}
                className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                {isAr ? 'تصفح المتجر' : 'Browse Marketplace'}
              </button>
            </div>
          ) : (
            cart.map((item) => {
               const seed = item.product.imageSeed || item.product.name.length;
               // Determine localized name for image generation and display
               const name = (isAr && item.product.name_ar) ? item.product.name_ar : item.product.name;
               const tagline = (isAr && item.product.tagline_ar) ? item.product.tagline_ar : item.product.tagline;
               
               const imageSrc = item.product.imageUrl || generateAppScreenSvg(name, tagline, seed);
               return (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <img 
                      src={imageSrc} 
                      alt={name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900 dark:text-white">{name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {(isAr && item.product.category_ar) ? item.product.category_ar : item.product.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">${item.product.price}</span>
                      <button 
                        onClick={() => onRemove(item.product.id)}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-600 dark:text-slate-400">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">${total}</span>
            </div>
            <button className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition flex items-center justify-center gap-2">
              {isAr ? 'التقدم للدفع' : 'Proceed to Checkout'}
            </button>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
              {isAr ? 'دفع آمن بواسطة Stripe (تجريبي)' : 'Secure checkout powered by Stripe (Demo)'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
