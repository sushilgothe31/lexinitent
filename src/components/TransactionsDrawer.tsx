import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  network?: 'devnet' | 'mainnet';
}

export const TransactionsDrawer: React.FC<TransactionsDrawerProps> = ({
  isOpen,
  onClose,
  transactions,
  network = 'devnet',
}) => {
  const [copiedSig, setCopiedSig] = useState<string | null>(null);

  if (!isOpen) return null;

  const copySignature = (sig: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sig);
      setCopiedSig(sig);
      setTimeout(() => setCopiedSig(null), 2000);
    }
  };

  const getTxTypeBadge = (type: Transaction['type']) => {
    switch (type) {
      case 'create_escrow':
        return { label: 'Create Escrow', color: 'text-[#a0ffc3] bg-[#00ec91]/10 border-[#00ec91]/30' };
      case 'accept_work':
        return { label: 'Accept Work', color: 'text-white bg-white/10 border-white/20' };
      case 'file_dispute':
        return { label: 'File Dispute', color: 'text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/30' };
      case 'stake_for_jury':
        return { label: 'Stake for Jury', color: 'text-[#edbf70] bg-[#edbf70]/10 border-[#edbf70]/30' };
      case 'commit_vote':
        return { label: 'Commit Vote', color: 'text-[#d5baff] bg-[#8a42f5]/20 border-[#8a42f5]/30' };
      case 'reveal_vote':
        return { label: 'Reveal Vote', color: 'text-[#a0ffc3] bg-[#00ec91]/10 border-[#00ec91]/30' };
      case 'airdrop':
        return { label: 'SOL Airdrop', color: 'text-[#a0ffc3] bg-[#00ec91]/20 border-[#00ec91]/40' };
      case 'transfer':
        return { label: 'SOL Transfer', color: 'text-white bg-white/10 border-white/20' };
      default:
        return { label: 'Solana Tx', color: 'text-white bg-white/10 border-white/20' };
    }
  };

  const clusterParam = network === 'devnet' ? '?cluster=devnet' : '';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[#181b26] border-l border-white/10 shadow-2xl flex flex-col p-5 overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-[22px]">receipt_long</span>
            <div>
              <h2 className="font-serif-court text-base text-white font-semibold leading-tight">
                Solana Transactions Ledger
              </h2>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ec91]"></span>
                {transactions.length} On-Chain Receipts • {network.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4 no-scrollbar">
          {transactions.map((tx) => {
            const badge = getTxTypeBadge(tx.type);
            const explorerUrl =
              tx.explorerUrl || `https://solscan.io/tx/${tx.signature}${clusterParam}`;

            return (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-[#1c1f2a] border border-white/5 space-y-2 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-ledger uppercase font-bold border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#968da1]">
                    {new Date(tx.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>

                <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
                  {tx.description}
                </p>

                {tx.amount && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                    <span className="text-[10px] text-[#968da1] uppercase">Amount</span>
                    <span className="font-mono font-bold text-white">+{tx.amount} SOL</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[11px] font-mono text-[#968da1]">
                  <span className="truncate max-w-[170px]" title={tx.signature}>
                    Sig: {tx.signature.slice(0, 8)}...{tx.signature.slice(-6)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copySignature(tx.signature)}
                      className="flex items-center gap-1 text-white hover:underline text-[10px]"
                    >
                      <span>{copiedSig === tx.signature ? 'Copied' : 'Copy'}</span>
                      <span className="material-symbols-outlined text-[12px]">
                        {copiedSig === tx.signature ? 'check' : 'content_copy'}
                      </span>
                    </button>

                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#a0ffc3] hover:underline text-[10px]"
                    >
                      <span>Solscan</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-all"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
