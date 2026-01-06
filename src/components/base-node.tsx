import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BaseNodeProps = HTMLAttributes<HTMLDivElement>;

export function BaseNode({ className, ...props }: BaseNodeProps) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground relative rounded-md border',
        'hover:ring-1',
        '[.react-flow\\_\\_node.selected_&]:border-muted-foreground',
        '[.react-flow\\_\\_node.selected_&]:shadow-lg',
        className
      )}
      tabIndex={0}
      {...props}
    />
  );
}

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...props}
      className={cn(
        'mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2',
        className
      )}
    />
  );
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn('user-select-none flex-1 font-semibold', className)}
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="base-node-content"
      className={cn('flex flex-col gap-y-2 p-3', className)}
      {...props}
    />
  );
}

export function BaseNodeFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        'flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3',
        className
      )}
      {...props}
    />
  );
}
