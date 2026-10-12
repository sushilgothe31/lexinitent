import React, { useState } from 'react';

/* 1. Commit Vote Modal */
export const CommitVoteModal: React.FC<{
  isOpen: boolean;
  escrowId: string;
  onClose: () => void;
  onCommit: (escrowId: string, vote: 0 | 1, salt: string) => void;
}> = ({ isOpen, escrowId, onClose, onCommit }) => {
  const [selectedVote, setSelectedVote] = useState<0 | 1>(1); // 0 = Client, 1 = Freelancer
  const [salt] = useState(() => Math.random().toString(36).slice(2, 10));

  if (!isOpen) return null;

  const mockHash = `0x${Math.random().toString(36).slice(2, 12)}...${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d5baff]">lock</span>
            <span className="font-serif-court text-base text-white font-semibold">
              Commit Juror Vote
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
          To prevent bandwagoning, jurors submit a SHA-256 hash of their ruling + random salt. Your vote stays hidden until reveal phase.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-mono-ledger text-[#cdc2d8] block">Select Ruling:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedVote(0)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedVote === 0
                  ? 'bg-white text-black font-bold border-white shadow-md'
                  : 'bg-[#1c1f2a] text-[#cdc2d8] border-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] block mb-1">person</span>
              <span className="text-xs font-mono-ledger">Rule Client</span>
            </button>

            <button
              onClick={() => setSelectedVote(1)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedVote === 1
                  ? 'bg-white text-black font-bold border-white shadow-md'
                  : 'bg-[#1c1f2a] text-[#cdc2d8] border-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] block mb-1">terminal</span>
              <span className="text-xs font-mono-ledger">Rule Freelancer</span>
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b0e18] border border-white/10 space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[#968da1]">Random Secret Salt:</span>
            <span className="text-[#a0ffc3] font-bold">{salt}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#968da1]">Hashed Ballot Leaf:</span>
            <span className="text-white truncate max-w-[150px]">{mockHash}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-mono-ledger text-xs font-semibold hover:bg-white/15"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCommit(escrowId, selectedVote, salt);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-transform"
          >
            Commit to Solana
          </button>
        </div>
      </div>
    </div>
  );
};

/* 2. Reveal Vote Modal */
export const RevealVoteModal: React.FC<{
  isOpen: boolean;
  escrowId: string;
  onClose: () => void;
  onReveal: (escrowId: string, vote: 0 | 1) => void;
}> = ({ isOpen, escrowId, onClose, onReveal }) => {
  const [revealedVote, setRevealedVote] = useState<0 | 1>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a0ffc3]">visibility</span>
            <span className="font-serif-court text-base text-white font-semibold">
              Reveal On-Chain Vote
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
          The commit window has finalized. Reveal your salt to unlock your vote into the consensus tally and earn jury arbitration rewards.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setRevealedVote(0)}
            className={`p-3 rounded-xl border text-center transition-all ${
              revealedVote === 0
                ? 'bg-white text-black font-bold border-white'
                : 'bg-[#1c1f2a] text-[#cdc2d8] border-white/10'
            }`}
          >
            <span className="text-xs font-mono-ledger">Reveal: Client</span>
          </button>
          <button
            onClick={() => setRevealedVote(1)}
            className={`p-3 rounded-xl border text-center transition-all ${
              revealedVote === 1
                ? 'bg-white text-black font-bold border-white'
                : 'bg-[#1c1f2a] text-[#cdc2d8] border-white/10'
            }`}
          >
            <span className="text-xs font-mono-ledger">Reveal: Freelancer</span>
          </button>
        </div>

        <button
          onClick={() => {
            onReveal(escrowId, revealedVote);
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-transform"
        >
          Confirm On-Chain Reveal
        </button>
      </div>
    </div>
  );
};
