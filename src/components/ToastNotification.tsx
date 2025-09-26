import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from 'lucide-react';
export type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast
}) => {
  // Auto-remove toasts after 5 seconds
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    toasts.forEach(toast => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 5000);
      timers.push(timer);
    });
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [toasts, removeToast]);
  if (toasts.length === 0) return null;
  return <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map(toast => <ToastNotification key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />)}
    </div>;
};
interface ToastNotificationProps {
  toast: Toast;
  onClose: () => void;
}
const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onClose
}) => {
  const {
    type,
    message
  } = toast;
  let icon;
  let colorClasses = '';
  switch (type) {
    case 'success':
      icon = <CheckCircleIcon className="text-emerald-400" size={18} />;
      colorClasses = 'bg-emerald-500/10 ring-emerald-400/30';
      break;
    case 'error':
      icon = <XCircleIcon className="text-red-400" size={18} />;
      colorClasses = 'bg-red-500/10 ring-red-400/30';
      break;
    case 'info':
    default:
      icon = <InfoIcon className="text-blue-400" size={18} />;
      colorClasses = 'bg-blue-500/10 ring-blue-400/30';
      break;
  }
  return <div className={`rounded-lg ring-1 px-4 py-3 shadow-xl animate-fadeIn ${colorClasses}`} role="alert">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-zinc-200">{message}</span>
        <button onClick={onClose} className="ml-auto text-zinc-400 hover:text-zinc-300" aria-label="Bezárás">
          <XIcon size={16} />
        </button>
      </div>
    </div>;
};