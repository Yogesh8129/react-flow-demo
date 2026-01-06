import type { ReactNode } from 'react';
import { Handle, type HandleProps } from 'reactflow';
import { cn } from '@/lib/utils';

interface BaseHandleProps extends HandleProps {
  className?: string;
  children?: ReactNode;
}

export function BaseHandle({ className, children, ...props }: BaseHandleProps) {
  return (
    <Handle
      {...props}
      className={cn(
        'dark:border-secondary dark:bg-secondary h-[11px] w-[11px] rounded-full border border-slate-300 bg-slate-100 transition',
        className
      )}
    >
      {children}
    </Handle>
  );
}
