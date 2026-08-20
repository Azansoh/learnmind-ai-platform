import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, "success"), [addToast]);
  const error = useCallback((msg) => addToast(msg, "error", 5000), [addToast]);
  const info = useCallback((msg) => addToast(msg, "info"), [addToast]);

  const iconMap = {
    success: <FaCheckCircle className="text-emerald-400 text-lg shrink-0" />,
    error: <FaExclamationCircle className="text-red-400 text-lg shrink-0" />,
    info: <FaInfoCircle className="text-blue-400 text-lg shrink-0" />,
  };

  const bgMap = {
    success: "border-emerald-500/30 bg-emerald-500/10",
    error: "border-red-500/30 bg-red-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
  };

  const textMap = {
    success: "text-emerald-300",
    error: "text-red-300",
    info: "text-blue-300",
  };

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-slide-in ${bgMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <p className={`text-sm font-medium flex-1 ${textMap[toast.type]}`}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition shrink-0"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}
