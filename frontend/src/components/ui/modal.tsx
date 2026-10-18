import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="animate-modal-fade fixed inset-0 z-50 flex items-stretch justify-center bg-black/55 backdrop-blur-[8px] lg:items-center lg:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass-modal animate-modal-pop flex h-full w-full flex-col overflow-hidden text-white sm:rounded-t-2xl lg:h-auto lg:max-h-[90vh] lg:max-w-[720px] lg:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="glass-chrome flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && <div className="glass-chrome shrink-0 border-t border-white/10 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
