import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/use-count-up';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}

export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 100,
  baseDelay = 0,
}: StaggerContainerProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(className)}
      style={{
        '--stagger-delay': prefersReducedMotion ? '0ms' : `${staggerDelay}ms`,
        '--base-delay': prefersReducedMotion ? '0ms' : `${baseDelay}ms`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

interface StaggerItemProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export const StaggerItem = ({ children, index, className }: StaggerItemProps) => {
  return (
    <div
      className={cn('opacity-0 animate-fade-in-up', className)}
      style={{
        animationDelay: `calc(var(--base-delay, 0ms) + ${index} * var(--stagger-delay, 100ms))`,
        animationFillMode: 'forwards',
      }}
    >
      {children}
    </div>
  );
};
