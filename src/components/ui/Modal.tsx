import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
