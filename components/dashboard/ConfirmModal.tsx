"use client";
import { FaExclamationTriangle, FaCheck, FaTimes } from "react-icons/fa";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="h-14 w-14 border-2 border-amber-500/30 rounded-full flex items-center justify-center bg-amber-500/10">
            <FaExclamationTriangle className="text-amber-400 text-2xl" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Are you sure?</h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all hover:bg-white/[0.08] flex items-center gap-2"
          >
            <FaTimes size={12} /> Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
          >
            <FaCheck size={12} /> Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
