import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

/**
 * Toast notification component.
 * Usage: <Toast message="Success!" type="success" onClose={() => {}} />
 * Types: "success" | "error"
 * Auto-dismisses after `duration` ms (default 3000).
 */
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-6 right-6 z-[100] pointer-events-auto">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 max-w-sm
          ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
          ${isSuccess
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
      >
        {isSuccess ? <CheckCircle size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="shrink-0 hover:opacity-70 transition">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
