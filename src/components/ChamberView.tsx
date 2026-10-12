import React, { useState } from 'react';
import { JurorLeaderboard } from './JurorLeaderboard';

interface ChamberViewProps {
  onOpenBylaws: () => void;
  onOpenAnchorRules: () => void;
  onOpenAppealsElection: () => void;
  onOpenPeerChat: () => void;
}

export const ChamberView: React.FC<ChamberViewProps> = ({
  onOpenBylaws,
  onOpenAnchorRules,
  onOpenAppealsElection,
  onOpenPeerChat,
}) => {
  const [stakedBalance, setStakedBalance] = useState<number>(150.0);
  const [unclaimedFees, setUnclaimedFees] = useState<number>(18.4);
  const [stakeModal, setStakeModal] = useState<{ open: boolean; type: 'stake' | 'claim' | 'unstake' }>({
    open: false,
    type: 'stake',
  });
  const [stakeAmountInput, setStakeAmountInput] = useState<string>('10');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmVaultAction = () => {
    if (stakeModal.type === 'stake') {
      const amt = parseFloat(stakeAmountInput) || 0;
      if (amt > 0) {
        setStakedBalance((prev) => prev + amt);
        showToast(`Successfully deposited +${amt} SOL to Judicial Staking Vault!`);
      }
    } else if (stakeModal.type === 'claim') {
      if (unclaimedFees > 0) {
        const claimed = unclaimedFees;
        setUnclaimedFees(0);
        showToast(`Successfully claimed +${claimed.toFixed(1)} SOL in jury yields to wallet!`);
      }
    } else if (stakeModal.type === 'unstake') {
      const amt = parseFloat(stakeAmountInput) || 0;
      if (amt > 0 && amt <= stakedBalance) {
        setStakedBalance((prev) => prev - amt);
        showToast(`Initiated unstake for ${amt} SOL (cooling off period: 1 epoch).`);
      }
    }
    setStakeModal({ open: false, type: 'stake' });
  };

  return (
    <div className="flex flex-col w-full px-4 space-y-4 max-w-lg mx-auto pb-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1c1f2a] border border-[#a0ffc3]/40 text-[#a0ffc3] text-xs font-mono-ledger flex items-center gap-2 shadow-2xl">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          {toastMessage}
        </div>
      )}

      {/* Sub-Header / Chamber Status Ribbon */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-white shadow-sm animate-pulse" />
          <span className="font-mono-ledger text-xs text-white tracking-widest uppercase font-semibold">
            EPOCH 682 • SOLANA MAINNET
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenBylaws}
            aria-label="Chamber Settings"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#272a35] hover:bg-[#323440] text-[#cdc2d8] hover:text-white transition-colors active:scale-95 border border-white/5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </div>

      {/* Juror Guild Profile Header Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#181b26] shadow-xl p-4 border border-white/10">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-white/30 via-white/10 to-transparent shadow-lg">
                <img
                  className="w-full h-full rounded-full object-cover"
                  alt="Hon. Elena Vance"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZkc-KHVFo4C0LrYmKVIbx0AIcMFOQ8x5feIPQkySPCu10sYkhiuUwJIcDaY63bWjyWSUTCif_N5Hd3uYlPqLBEwpr_VvClqIlcPAscNziBA3NXYV-mXHi7xAjlMGc0AeWi8hFLZgoVYEXK7MPiOQBvHjd9Et_136ytA9IjcS91FAXHDFiSLJAB460idIVQHCke_zr9ccfW0Qr7ZMxV1UIjJ_Tp49OqZYn_prg3kYSfJ7OPj7KhLgF"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-[#0b0e18] text-white shadow-md border border-white/10">
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-serif-court text-lg text-white font-semibold truncate">
                  Hon. Elena Vance
                </h1>
                <span className="font-mono-ledger text-xs text-[#cdc2d8] tracking-tight">
                  @magistrate_elena
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#323440] text-white font-mono-ledger text-[11px] border border-white/10">
                  <span
                    className="material-symbols-outlined text-[14px] text-white"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stars
                  </span>
                  <span className="uppercase tracking-wider font-semibold">Tier 1 High Magistrate</span>
                </div>
                {/* Platinum Arbiter Insignia */}
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/50 text-cyan-300 font-mono-ledger text-[11px] font-semibold shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                  title="Platinum Arbiter: 98.6% Arbitration Success Rate (420/426 Cases Won)"
                >
                  <span className="material-symbols-outlined text-[13px]">diamond</span>
                  <span>Platinum Arbiter</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 text-[#cdc2d8] font-mono-ledger text-xs">
                <span className="text-white flex items-center gap-0.5 font-medium">
                  <span className="material-symbols-outlined text-[14px] text-white">verified_user</span> 98.7% Consensus
                </span>
                <span className="text-[#4b4455]">•</span>
                <span className="text-[#cdc2d8]">420 Judgments</span>
              </div>
            </div>
          </div>

          {/* Judicial Integrity Index Meter */}
          <div className="w-full bg-[#1c1f2a] rounded-xl p-3 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-white">shield</span>
              <div className="flex flex-col">
                <span className="font-mono-ledger text-xs text-white uppercase tracking-wider font-semibold">
                  Judicial Integrity Index
                </span>
                <span className="font-body-court text-xs text-[#cdc2d8]">Rank #4 of 1,420 Active Jurists</span>
              </div>
            </div>
            <span className="font-mono-ledger text-sm text-white font-bold">998 / 1000</span>
          </div>
        </div>
      </div>

      {/* Juror Staking & Yield Vault Card */}
      <div className="rounded-xl bg-[#181b26] shadow-xl p-4 space-y-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#323440] flex items-center justify-center text-white border border-white/10">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8] uppercase tracking-widest block">
                STAKING VAULT
              </span>
              <p className="font-serif-court text-base text-white font-semibold">Active Judicial Bond</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#323440] text-white font-mono-ledger text-[11px] uppercase tracking-wider font-semibold border border-white/10">
            ANCHOR V2.4
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1c1f2a] rounded-xl p-3 border border-white/5">
            <span className="font-mono-ledger text-xs text-[#cdc2d8] block uppercase">Staked Balance</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-serif-court text-xl text-white font-semibold">
                {stakedBalance.toFixed(1)}
              </span>
              <span className="font-mono-ledger text-xs text-white/80">SOL</span>
            </div>
            <span className="font-body-court text-xs text-[#cdc2d8]">
              ≈ ${(stakedBalance * 150).toLocaleString()}.00
            </span>
          </div>

          <div className="bg-[#1c1f2a] rounded-xl p-3 border border-white/5">
            <span className="font-mono-ledger text-xs text-[#cdc2d8] block uppercase">Weekly Jury Fees</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-serif-court text-xl text-white font-semibold">
                +{unclaimedFees.toFixed(1)}
              </span>
              <span className="font-mono-ledger text-xs text-white/80">SOL</span>
            </div>
            <span className="font-mono-ledger text-xs text-[#a0ffc3]">APY 14.2% Boosted</span>
          </div>
        </div>

        {/* 7-Day Yield Velocity Sparkline */}
        <div className="bg-[#1c1f2a] rounded-xl p-3 flex items-center justify-between border border-white/5">
          <div className="flex flex-col">
            <span className="font-mono-ledger text-xs text-[#cdc2d8] uppercase">7-Day Yield Velocity</span>
            <span className="font-body-court text-xs text-white font-medium">Optimal Slashing Immunity</span>
          </div>
          <svg className="w-28 h-7 text-white" fill="none" preserveAspectRatio="none" viewBox="0 0 112 28">
            <path
              d="M2 24 L18 20 L36 22 L54 14 L72 17 L90 8 L110 3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
            <path
              d="M2 24 L18 20 L36 22 L54 14 L72 17 L90 8 L110 3 V28 H2 Z"
              fill="currentColor"
              fillOpacity="0.15"
            />
          </svg>
        </div>

        {/* Staking Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => setStakeModal({ open: true, type: 'stake' })}
            className="h-12 rounded-full bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all"
            type="button"
          >
            <span
              className="material-symbols-outlined text-[18px] text-black"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add_circle
            </span>
            <span>Stake</span>
          </button>

          <button
            onClick={() => setStakeModal({ open: true, type: 'claim' })}
            className="h-12 rounded-full bg-[#272a35] hover:bg-[#323440] text-white font-mono-ledger text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-white">savings</span>
            <span>Claim</span>
          </button>

          <button
            onClick={() => setStakeModal({ open: true, type: 'unstake' })}
            className="h-12 rounded-full bg-[#272a35] hover:bg-[#323440] text-[#cdc2d8] hover:text-white font-mono-ledger text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">lock_open</span>
            <span>Unstake</span>
          </button>
        </div>
      </div>

      {/* Deliberation Chambers (Active Guilds) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[18px]">gavel</span>
            <h2 className="font-serif-court text-base text-white font-semibold">Deliberation Chambers</h2>
          </div>
          <span className="font-mono-ledger text-xs text-[#cdc2d8] uppercase">3 Enrolled</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Guild 1 */}
          <div
            onClick={() => showToast('Active Guild: Solana Smart Escrow Court • Quorum: 94 Jurors')}
            className="p-4 rounded-xl bg-[#181b26] hover:bg-[#1c1f2a] transition-colors shadow-md flex flex-col gap-2 cursor-pointer active:scale-[0.99] border border-white/5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#272a35] flex items-center justify-center text-white border border-white/10">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
                <div>
                  <p className="font-mono-ledger text-sm text-white font-semibold">Solana Smart Escrow Court</p>
                  <span className="font-mono-ledger text-xs text-[#cdc2d8]">Primary Jurisprudence</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#323440] text-white font-mono-ledger text-[11px] uppercase tracking-wider font-semibold border border-white/10">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[#cdc2d8] font-body-court text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-white">
                  <span className="material-symbols-outlined text-[15px] text-white">balance</span> 12 active trials
                </span>
                <span className="flex items-center gap-1 text-[#cdc2d8]">
                  <span className="material-symbols-outlined text-[15px] text-white">group</span> 94 jurists online
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#cdc2d8]">chevron_right</span>
            </div>
          </div>

          {/* Guild 2 */}
          <div
            onClick={() => showToast('Active Guild: DeFi & Protocol Security • Auditing 4 Trials')}
            className="p-4 rounded-xl bg-[#181b26] hover:bg-[#1c1f2a] transition-colors shadow-md flex flex-col gap-2 cursor-pointer active:scale-[0.99] border border-white/5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#272a35] flex items-center justify-center text-white border border-white/10">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                </div>
                <div>
                  <p className="font-mono-ledger text-sm text-white font-semibold">DeFi &amp; Protocol Security Guild</p>
                  <span className="font-mono-ledger text-xs text-[#cdc2d8]">Oracle &amp; Flash-Loan Claims</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#272a35] text-[#cdc2d8] font-mono-ledger text-[11px] uppercase tracking-wider font-medium border border-white/10">
                Auditing
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[#cdc2d8] font-body-court text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-white">
                  <span className="material-symbols-outlined text-[15px] text-white">balance</span> 4 active trials
                </span>
                <span className="flex items-center gap-1 text-[#cdc2d8]">
                  <span className="material-symbols-outlined text-[15px] text-white">group</span> 51 jurists online
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#cdc2d8]">chevron_right</span>
            </div>
          </div>

          {/* Guild 3 */}
          <div
            onClick={() => showToast('Active Guild: IP, Royalties & Code Covenant • Deliberating 6 Trials')}
            className="p-4 rounded-xl bg-[#181b26] hover:bg-[#1c1f2a] transition-colors shadow-md flex flex-col gap-2 cursor-pointer active:scale-[0.99] border border-white/5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#272a35] flex items-center justify-center text-white border border-white/10">
                  <span className="material-symbols-outlined text-[18px]">copyright</span>
                </div>
                <div>
                  <p className="font-mono-ledger text-sm text-white font-semibold">IP, Royalties &amp; Code Covenant</p>
                  <span className="font-mono-ledger text-xs text-[#cdc2d8]">Autonomous Agent Licensure</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#272a35] text-[#cdc2d8] font-mono-ledger text-[11px] uppercase tracking-wider font-medium border border-white/10">
                Deliberating
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[#cdc2d8] font-body-court text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-white">
                  <span className="material-symbols-outlined text-[15px] text-white">balance</span> 6 active trials
                </span>
                <span className="flex items-center gap-1 text-[#cdc2d8]">
                  <span className="material-symbols-outlined text-[15px] text-white">group</span> 38 jurists online
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#cdc2d8]">chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      {/* Juror Guild Leaderboard Section */}
      <JurorLeaderboard onOpenPeerChat={onOpenPeerChat} />

      {/* Peer High Arbitrator Colleague Showcase */}
      <div className="p-4 rounded-xl bg-[#181b26] space-y-2 border border-white/10">
        <span className="font-mono-ledger text-xs text-[#cdc2d8] uppercase tracking-wider">
          Sitting Co-Magistrate on Active Docket № 0x88F
        </span>
        <div className="flex items-center gap-4 pt-1">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-md border border-white/10">
            <img
              className="w-full h-full object-cover"
              alt="Amara Sharma"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrM4uyLWiBYlg2O6IHNFtKgNw68qfXOaFu_maHxu7Ap9K5SQZ5BpiGuj4-q9WCbT89wQesMjTOTTz95pYdx9vu_qXhXfDWwOWWchT4nxguMysMZuL2iv8yBzCdyUBYk1PHY1P97zCC6SMxrsOiQBuOtcDvhiBw1uO_NrNFs1PlksJD-AQiqR8vQmPx1aW-0tmiEh_eTmltEnQfOD4wic5H1ImWOFYGC-Jh321hL9pLaInvFL5AlLTU"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono-ledger text-sm text-white font-semibold truncate">Amara Sharma</span>
              <span className="font-mono-ledger text-xs text-white/70">Consensus Peer</span>
            </div>
            <p className="font-body-court text-xs text-[#cdc2d8] truncate">
              Lead Arbiter • Multi-Sig Escrow Breach Case
            </p>
          </div>
          <button
            onClick={onOpenPeerChat}
            aria-label="Message Co-Magistrate"
            className="w-10 h-10 rounded-full bg-[#272a35] flex items-center justify-center text-white hover:bg-[#323440] transition-colors border border-white/10"
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
          </button>
        </div>
      </div>

      {/* Judicial Standing & Accolade Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-serif-court text-base text-white font-semibold">Judicial Standing</h2>
          <span className="font-mono-ledger text-xs text-white/70 uppercase">All Honors Verified</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-[#1c1f2a] flex flex-col items-center text-center space-y-1 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-[#323440] text-white flex items-center justify-center border border-white/10">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
            </div>
            <span className="font-mono-ledger text-xs text-white font-semibold">Unanimous Streak</span>
            <span className="font-mono-ledger text-[11px] text-white/70">18 Cases</span>
          </div>

          <div className="p-3 rounded-xl bg-[#1c1f2a] flex flex-col items-center text-center space-y-1 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-[#323440] text-white flex items-center justify-center border border-white/10">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
            <span className="font-mono-ledger text-xs text-white font-semibold">Speedy Juror</span>
            <span className="font-mono-ledger text-[11px] text-white/70">&lt;5m Avg Verdict</span>
          </div>

          <div className="p-3 rounded-xl bg-[#1c1f2a] flex flex-col items-center text-center space-y-1 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-[#323440] text-white flex items-center justify-center border border-white/10">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <span className="font-mono-ledger text-xs text-white font-semibold">Zero Slash</span>
            <span className="font-mono-ledger text-[11px] text-[#cdc2d8]">Flawless Stake</span>
          </div>
        </div>
      </div>

      {/* Chamber Quick Links & Governance */}
      <div className="rounded-xl bg-[#181b26] overflow-hidden shadow-md border border-white/10">
        <button
          onClick={onOpenBylaws}
          className="w-full flex items-center justify-between p-4 hover:bg-[#1c1f2a] transition-colors text-left border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-[#edbf70]">menu_book</span>
            <div>
              <span className="font-mono-ledger text-xs text-white block font-semibold">Chamber Bylaws &amp; Oath</span>
              <span className="font-body-court text-xs text-[#cdc2d8]">Juror Code of Ethical Impartiality</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#cdc2d8]">open_in_new</span>
        </button>

        <button
          onClick={onOpenAnchorRules}
          className="w-full flex items-center justify-between p-4 hover:bg-[#1c1f2a] transition-colors text-left border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-[#a0ffc3]">terminal</span>
            <div>
              <span className="font-mono-ledger text-xs text-white block font-semibold">
                Solana Anchor Contract Rules
              </span>
              <span className="font-body-court text-xs text-[#cdc2d8]">Dispute Escrow Program v2.4.1 IDL</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#cdc2d8]">open_in_new</span>
        </button>

        <button
          onClick={onOpenAppealsElection}
          className="w-full flex items-center justify-between p-4 hover:bg-[#1c1f2a] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-[#d5baff]">how_to_vote</span>
            <div>
              <span className="font-mono-ledger text-xs text-white block font-semibold">
                Appeals Council Election
              </span>
              <span className="font-body-court text-xs text-[#cdc2d8]">
                Voting concludes in 3d 14h • 1,200 votes cast
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#d5baff]">chevron_right</span>
        </button>
      </div>

      {/* Canonical Epilogue Sign-off */}
      <div className="py-2 text-center">
        <p className="font-mono-ledger text-xs uppercase tracking-widest text-[#968da1] font-bold">
          “CODE ENFORCES. HUMANS JUDGE.”
        </p>
      </div>

      {/* Staking / Vault Modal */}
      {stakeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#1c1f2a] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-serif-court text-base text-white font-semibold">
                {stakeModal.type === 'stake'
                  ? 'Deposit to Judicial Bond'
                  : stakeModal.type === 'claim'
                  ? 'Claim Judicial Yields'
                  : 'Unstake Bond'}
              </span>
              <button
                onClick={() => setStakeModal({ open: false, type: 'stake' })}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {stakeModal.type === 'claim' ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#181b26] border border-white/5 text-center">
                  <span className="text-xs text-[#cdc2d8] block">Available to Claim</span>
                  <span className="font-serif-court text-2xl text-white font-bold">
                    +{unclaimedFees.toFixed(1)} SOL
                  </span>
                  <span className="text-[11px] text-[#a0ffc3] block mt-1">
                    Accrued from 14 finished deliberations
                  </span>
                </div>
                <p className="text-xs text-[#cdc2d8] text-center">
                  Transfers directly to your connected Solana wallet address.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono-ledger text-[#cdc2d8]">Amount in SOL</label>
                  <input
                    type="number"
                    value={stakeAmountInput}
                    onChange={(e) => setStakeAmountInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 font-mono text-sm focus:outline-none focus:border-white/30"
                    placeholder="e.g. 10"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#cdc2d8]">
                  <span>Current Bond: {stakedBalance.toFixed(1)} SOL</span>
                  <span>Slash Guarantee: 10%</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStakeModal({ open: false, type: 'stake' })}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-mono-ledger text-xs font-semibold hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVaultAction}
                className="flex-1 py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold hover:bg-white/90 active:scale-95 transition-transform"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
