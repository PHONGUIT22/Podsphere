import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = ({ label, error, icon, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-bold text-zinc-500 uppercase ml-1">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 ${icon ? 'pl-10' : 'px-4'} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="ml-1 text-[10px] font-medium text-red-500">{error}</p>}
    </div>
  );
};