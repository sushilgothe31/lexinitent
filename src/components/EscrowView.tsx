import React, { useState } from 'react';
import { Agreement, JurorStake, WalletState } from '../types';

interface EscrowViewProps {
  agreements: Agreement[];
  jurors: JurorStake[];
  wallet: WalletState;
  onOpenCreateEscrow: () => void;
  onOpenStakeJury: () => void;
  onAcceptWork: (agreementId: string) => void;
  onFileDispute: (agreementId: string) => void;
  onOpenCommitVote: (agreementId: string) => void;
  onOpenRevealVote: (agreementId: string) => void;
  onConnectWallet: () => void;
}

export const EscrowView: React.FC<EscrowViewProps> = ({
  agreements,
  jurors,
  wallet,
  onOpenCreateEscrow,
  onOpenStakeJury,
  onAcceptWork,
  onFileDispute,
  onOpenCommitVote,
  onOpenRevealVote,
  onConnectWallet,
}) => {
  const [filterState, setFilterState] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute metrics
  const totalLocked = agreements
    .filter((a) => a.state === 'Active' || a.state === 'Disputed')
    .reduce((sum, a) => sum + a.amount, 0);

  const activeCount = agreements.filter((a) => a.state === 'Active').length;
  const disputedCount = agreements.filter((a) => a.state === 'Disputed').length;
  const completedCount = agreements.filter((a) => a.state === 'Completed' || a.state === 'ResolvedClient' || a.state === 'ResolvedFreelancer').length;

  const filteredAgreements = agreements.filter((a) => {
    if (filterState === 'all') return true;
    if (filterState === 'active') return a.state === 'Active';
    if (filterState === 'disputed') return a.state === 'Disputed';
    if (filterState === 'completed') return a.state === 'Completed' || a.state === 'ResolvedClient' || a.state === 'ResolvedFreelancer';
    return true;
  });

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 space-y-6 max-w-lg mx-auto pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#181b26] via-[#10131d] to-[#1c1f2a] p-5 shadow-2xl">
        <div className="relative z-10 flex flex-col space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 w-fit text-[11px] font-mono-ledger text-[#a0ffc3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ec91] animate-pulse"></span>
            SOLANA ESCROW ENGINE • {wallet.network.toUpperCase()}
          </div>

          <h1 className="font-serif-court text-2xl text-white font-bold leading-tight">
            Decentralized Arbitration for Freelancers
          </h1>

          <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
            Lock funds in verifiable Solana escrow PDA vaults. If milestones drift or specs are disputed, sovereign staked jurors arbitrate via commit-reveal ballots.
          </p>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={onOpenCreateEscrow}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Create Escrow
            </button>

            <button
              onClick={onOpenStakeJury}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#272a35] hover:bg-[#323440] text-white border border-white/10 font-mono-ledger text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#edbf70]">gavel</span>
              Join the Jury
            </button>
          </div>
        </div>

        {/* Ambient image background */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-44 h-44 rounded-full bg-[#8a42f5]/10 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Live Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-[#181b26] border border-white/5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between text-[#cdc2d8] mb-1">
            <span className="font-mono-ledger text-[10px] uppercase">Total Locked</span>
            <span className="material-symbols-outlined text-[16px] text-[#a0ffc3]">lock</span>
          </div>
          <span className="font-serif-court text-xl text-white font-bold">
            {totalLocked.toFixed(1)} SOL
          </span>
          <span className="text-[10px] text-[#cdc2d8]">≈ ${(totalLocked * 150).toLocaleString()}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#181b26] border border-white/5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between text-[#cdc2d8] mb-1">
            <span className="font-mono-ledger text-[10px] uppercase">Active</span>
            <span className="material-symbols-outlined text-[16px] text-white">pending_actions</span>
          </div>
          <span className="font-serif-court text-xl text-white font-bold">{activeCount}</span>
          <span className="text-[10px] text-[#a0ffc3]">In progress</span>
        </div>

        <div className="p-3 rounded-xl bg-[#181b26] border border-white/5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between text-[#cdc2d8] mb-1">
            <span className="font-mono-ledger text-[10px] uppercase">Disputed</span>
            <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">balance</span>
          </div>
          <span className="font-serif-court text-xl text-[#ffb4ab] font-bold">{disputedCount}</span>
          <span className="text-[10px] text-[#ffb4ab]">Jury voting</span>
        </div>

        <div className="p-3 rounded-xl bg-[#181b26] border border-white/5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between text-[#cdc2d8] mb-1">
            <span className="font-mono-ledger text-[10px] uppercase">Completed</span>
            <span className="material-symbols-outlined text-[16px] text-[#edbf70]">task_alt</span>
          </div>
          <span className="font-serif-court text-xl text-white font-bold">{completedCount}</span>
          <span className="text-[10px] text-[#edbf70]">Funds settled</span>
        </div>
      </div>

      {/* Live Solana Account & Balance Banner */}
      <div className="p-3.5 rounded-xl bg-[#181b26] border border-white/10 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#00ec91]/20 flex items-center justify-center text-[#00ec91] shrink-0">
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono-ledger text-xs font-semibold text-white">
                {wallet.connected ? wallet.walletName : 'No Wallet Connected'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#a0ffc3] font-mono">
                {wallet.network.toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#cdc2d8] truncate">
              {wallet.connected && wallet.publicKey
                ? `${wallet.publicKey.slice(0, 8)}...${wallet.publicKey.slice(-6)} • ${wallet.balance.toFixed(4)} SOL`
                : 'Connect to broadcast live on-chain Solana transactions'}
            </p>
          </div>
        </div>
        <button
          onClick={onConnectWallet}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono-ledger text-xs shrink-0 font-medium border border-white/10 flex items-center gap-1"
        >
          <span>{wallet.connected ? 'Wallet & SOL' : 'Connect'}</span>
          <span className="material-symbols-outlined text-[14px]">tune</span>
        </button>
      </div>

      {/* Active Agreements Header & Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-court text-lg text-white font-semibold">Freelancer Agreements</h2>
            <span className="text-xs font-mono-ledger bg-[#272a35] text-white px-2 py-0.5 rounded-full border border-white/10">
              {agreements.length}
            </span>
          </div>

          <button
            onClick={onOpenCreateEscrow}
            className="flex items-center gap-1 text-xs font-mono-ledger text-white hover:underline font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Agreement
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All (${agreements.length})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'disputed', label: `Disputed (${disputedCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterState(pill.id)}
              className={`px-3 py-1.5 rounded-full font-mono-ledger text-xs transition-all ${
                filterState === pill.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#181b26] text-[#cdc2d8] hover:text-white border border-white/5'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agreements Cards Grid */}
      <div className="space-y-3.5">
        {filteredAgreements.map((agreement) => {
          const isDisputed = agreement.state === 'Disputed';
          const isCompleted = agreement.state === 'Completed' || agreement.state.startsWith('Resolved');

          return (
            <div
              key={agreement.id}
              className={`p-4 rounded-xl bg-[#181b26] border shadow-md space-y-3 transition-all ${
                isDisputed
                  ? 'border-[#ffb4ab]/40 bg-gradient-to-br from-[#181b26] to-[#ffb4ab]/5'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      onClick={() => copyToClipboard(agreement.id, agreement.id)}
                      className="font-mono text-xs text-white font-bold cursor-pointer hover:underline flex items-center gap-1"
                      title="Click to copy ID"
                    >
                      {agreement.id}
                      <span className="material-symbols-outlined text-[13px] text-[#cdc2d8]">
                        {copiedId === agreement.id ? 'check' : 'content_copy'}
                      </span>
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono-ledger uppercase font-bold border ${
                        agreement.state === 'Active'
                          ? 'bg-[#00ec91]/10 text-[#a0ffc3] border-[#00ec91]/30'
                          : isDisputed
                          ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#ffb4ab]/40 animate-pulse'
                          : 'bg-white/10 text-white border-white/20'
                      }`}
                    >
                      {agreement.state}
                    </span>

                    <span className="text-[10px] text-[#968da1] font-mono">
                      {new Date(agreement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="font-serif-court text-lg text-white font-bold">
                    {agreement.amount.toFixed(1)} SOL
                  </span>
                  <span className="text-[10px] font-mono text-[#cdc2d8]">
                    ${(agreement.amount * 150).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Intent text */}
              <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed bg-[#10131d]/60 p-2.5 rounded-lg border border-white/5">
                "{agreement.intentText}"
              </p>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#968da1] uppercase">Client</span>
                  <span className="text-white truncate" title={agreement.client}>
                    {agreement.client.slice(0, 6)}...{agreement.client.slice(-4)}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-[#968da1] uppercase">Freelancer</span>
                  <span className="text-white truncate" title={agreement.freelancer}>
                    {agreement.freelancer.slice(0, 6)}...{agreement.freelancer.slice(-4)}
                  </span>
                </div>
              </div>

              {/* Disputed Stats info */}
              {isDisputed && (
                <div className="p-2.5 rounded-lg bg-[#272a35] border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">gavel</span>
                    <span className="font-mono-ledger">Jury Quorum: 3 Jurors</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#cdc2d8]">
                    <span>Commits: {agreement.commitCount}</span>
                    <span>•</span>
                    <span>Reveals: {agreement.revealCount}</span>
                  </div>
                </div>
              )}

              {/* Actions Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                {agreement.state === 'Active' && (
                  <>
                    <button
                      onClick={() => onAcceptWork(agreement.id)}
                      className="flex-1 py-2 px-3 rounded-lg bg-white text-black font-mono-ledger text-xs font-bold hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      Accept Work &amp; Release
                    </button>

                    <button
                      onClick={() => onFileDispute(agreement.id)}
                      className="py-2 px-3 rounded-lg bg-[#272a35] hover:bg-[#323440] text-[#ffb4ab] font-mono-ledger text-xs font-semibold border border-[#ffb4ab]/30 active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">report_problem</span>
                      Dispute
                    </button>
                  </>
                )}

                {isDisputed && (
                  <>
                    <button
                      onClick={() => onOpenCommitVote(agreement.id)}
                      className="flex-1 py-2 px-3 rounded-lg bg-white text-black font-mono-ledger text-xs font-bold hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      Commit Vote (Hashed)
                    </button>

                    <button
                      onClick={() => onOpenRevealVote(agreement.id)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#272a35] hover:bg-[#323440] text-white font-mono-ledger text-xs font-semibold border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      Reveal Vote
                    </button>
                  </>
                )}

                {isCompleted && (
                  <div className="w-full flex items-center justify-between text-xs text-[#a0ffc3] py-1">
                    <span className="flex items-center gap-1 font-mono-ledger">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Funds Released on Solana Devnet
                    </span>
                    <span className="text-[10px] text-[#cdc2d8] font-mono">Immutable</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Jury Pool & Staking Card */}
      <div className="p-4 rounded-xl bg-[#181b26] border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8a42f5]/20 text-[#d5baff] flex items-center justify-center border border-[#8a42f5]/30">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
            <div>
              <span className="font-serif-court text-sm font-semibold text-white block">
                Solana Juror Staking Pool
              </span>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8]">
                {jurors.length} Staked Arbitrators Ready
              </span>
            </div>
          </div>

          <button
            onClick={onOpenStakeJury}
            className="px-3 py-1.5 rounded-lg bg-white text-black font-mono-ledger text-xs font-bold hover:bg-white/90 active:scale-95 transition-transform"
          >
            Stake SOL
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center -space-x-2">
            {jurors.map((j, idx) => (
              <div
                key={j.id}
                title={`${j.staker} (${j.stakeAmount} SOL)`}
                className="w-8 h-8 rounded-full border-2 border-[#181b26] bg-gradient-to-tr from-[#8a42f5] to-[#00ec91] flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{ zIndex: jurors.length - idx }}
              >
                {j.staker.slice(0, 2)}
              </div>
            ))}
          </div>

          <span className="text-xs font-mono text-[#a0ffc3]">
            {jurors.reduce((acc, j) => acc + j.stakeAmount, 0).toFixed(1)} SOL Total Staked
          </span>
        </div>
      </div>
    </div>
  );
};
