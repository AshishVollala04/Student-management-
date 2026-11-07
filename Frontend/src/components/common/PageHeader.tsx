import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
      <div>
        {breadcrumbs && (
          <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={b.label}>
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumbs.length - 1 ? 'text-slate-800 dark:text-slate-200 font-medium' : ''}>
                  {b.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

export interface StatCardProps {
  label?: string;
  title?: string;
  value: string | number;
  subtext?: string;
  subtitle?: string;
  icon?: any;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'teal' | 'orange' | 'rose' | 'emerald' | 'slate' | 'amber' | 'blue';
  color?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  title,
  value,
  subtext,
  subtitle,
  icon: IconComponent,
  trend,
  accentColor = 'teal',
  color,
  onClick
}) => {
  const chosenColor = (color || accentColor) as string;
  const iconBgs: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  };

  const displayLabel = label || title || '';
  const displaySubtext = subtext || subtitle;

  const renderIcon = () => {
    if (!IconComponent) return null;
    if (React.isValidElement(IconComponent)) return IconComponent;
    if (typeof IconComponent === 'function') {
      const Comp = IconComponent;
      return <Comp className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block truncate">
            {displayLabel}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {value}
          </div>
          {displaySubtext && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              {displaySubtext}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold">
              <span className={trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400 font-normal">vs prev cycle</span>
            </div>
          )}
        </div>

        {IconComponent && (
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBgs[chosenColor] || iconBgs.teal}`}>
            {renderIcon()}
          </div>
        )}
      </div>
    </div>
  );
};
