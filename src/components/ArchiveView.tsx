import React, { useState } from 'react';
import { Precedent } from '../types';

interface ArchiveViewProps {
  precedents: Precedent[];
  onOpenPrecedentDossier: (precedent: Precedent) => void;
  onExportCertificate: (precedent: Precedent) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  precedents,
  onOpenPrecedentDossier,
  onExportCertificate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [merkleInput, setMerkleInput] = useState('');
  const [merkleVerificationResult, setMerkleVerificationResult] = useState<{
    status: 'idle' | 'verifying' | 'valid' | 'invalid';
    leafHash?: string;
    slot?: number;
  }>({ status: 'idle' });

  const categories = [
    { id: 'all', label: 'All Settled (1,842)' },
    { id: 'Smart Escrow', label: 'Smart Escrow' },
    { id: 'IP & Code', label: 'IP & Code' },
    { id: 'DAO Governance', label: 'DAO Governance' },
    { id: 'Appeals Bench', label: 'Appeals Bench' },
  ];

  const featuredLandmark = precedents[0];

  const filteredDockets = precedents.slice(1).filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVerifyMerkle = () => {
    if (!merkleInput.trim()) return;
    setMerkleVerificationResult({ status: 'verifying' });
    setTimeout(() => {
      setMerkleVerificationResult({
        status: 'valid',
        leafHash: '0x7e8b91c...f44a902',
        slot: 289141000 + Math.floor(Math.random() * 4000),
      });
    }, 700);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Sub-Header / Repository Codex */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#181b26] border-b border-white/5 shadow-sm max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-white text-[18px]">history_edu</span>
          <div className="flex flex-col">
            <span className="font-mono-ledger text-[10px] uppercase tracking-widest text-[#cdc2d8] font-semibold">
              Repository Codex
            </span>
            <span className="font-serif-court text-xs leading-tight text-white truncate">
              Precedents &amp; Sealed Rulings
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            aria-label="Solana Network Health"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#272a35] text-white font-mono-ledger text-[11px] border border-white/10 active:scale-95 transition-transform"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>MAINNET-BETA</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col px-4 space-y-4 pt-4 max-w-lg mx-auto w-full">
        {/* Live Precedents Stat Banner */}
        <div className="flex flex-col p-4 rounded-xl bg-[#0b0e18] shadow-md relative overflow-hidden border border-white/10">
          <div className="absolute -right-6 -bottom-6 opacity-10 text-[#d5baff] pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">gavel</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-ledger text-xs text-white uppercase tracking-wider flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-white">verified</span> Cryptographic Jurisprudence
            </span>
            <span className="font-mono-ledger text-[10px] text-white bg-[#1c1f2a] px-2 py-0.5 rounded-full border border-white/10">
              v4.11 Merkle Root
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#181b26] border border-white/5">
              <span className="font-mono-ledger text-sm font-bold text-white">1,842</span>
              <span className="font-mono-ledger text-[10px] uppercase text-[#cdc2d8]">Precedents</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#181b26] border border-white/5">
              <span className="font-mono-ledger text-sm font-bold text-white">99.4%</span>
              <span className="font-mono-ledger text-[10px] uppercase text-[#cdc2d8]">Enforced</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#181b26] border border-white/5">
              <span className="font-mono-ledger text-sm font-bold text-white">1.4s</span>
              <span className="font-mono-ledger text-[10px] uppercase text-[#cdc2d8]">Finality</span>
            </div>
          </div>
        </div>

        {/* Search Input & Filter Bar */}
        <div className="flex flex-col space-y-2">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3 text-[#968da1] text-[18px]">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#181b26] text-white placeholder:text-[#968da1] text-xs font-body-court focus:outline-none focus:bg-[#272a35] border border-white/5 transition-colors"
              placeholder="Search dockets, statutes, Merkle leaf, hash..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#968da1] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-nowrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`filter-pill px-3 py-1.5 rounded-full font-mono-ledger text-xs transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'bg-[#181b26] text-[#cdc2d8] hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-serif-court text-base text-white font-semibold">Landmark Ruling</span>
            <span className="px-2 py-0.5 rounded-full bg-[#323440] text-white font-mono-ledger text-[10px] font-bold uppercase border border-white/10">
              Supreme Precedent
            </span>
          </div>
          <button
            onClick={() => onOpenPrecedentDossier(featuredLandmark)}
            className="font-mono-ledger text-xs text-white flex items-center hover:underline"
          >
            All Digests <span className="material-symbols-outlined text-[15px]">chevron_right</span>
          </button>
        </div>

        {/* Featured Landmark Dossier (Card) */}
        {featuredLandmark && (
          <div className="flex flex-col rounded-xl bg-[#181b26] shadow-xl overflow-hidden group border border-white/10">
            {/* Media Header */}
            <div className="relative w-full h-44 overflow-hidden bg-[#272a35]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                alt="Antique leatherbound law books on judicial bench"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjv9vFnCKRJn8jk7PAF-FWQRw7kssTxzfBet3ITRdMkEDJWQ_0-laayi9-N2W-TLYLj04GgQdD7qDrTXCcmCPWrxAaZl2S0eA7ufSgpivOzJTIWABP0mvhIqwP8aWG2i343eo9T_oCQVwueo72LvBD4WGA5d4dKn2RPYoPjuuQUZStQllUeAnKDn3W_YM-Qc3RemwEZ_hvIAG3oEAdzQKPFD1gYyeGPCM3YyXzk7QcBN1j8nAlumcD"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181b26] via-[#181b26]/60 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b0e18]/85 backdrop-blur-md shadow-sm border border-white/10">
                <span className="material-symbols-outlined text-[13px] text-white">menu_book</span>
                <span className="font-mono-ledger text-[11px] text-white tracking-wider font-semibold">
                  {featuredLandmark.id}
                </span>
              </div>

              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white text-black font-mono-ledger text-[10px] font-bold tracking-widest uppercase shadow-sm">
                FINAL JUDGMENT
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="font-mono-ledger text-xs text-white tracking-wide bg-[#0b0e18]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                  {featuredLandmark.dossierVolume || 'LexIntent Case Rep. Vol. 14 § 2'}
                </span>
                <span className="font-mono-ledger text-[11px] text-white flex items-center gap-1 bg-[#0b0e18]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                  <span className="material-symbols-outlined text-[12px] text-white">bolt</span> Solana Confirmed
                </span>
              </div>
            </div>

            {/* Landmark Body */}
            <div className="flex flex-col p-4 space-y-3">
              <h2 className="font-serif-court text-base text-white font-semibold leading-snug">
                {featuredLandmark.title}
              </h2>
              <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
                {featuredLandmark.summary}
              </p>

              {/* Ruling Outcome Badge Bar */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1c1f2a] border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-[20px]">how_to_reg</span>
                  <div className="flex flex-col">
                    <span className="font-mono-ledger text-[10px] text-[#cdc2d8] uppercase">Bench Verdict</span>
                    <span className="font-mono-ledger text-xs text-white font-bold">{featuredLandmark.verdict}</span>
                  </div>
                </div>
                <span className="font-mono-ledger text-xs text-white font-bold">
                  {featuredLandmark.solSettled} SOL Settled
                </span>
              </div>

              {/* Arbitrator Panel Signatures */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      alt={featuredLandmark.leadJurist.name}
                      className="w-8 h-8 rounded-full object-cover"
                      src={featuredLandmark.leadJurist.avatar}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00ec91] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[8px] text-[#00391f] font-bold">check</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono-ledger text-xs text-white font-semibold leading-tight">
                      {featuredLandmark.leadJurist.handle}
                    </span>
                    <span className="font-mono-ledger text-[10px] text-[#968da1]">
                      Lead Jurist • Sig: {featuredLandmark.leadJurist.sig}
                    </span>
                  </div>
                </div>

                {/* Other Verified Jurors Stack */}
                <div className="flex items-center -space-x-2">
                  <div
                    className="w-7 h-7 rounded-full bg-[#323440] flex items-center justify-center text-[10px] font-bold text-[#d5baff] shadow-sm border border-[#181b26]"
                    title="Jurist Marcus V."
                  >
                    MV
                  </div>
                  <div
                    className="w-7 h-7 rounded-full bg-[#8a42f5] flex items-center justify-center text-[10px] font-bold text-[#faf0ff] shadow-sm border border-[#181b26]"
                    title="Jurist C. Alvarez"
                  >
                    CA
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#1c1f2a] text-[#cdc2d8] flex items-center justify-center text-[10px] font-semibold border border-[#181b26]">
                    +2
                  </div>
                </div>
              </div>

              {/* Action Export Landmark */}
              <div className="pt-2">
                <button
                  onClick={() => onExportCertificate(featuredLandmark)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white text-black font-mono-ledger text-xs font-bold active:scale-98 transition-transform shadow-md border border-white"
                >
                  <span className="material-symbols-outlined text-[18px] text-black">download_for_offline</span>
                  <span>Export Case Dossier (PDF &amp; Merkle Proof)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settled Dockets Feed Section */}
        <div className="flex flex-col space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif-court text-base text-white font-semibold">Settled Dockets</span>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
            <span className="font-mono-ledger text-[11px] text-[#968da1]">Real-Time Ledger</span>
          </div>

          {filteredDockets.map((docket) => (
            <article
              key={docket.id}
              onClick={() => onOpenPrecedentDossier(docket)}
              className="flex flex-col p-4 rounded-xl bg-[#181b26] shadow-sm space-y-2.5 active:bg-[#272a35] hover:border-white/20 transition-all border border-white/5 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono-ledger text-xs text-white font-semibold">{docket.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#272a35] text-white font-mono-ledger text-[10px] uppercase font-bold border border-white/10">
                      {docket.category}
                    </span>
                    <span className="font-mono-ledger text-[10px] text-[#968da1]">{docket.settledTime}</span>
                  </div>
                  <h3 className="font-serif-court text-sm font-semibold text-white mt-1 leading-snug group-hover:text-[#d5baff] transition-colors">
                    {docket.title}
                  </h3>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`font-mono-ledger text-xs font-bold ${
                      docket.verdictType === 'dismissed' ? 'text-[#ffb4ab]' : 'text-white'
                    }`}
                  >
                    {docket.verdict}
                  </span>
                  <span className="font-mono-ledger text-[10px] text-[#cdc2d8]">
                    {docket.verdictType === 'dismissed' ? 'With Prejudice' : 'Settled Award'}
                  </span>
                </div>
              </div>

              <p className="font-body-court text-xs text-[#cdc2d8] line-clamp-2 leading-relaxed">
                {docket.summary}
              </p>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-white">
                  <span className="material-symbols-outlined text-[15px] text-white">lock</span>
                  <span className="font-mono-ledger text-[11px]">Anchored on Solana block {docket.solanaBlock}</span>
                </div>
                <span className="flex items-center gap-0.5 text-white group-hover:underline font-mono-ledger text-xs font-medium">
                  <span>Dossier</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Quick Archival Proof Verification Widget */}
        <div className="p-4 rounded-xl bg-[#1c1f2a] space-y-2 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-[20px]">qr_code_scanner</span>
            <span className="font-serif-court text-sm font-semibold text-white">
              Verify External Merkle Inclusion
            </span>
          </div>
          <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
            Paste any Solana transaction signature to verify tamper-proof LexIntent verdict inclusion against current on-chain state root.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              value={merkleInput}
              onChange={(e) => setMerkleInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[#0b0e18] text-white text-xs font-mono placeholder:text-[#968da1] border border-white/10 focus:outline-none focus:border-white/30"
              placeholder="Solana Tx Sig (e.g. 5xKu82...)"
              type="text"
            />
            <button
              onClick={handleVerifyMerkle}
              className="px-4 py-2 rounded-lg bg-white hover:bg-white/90 text-black font-mono-ledger text-xs font-bold active:scale-95 transition-all"
            >
              Verify
            </button>
          </div>

          {merkleVerificationResult.status === 'verifying' && (
            <div className="text-xs text-white font-mono-ledger flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-white animate-spin"></span>
              Computing cryptographic leaf proof against Solana state root...
            </div>
          )}

          {merkleVerificationResult.status === 'valid' && (
            <div className="p-2.5 rounded-lg bg-[#00ec91]/10 border border-[#00ec91]/30 text-xs font-mono text-[#a0ffc3] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                VERIFIED: Merkle Leaf Inclusion Validated
              </div>
              <div className="text-[11px] text-[#cdc2d8]">
                Slot: #{merkleVerificationResult.slot} • Root: 0x9f1a4...c89 • Proof depth: 12
              </div>
            </div>
          )}
        </div>

        {/* Bottom Proof Seal Footnote */}
        <div className="flex flex-col items-center justify-center py-4 text-center space-y-1 opacity-75">
          <div className="flex items-center gap-1 text-white">
            <span className="material-symbols-outlined text-[16px] text-white">balance</span>
            <span className="font-mono-ledger text-[11px] tracking-widest uppercase font-bold text-white">
              LEXINTENT COURT RECORD IMMUTABLE
            </span>
          </div>
          <p className="font-body-court text-[11px] text-[#968da1]">
            All judgments cryptographically hashed and permanently written into Solana State accounts.
          </p>
        </div>
      </div>
    </div>
  );
};
