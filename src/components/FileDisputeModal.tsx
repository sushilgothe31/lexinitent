import React, { useState } from 'react';
import { Docket, Agreement } from '../types';

interface FileDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDispute: (newDocket: Docket) => void;
  onCreateEscrow?: (newAgreement: Omit<Agreement, 'id' | 'createdAt' | 'disputeStartedAt' | 'commitCount' | 'revealCount' | 'votesClient' | 'votesFreelancer'>) => void;
  defaultMode?: 'escrow' | 'dispute';
}

export const FileDisputeModal: React.FC<FileDisputeModalProps> = ({
  isOpen,
  onClose,
  onSubmitDispute,
  onCreateEscrow,
  defaultMode = 'escrow',
}) => {
  const [modalMode, setModalMode] = useState<'escrow' | 'dispute'>(defaultMode);

  // Escrow creation state
  const [freelancerAddress, setFreelancerAddress] = useState('7xKXtg2CW87d97TXJDSpbWD5QkR92b7V...');
  const [escrowSol, setEscrowSol] = useState('5.0');
  const [escrowIntent, setEscrowIntent] = useState('Build complete fullstack Solana dApp frontend with wallet connect and escrow milestones.');

  // Dispute creation state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Docket['category']>('Smart Escrow');
  const [solAmount, setSolAmount] = useState('25.0');
  const [claimantHandle, setClaimantHandle] = useState('@claimant_sol');
  const [respondentHandle, setRespondentHandle] = useState('@contractor_dev');
  const [claimSynopsis, setClaimSynopsis] = useState('');
  const [commitHash, setCommitHash] = useState('0x7a4b91...c4e');

  if (!isOpen) return null;

  const solNum = parseFloat(solAmount) || 0;
  const bondRequired = (solNum * 0.1).toFixed(2);

  const handleEscrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escrowIntent.trim() || !onCreateEscrow) return;

    onCreateEscrow({
      client: 'DemoClient111111111111111111111111111111111',
      freelancer: freelancerAddress.trim(),
      amount: parseFloat(escrowSol) || 1.0,
      intentText: escrowIntent.trim(),
      state: 'Active',
    });
    onClose();
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDocket: Docket = {
      id: `#LX-${Math.floor(9100 + Math.random() * 800)}`,
      title: title.trim(),
      subtitle: title.trim(),
      category,
      solAmount: solNum,
      usdAmount: solNum * 150,
      timeRemaining: '24h 00m',
      status: 'Active Deliberation',
      exhibitName: `Exhibit A: Sworn Statement & Hash (${commitHash.slice(0, 8)})`,
      exhibitImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuByOpxKvDMLQqrI-uh06W8iCCDQDrwCUI2E7uV00OlwqIGznC0azvgVeIhES5iE7Mo-ixH0Nj5NQh48lkpXorS-yVSPnevtoM2DpvwlLMKtb53l150Gl1QqAT_jHbHCntQ6tQ-5OPrGf8jRxLU_ioLhU9B9V_J7CbEHQvNC8d2lheNo3NfMDvvsBi8bkBrYXAimXWrNMfeS6nAMnKUWIA3-v8nrJo7KL8AEL3n_j0YPYpd0LHqHhhRs',
      claimant: {
        username: claimantHandle.startsWith('@') ? claimantHandle : `@${claimantHandle}`,
        avatar:
          'https://lh3.googleusercontent.com/aida/AEtjO1XPVZjcnaiLpIPWbpYyB6skQhqFY0cAumbPa6XtcCSuA4ljt2HEy-4WkJL7F8FScr5lS51J2RvDD-ybU_DIZZKC5IU7AFVWmpiyQVO7HIkxdl5KvbbsrfZqoqqSJn2BW6lD20GXwsYydhevKJI7fxOW4lGHnXGP5nOqLLDYqSxbeVNEVCHnYniKCBS3IrZOWbjrvaMvCEhbcpyu234cWJuAKFJ_mCuvhuBNrOG_6g3MvmVChkUqwfZNdVI',
        role: 'Claimant',
        claimSynopsis: claimSynopsis || 'Withheld deliverable escrow funds.',
      },
      respondent: {
        username: respondentHandle.startsWith('@') ? respondentHandle : `@${respondentHandle}`,
        avatar:
          'https://lh3.googleusercontent.com/aida/AEtjO1XKDI5-vz5EKd1SPPqt5yJgeszS2HA4Ot0MSkrti_xc8499ahLTXE1khOkqcvK4mbZ6McVX_TSpIp0fv5PiyJH_2AhgI-fjhaZ-Dl2XqXsbYBeJ9zSa6unihbEwlcE3BEITneZLg_tYD5lBly5syCVXjcMJEAJjd2PNEOgUA-vdyig0lcr9hgplmqh2fFt3sJzmzAAn1xweh_fX93G4-a0803m6BrgiUPZXURRmb_8n1q1FcyEXcduqUQ',
        role: 'Respondent',
        claimSynopsis: 'Verified cryptographic deliverables submitted.',
      },
      evidenceSummary: claimSynopsis || 'Dispute regarding milestone completion criteria.',
      audioDeposition: {
        title: 'Initial Sworn Claim Deposition',
        speaker: claimantHandle,
        duration: '0:30',
      },
      stats: {
        gavels: 1,
        comments: 0,
        stakedSol: solNum + parseFloat(bondRequired),
        quorumReq: 100,
        quorumCurrent: 1,
        devVotesPercent: 50,
        clientVotesPercent: 50,
      },
    };

    onSubmitDispute(newDocket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">
                {modalMode === 'escrow' ? 'handshake' : 'gavel'}
              </span>
            </div>
            <div>
              <h2 className="font-serif-court text-base text-white font-semibold">
                {modalMode === 'escrow' ? 'Create Freelance Escrow' : 'File Dispute Docket'}
              </h2>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8] uppercase tracking-wider">
                Solana Anchor Program v2.4.1
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

        {/* Mode Selector Segmented Tabs */}
        <div className="flex p-1 rounded-xl bg-[#10131d] border border-white/10 text-xs font-mono-ledger">
          <button
            type="button"
            onClick={() => setModalMode('escrow')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              modalMode === 'escrow'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-[#cdc2d8] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">handshake</span>
            Freelance Escrow
          </button>
          <button
            type="button"
            onClick={() => setModalMode('dispute')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              modalMode === 'dispute'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-[#cdc2d8] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            Dispute Docket
          </button>
        </div>

        {/* MODE 1: Create Freelance Escrow */}
        {modalMode === 'escrow' && (
          <form onSubmit={handleEscrowSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="font-mono-ledger text-xs text-[#cdc2d8]">Freelancer Wallet Address</label>
              <input
                required
                value={freelancerAddress}
                onChange={(e) => setFreelancerAddress(e.target.value)}
                placeholder="e.g. 7xKXtg... (Solana wallet address)"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-mono focus:outline-none focus:border-white/30"
              />
              <p className="text-[10px] text-[#968da1]">
                Funds will be locked in a non-custodial PDA vault and released upon work acceptance.
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-mono-ledger text-xs text-[#cdc2d8]">Escrow Amount (SOL)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={escrowSol}
                  onChange={(e) => setEscrowSol(e.target.value)}
                  className="w-full px-3 py-2 pr-12 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-mono focus:outline-none"
                  placeholder="5.0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#a0ffc3] font-bold">
                  SOL
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono-ledger text-xs text-[#cdc2d8]">Contract Intent &amp; Milestones</label>
              <textarea
                required
                rows={3}
                value={escrowIntent}
                onChange={(e) => setEscrowIntent(e.target.value)}
                placeholder="Specify requirements, deliverables, revisions, and acceptance criteria..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-body-court focus:outline-none resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#1c1f2a] border border-white/5 text-[11px] text-[#cdc2d8] flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#a0ffc3] shrink-0 mt-0.5">lock</span>
              <p>
                Funds are held in a Solana Program-Derived Address. If disputed, staked jurors commit cryptographic ballots to decide release.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-mono-ledger text-xs font-semibold hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Lock SOL &amp; Initialize
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: File Dispute Docket */}
        {modalMode === 'dispute' && (
          <form onSubmit={handleDisputeSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="font-mono-ledger text-xs text-[#cdc2d8]">Docket Case Headline</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Milestone 4 API Delivery Withheld"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-body-court focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono-ledger text-xs text-[#cdc2d8]">Jurisdiction Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Docket['category'])}
                className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-mono-ledger focus:outline-none"
              >
                <option value="Smart Escrow">Smart Escrow (Milestones &amp; Bounty)</option>
                <option value="Protocol Security">Protocol Security (MEV, Oracles, Slippage)</option>
                <option value="IP & Code">IP &amp; Code (Licensure &amp; AI Agents)</option>
                <option value="DAO Governance">DAO Governance (Slashing Appeals)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-mono-ledger text-xs text-[#cdc2d8]">Disputed Amount (SOL)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-mono focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono-ledger text-xs text-[#cdc2d8]">Required Juror Bond</label>
                <div className="w-full px-3 py-2 rounded-lg bg-[#1c1f2a] text-[#a0ffc3] border border-white/5 text-xs font-mono flex items-center justify-between">
                  <span>{bondRequired} SOL</span>
                  <span className="text-[10px] text-[#cdc2d8]">(10%)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-mono-ledger text-xs text-[#cdc2d8]">Claimant Handle</label>
                <input
                  required
                  value={claimantHandle}
                  onChange={(e) => setClaimantHandle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-mono focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono-ledger text-xs text-[#cdc2d8]">Respondent Handle</label>
                <input
                  required
                  value={respondentHandle}
                  onChange={(e) => setRespondentHandle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono-ledger text-xs text-[#cdc2d8]">Sworn Evidentiary Synopsis</label>
              <textarea
                required
                rows={2}
                value={claimSynopsis}
                onChange={(e) => setClaimSynopsis(e.target.value)}
                placeholder="State clear factual grounds: commits pushed, contract addresses, and dates..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-body-court focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono-ledger text-xs text-[#cdc2d8]">Evidence Hash / Commit ID</label>
              <input
                value={commitHash}
                onChange={(e) => setCommitHash(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0b0e18] text-white border border-white/10 text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-mono-ledger text-xs font-semibold hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-transform flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                Anchor &amp; File Docket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

