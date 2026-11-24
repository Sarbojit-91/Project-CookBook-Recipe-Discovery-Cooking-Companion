"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Accessible dialog built on the native <dialog> element: it traps focus, makes the rest of the
 * page inert, closes on Escape and returns focus to the button that opened it.
 */
export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "bg-cream text-ink backdrop:bg-ink/40 open:animate-fade-in m-auto w-[min(32rem,calc(100vw-2rem))] rounded-(--radius-card) p-0 shadow-(--shadow-raised) backdrop:backdrop-blur-sm max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none",
        className,
      )}
    >
      {open && (
        <div className="flex max-h-[85dvh] flex-col">
          <div className="border-line flex items-start justify-between gap-4 border-b px-5 py-4">
            <div>
              <h2 id={titleId} className="text-xl font-semibold">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="text-ink-muted mt-1 text-sm">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="hover:bg-sand -mr-2 grid size-11 shrink-0 place-items-center rounded-full"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}
