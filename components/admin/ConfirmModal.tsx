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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-[#0a1128] border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10 w-full max-w-md m-4 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 border-4 border-yellow-500/50 rounded-full flex items-center justify-center bg-yellow-500/10">
              <FaExclamationTriangle className="text-yellow-400 text-4xl" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Confirmation Required</h2>
          <p className="text-cyan-200/80 font-mono text-base mb-8">{message}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-black/40 border border-white/10 text-white rounded-md uppercase tracking-widest font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
            >
              <FaTimes />
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="px-8 py-3 bg-red-600/80 border border-red-500 text-white rounded-md uppercase tracking-widest font-bold hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <FaCheck />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
