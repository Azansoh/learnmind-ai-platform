import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", danger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#0f192e] border border-slate-700/60 shadow-2xl animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
        >
          <FaTimes className="text-sm" />
        </button>

        <div className="p-6 sm:p-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${danger ? "bg-red-500/10 border border-red-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
            <FaExclamationTriangle className={`text-2xl ${danger ? "text-red-400" : "text-amber-400"}`} />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{message}</p>

          <div className="flex items-center gap-3 mt-7">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 text-sm font-semibold hover:bg-slate-800 hover:text-white transition"
            >
              {cancelText}
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition ${
                danger
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
