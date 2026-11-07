import React from 'react';
import { ChevronRight, Search, X, Inbox } from 'lucide-react';
export { PageHeader, StatCard } from './PageHeader';

export const ActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  onClick: () => void;
  accentColor?: 'teal' | 'orange' | 'rose' | 'emerald' | 'slate';
}> = ({ title, description, icon, badge, onClick, accentColor = 'teal' }) => {
  const iconColors = {
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${iconColors[accentColor]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {title}
            </h4>
            {badge && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}> = ({ title, description, action, icon }) => {
  return (
    <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 my-2">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading records...' }) => {
  return (
    <div className="p-12 text-center">
      <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-xs font-semibold text-slate-500">{message}</p>
    </div>
  );
};

export const SearchInput: React.FC<{
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value: controlledValue, onChange, placeholder = 'Search records...', className = '' }) => {
  const [internalVal, setInternalVal] = React.useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalVal;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalVal(val);
    onChange?.(val);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
      />
      {value && (
        <button
          onClick={() => handleChange('')}
          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const FilterBar: React.FC<{
  options: { id: string; label: string; count?: number }[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}> = ({ options, selectedId, onSelect, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto no-scrollbar ${className}`}>
      {options.map((opt) => {
        const isActive = selectedId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              isActive
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
              }`}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const DataTable: React.FC<{
  headers: string[];
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
}> = ({ headers, children, empty = false, emptyMessage = 'No records found' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="py-3 px-4 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
          {empty ? (
            <tr>
              <td colSpan={headers.length} className="py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};
