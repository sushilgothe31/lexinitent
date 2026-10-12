import React, { useState } from 'react';
import { EmergencyStory, Precedent } from '../types';

/* 1. Memorandum Modal */
export const MemorandumModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#181b26] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d5baff]">gavel</span>
            <span className="font-serif-court text-base text-white font-semibold">
              Supreme Precedent #1108 Memorandum
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#cdc2d8] leading-relaxed font-body-court">
          <div className="p-3 rounded-xl bg-[#0b0e18] border border-white/5 space-y-1 font-mono text-[11px]">
            <div className="text-white font-bold">CASE: LexIntent Chamber vs. Sovereign Oracle Node #44</div>
            <div>VERDICT: Unanimous Enforcement (85.00 SOL Judicial Award)</div>
            <div>VALIDATOR CONFIRMATION: Slot #291,048,221 • State Root Verified</div>
          </div>

          <h4 className="font-serif-court text-sm text-white font-semibold pt-1">
            I. Judicial Finding of Fact
          </h4>
          <p>
            On Epoch 681, Claimant entered into an SLA Covenant containing an automated latency assertion guarantee. Between slots 291,040,000 and 291,048,000, Respondent experienced an unmitigated 2.8-second heartbeat drop across three independent validator telemetry points.
          </p>

          <h4 className="font-serif-court text-sm text-white font-semibold pt-1">
            II. Holding of the Chamber
          </h4>
          <p>
            Magistrate Elena Rostova presiding: "Where deterministic code creates an objective condition subsequent, parties cannot escape covenant terms through subjective excuses. The multi-sig bond must execute automatically according to the codified IDL parameters."
          </p>

          <h4 className="font-serif-court text-sm text-white font-semibold pt-1">
            III. Cryptographic Attestation
          </h4>
          <p className="font-mono text-[11px] text-[#a0ffc3] bg-[#1c1f2a] p-2.5 rounded-lg border border-white/5">
            SIG: 0x9b4f2c019a8e7d5b...44a90f1 <br />
            MERKLE ROOT: 0x4f8b91cc09...b22e1 <br />
            FINALITY: Confirmed across 1,940 Solana validator clusters.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold hover:bg-white/90 active:scale-95 transition-transform"
        >
          Close Attestation
        </button>
      </div>
    </div>
  );
};

/* 2. Live Courtroom Assembly Gallery Modal */
export const LiveGalleryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState([
    { sender: '@clerk_marcus', text: 'Senior Juror Cluster #4 is seated. Testimony begins.', time: '14:02' },
    { sender: '@juror_42', text: 'Reviewing ambiguity clause in Multi-token LP #9 IDL.', time: '14:03' },
    { sender: '@witness_core_dev', text: 'Log shows the rebalance trigger executed at slippage 1.2% within safety threshold.', time: '14:04' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: '@you (Audience)', text: inputMsg.trim(), time: 'Just now' },
    ]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <span className="font-serif-court text-base text-white font-semibold">
                Live Public Gallery: Cluster #4
              </span>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8] block">
                Docket #0x0E...418 • 182 Spectators
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

        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
          <img
            alt="Live Courtroom Stream"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN1ZAhjASAfIe-1dLXkLwFS_tCkxTIP52H9jYO6AAJ3R82X6CWn9cHeBjJ4f4j6rOa6hQIYz9kQPw35icQE8KnADS3xa5S52F-0EcIs-4S4SKB1697c6uFDSTaZ-2TrQbke0zvPv4AqSpKuJceQ7vEwVPL6ZIBgBYdI5eS8zWqkWfs4VQeOJhFdeYT8Pxgyj5cbsHjGUTikzKdcdXeHPRZOWcQp5oc5rRbVJmTpZ9qeVj2yqUNCiYH"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white font-mono text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE STREAM
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-[#10131d]/85 text-xs text-white font-mono-ledger">
            Chief Jurist Examination in Session
          </div>
        </div>

        {/* Live Testimony Transcript */}
        <div className="flex-1 overflow-y-auto space-y-2 p-2 rounded-xl bg-[#0b0e18] border border-white/5 text-xs font-body-court max-h-48">
          {messages.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono-ledger font-bold text-white text-[11px]">{m.sender}</span>
                <span className="text-[10px] text-[#968da1]">{m.time}</span>
              </div>
              <p className="text-[#cdc2d8] text-xs">{m.text}</p>
            </div>
          ))}
        </div>

        {/* Audience input */}
        <form onSubmit={handleSend} className="flex gap-2 pt-1">
          <input
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Submit spectator note or legal observation..."
            className="flex-1 px-3 py-2 rounded-lg bg-[#0b0e18] text-white text-xs border border-white/10 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-white text-black font-mono-ledger text-xs font-bold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

/* 3. Emergency Story Modal */
export const EmergencyStoryModal: React.FC<{
  story: EmergencyStory | null;
  onClose: () => void;
  onDeliberate: (docketId: string) => void;
}> = ({ story, onClose, onDeliberate }) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">{story.icon}</span>
            </div>
            <div>
              <span className="font-serif-court text-base text-white font-semibold">{story.title}</span>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8] block uppercase">
                {story.badge} • Pool {story.poolValue}
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

        <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
          {story.description}
        </p>

        <div className="p-3 rounded-xl bg-[#0b0e18] border border-white/5 text-xs font-mono space-y-1">
          <div className="text-white font-bold">DOCKET: {story.docketId}</div>
          <div className="text-[#a0ffc3]">DISPUTE VALUE: {story.poolValue}</div>
          <div className="text-[#cdc2d8]">STATUS: Fast-track deliberation required</div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-mono-ledger text-xs font-semibold"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onClose();
              onDeliberate(story.docketId);
            }}
            className="flex-1 py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider"
          >
            Deliberate Now
          </button>
        </div>
      </div>
    </div>
  );
};

/* 4. Exhibit Fullscreen Viewer Modal */
export const ExhibitViewerModal: React.FC<{
  isOpen: boolean;
  image: string;
  title: string;
  onClose: () => void;
}> = ({ isOpen, image, title, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#181b26] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#10131d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-[18px]">verified</span>
            <span className="font-mono-ledger text-xs text-white font-semibold">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="relative w-full aspect-[4/3] bg-black">
          <img src={image} alt={title} className="w-full h-full object-contain" />
        </div>

        <div className="p-4 bg-[#10131d] text-xs font-mono text-[#cdc2d8] flex items-center justify-between border-t border-white/10">
          <span>SHA-256: e4a8b79c...02aa11e8</span>
          <span className="text-[#a0ffc3]">IMMUTABLE IPFS PINNED</span>
        </div>
      </div>
    </div>
  );
};

/* 5. Dossier Certificate Export Modal */
export const CertificateExportModal: React.FC<{
  precedent: Precedent | null;
  onClose: () => void;
}> = ({ precedent, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);
  if (!precedent) return null;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white">verified</span>
            <span className="font-serif-court text-base text-white font-semibold">Case Dossier Certificate</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0e18] border border-white/10 space-y-2 text-xs font-mono">
          <div className="text-white font-bold text-sm">{precedent.id}</div>
          <div className="text-[#cdc2d8]">{precedent.title}</div>
          <div className="text-[#a0ffc3] pt-1">Verdict: {precedent.verdict}</div>
          <div className="text-[#cdc2d8]">Lead Jurist: {precedent.leadJurist.handle}</div>
          <div className="text-[10px] text-[#968da1] pt-1 border-t border-white/10">
            Solana Anchor State Account ID: 8xFj91...90bQ
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-3 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            {downloaded ? 'check_circle' : 'download'}
          </span>
          {downloaded ? 'Certificate Downloaded' : 'Download Signed PDF Dossier'}
        </button>
      </div>
    </div>
  );
};

/* 6. Sworn Legal Briefs & Amicus Curiae Modal */
export const SwornBriefsModal: React.FC<{
  isOpen: boolean;
  docketId: string;
  onClose: () => void;
}> = ({ isOpen, docketId, onClose }) => {
  const [briefs, setBriefs] = useState([
    {
      author: '@lead_systems_architect',
      role: 'Technical Witness',
      time: '1h ago',
      content: 'I verified the commit hash against the staging WebKit test pipeline. All 412 unit tests returned code 0 with cryptographic signature intact.',
      upvotes: 42,
    },
    {
      author: '@arbitrator_elena',
      role: 'Magistrate',
      time: '45m ago',
      content: 'Amicus note: off-chain sprint communication cannot override the Anchor escrow program IDL condition without multi-sig consent amendment.',
      upvotes: 89,
    },
    {
      author: '@solventures_legal',
      role: 'Claimant Counsel',
      time: '20m ago',
      content: 'We contend the webhook response was delivered 400ms outside the designated SLA benchmark, which falls under breach clause 3.1.',
      upvotes: 12,
    },
  ]);
  const [newBriefText, setNewBriefText] = useState('');

  if (!isOpen) return null;

  const handlePostBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBriefText.trim()) return;
    setBriefs([
      ...briefs,
      {
        author: '@you (Verified Juror)',
        role: 'Sworn Juror',
        time: 'Just now',
        content: newBriefText.trim(),
        upvotes: 1,
      },
    ]);
    setNewBriefText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white">mode_comment</span>
            <div>
              <span className="font-serif-court text-base text-white font-semibold block">
                Sworn Briefs &amp; Testimony
              </span>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8]">
                Docket {docketId} • 18 Depositions Filed
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

        {/* Briefs thread */}
        <div className="flex-1 overflow-y-auto space-y-3 p-1 max-h-72 no-scrollbar">
          {briefs.map((b, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#1c1f2a] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-ledger text-xs font-semibold text-white">{b.author}</span>
                  <span className="text-[10px] bg-[#272a35] text-[#cdc2d8] px-1.5 py-0.2 rounded border border-white/10">
                    {b.role}
                  </span>
                </div>
                <span className="text-[10px] text-[#968da1]">{b.time}</span>
              </div>
              <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">{b.content}</p>
              <div className="flex items-center gap-1 text-[11px] text-[#cdc2d8] pt-1">
                <span className="material-symbols-outlined text-[14px] text-white">thumb_up</span>
                <span className="font-mono">{b.upvotes}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Post Brief Form */}
        <form onSubmit={handlePostBrief} className="flex gap-2 pt-2 border-t border-white/10">
          <input
            value={newBriefText}
            onChange={(e) => setNewBriefText(e.target.value)}
            placeholder="File sworn amicus brief observation..."
            className="flex-1 px-3 py-2 rounded-lg bg-[#0b0e18] text-white text-xs border border-white/10 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-white text-black font-mono-ledger text-xs font-bold shrink-0"
          >
            File Brief
          </button>
        </form>
      </div>
    </div>
  );
};
