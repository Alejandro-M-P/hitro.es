type ToastVariant = 'success' | 'error' | 'info';

interface ToastOptions {
  durationMs?: number;
}

interface ToastPayload extends ToastOptions {
  message: string;
  variant?: ToastVariant;
}

interface ToastController {
  show(payload: ToastPayload): void;
  success(message: string, options?: ToastOptions): void;
  error(message: string, options?: ToastOptions): void;
  info(message: string, options?: ToastOptions): void;
}

const ROOT_ID = 'hitro-toast-root';
const STYLE_ID = 'hitro-toast-style';
const DEFAULT_DURATION_MS = 2400;

function getVariantClass(variant: ToastVariant): string {
  if (variant === 'success') return 'border-brand-blue text-white';
  if (variant === 'error') return 'border-red-500 text-white';
  return 'border-brand-border text-brand-muted';
}

function ensureRoot(): HTMLElement {
  let root = document.getElementById(ROOT_ID);
  if (root) return root;

  root = document.createElement('div');
  root.id = ROOT_ID;
  root.className = 'fixed top-24 left-4 z-[70] w-[min(92vw,360px)] space-y-2 pointer-events-none';
  document.body.appendChild(root);
  return root;
}

function ensureStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .hitro-toast-enter {
      animation: hitro-toast-enter 260ms ease forwards;
    }
    .hitro-toast-leave {
      animation: hitro-toast-leave 180ms ease forwards;
    }
    @keyframes hitro-toast-enter {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes hitro-toast-leave {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-6px); }
    }
  `;
  document.head.appendChild(style);
}

function createToast(message: string, variant: ToastVariant, durationMs: number): void {
  const root = ensureRoot();
  ensureStyle();

  const item = document.createElement('div');
  item.className = `hitro-toast-enter pointer-events-auto bg-brand-card border rounded-2xl px-4 py-3 text-sm font-sans shadow-2xl shadow-black/40 ${getVariantClass(variant)}`;
  item.textContent = message;
  root.appendChild(item);

  window.setTimeout(() => {
    item.classList.remove('hitro-toast-enter');
    item.classList.add('hitro-toast-leave');
    window.setTimeout(() => item.remove(), 180);
  }, durationMs);
}

export function useToast(): ToastController {
  return {
    show(payload) {
      createToast(payload.message, payload.variant || 'info', payload.durationMs || DEFAULT_DURATION_MS);
    },
    success(message, options) {
      createToast(message, 'success', options?.durationMs || DEFAULT_DURATION_MS);
    },
    error(message, options) {
      createToast(message, 'error', options?.durationMs || DEFAULT_DURATION_MS);
    },
    info(message, options) {
      createToast(message, 'info', options?.durationMs || DEFAULT_DURATION_MS);
    },
  };
}
