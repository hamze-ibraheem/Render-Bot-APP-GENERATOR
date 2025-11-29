import React from 'react';

interface ToasterProps {
  message: string;
}

export const Toaster: React.FC<ToasterProps> = ({ message }) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-bounce-in">
      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};