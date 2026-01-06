import type { ReactNode } from "react";
import { Handle, type HandleProps } from "reactflow";
import { cn } from "@/lib/utils";

interface BaseHandleProps extends HandleProps {
  className?: string;
  children?: ReactNode;
}

export function BaseHandle({ className, children, ...props }: BaseHandleProps) {
  return (
    <Handle
      {...props}
      className={cn(
        "h-[11px] w-[11px] rounded-full border border-input bg-muted transition-colors hover:bg-primary hover:border-primary",
        className
      )}
    >
      {children}
    </Handle>
  );
}
