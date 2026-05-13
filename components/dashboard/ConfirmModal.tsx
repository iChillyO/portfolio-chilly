"use client";
import { FaExclamationTriangle, FaCheck, FaTimes } from "react-icons/fa";

interface ConfirmModalProps { isOpen: boolean; onClose: () => void; onConfirm: () => void; message: string; }

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface border border-white/[0.06] rounded-2xl shadow-2xl w-full max-w-sm m-4 p-6 text-center">
        <div className="flex justify-center mb-4"><div className="h-11 w-11 border-2 border-gold/30 rounded-full flex items-center justify-center bg-gold/10"><FaExclamationTriangle className="text-gold text-lg" /></div></div>
        <h2 className="text-base font-bold text-pearl mb-1.5">Are you sure?</h2>
        <p className="text-xs text-pearl/40 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-2.5">
          <button onClick={onClose} className="px-5 py-2 bg-white/[0.04] border border-white/[0.06] text-pearl/70 rounded-lg text-xs font-medium transition-all hover:bg-white/[0.07] flex items-center gap-1.5"><FaTimes size={10} /> Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-medium transition-all shadow-sm shadow-red-600/20 flex items-center gap-1.5"><FaCheck size={10} /> Delete</button>
        </div>
      </div>
    </div>
  );
}
