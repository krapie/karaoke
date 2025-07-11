import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, padding = 'md', style }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        style={style}
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
          paddingClasses[padding],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
