import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { PersonalProvider } from "@/components/providers/personal-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

/** Renders inside the same providers as the app (device storage, toasts). */
export function renderWithProviders(ui: ReactElement) {
  return render(
    <ToastProvider>
      <PersonalProvider>{ui}</PersonalProvider>
    </ToastProvider>,
  );
}
