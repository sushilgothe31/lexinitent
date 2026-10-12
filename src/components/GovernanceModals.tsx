import React, { useState } from 'react';

export const NotificationsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Quorum Reached on Docket #LX-9014',
      time: '12m ago',
      desc: '200 sovereign jurors cast ballots. Automated escrow release triggered on Solana mainnet.',
      icon: 'balance',
      read: false,
    },
    {
      id: 2,
      title: 'Weekly Jury Yield Distributed',
      time: '2h ago',
      desc: '+18.4 SOL credited to your Judicial Staking Vault (APY 14.2%).',
      icon: 'savings',
      read: false,
    },
    {
      id: 3,
      title: 'Supreme Precedent #1108 Enacted',
      time: '5h ago',
      desc: 'Lead Jurist @magistrate_elena sealed SLA breach ruling into repository codex.',
      icon: 'verified',
      read: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white">notifications</span>
            <span className="font-serif-court text-base text-white font-semibold">Chamber Notifications</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border flex items-start gap-3 ${
                n.read
                  ? 'bg-[#181b26] border-white/5 opacity-70'
                  : 'bg-[#1c1f2a] border-white/10'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#272a35] flex items-center justify-center text-white shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono-ledger text-xs text-white font-semibold truncate">{n.title}</span>
                  <span className="text-[10px] text-[#968da1]">{n.time}</span>
                </div>
                <p className="font-body-court text-xs text-[#cdc2d8] mt-0.5 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider"
        >
          Mark All As Read
        </button>
      </div>
    </div>
  );
};

export const BylawsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#edbf70]">menu_book</span>
            <span className="font-serif-court text-base text-white font-semibold">Chamber Bylaws &amp; Oath</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#cdc2d8] leading-relaxed font-body-court">
          <h4 className="font-serif-court text-sm text-white font-semibold">Juror Oath of Impartiality</h4>
          <p className="italic bg-[#0b0e18] p-3 rounded-lg border border-white/5 text-white">
            "I swear upon the cryptographic ledger to rule without bias or fear, upholding deterministic covenants above arbitrary rhetoric. Where code specifies intent, I shall enforce it. Where ambiguity arises, I shall weigh sworn facts."
          </p>

          <h4 className="font-serif-court text-sm text-white font-semibold pt-1">Slashing Protocol (§ 4.2)</h4>
          <p>
            Jurors whose votes deviate radically from verified cryptographic proof-of-delivery or who exhibit malicious collusion are subject to a 10% stake forfeiture, redistributed to honest quorum participants.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider"
        >
          I Affirm My Oath
        </button>
      </div>
    </div>
  );
};

export const AnchorRulesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a0ffc3]">code_blocks</span>
            <span className="font-serif-court text-base text-white font-semibold">Anchor Contract IDL v2.4.1</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-2 text-xs font-mono text-[#cdc2d8]">
          <div className="p-3 rounded-lg bg-[#0b0e18] border border-white/10 overflow-x-auto text-[11px] leading-relaxed">
            <span className="text-white font-bold">// Program ID:</span> LexIntent1111111111111111111111111111111111<br />
            <span className="text-white font-bold">pub fn</span> rule_dispute(ctx: Context&lt;RuleDispute&gt;, vote: Verdict) -&gt; Result&lt;()&gt; &#123;<br />
            &nbsp;&nbsp;require!(ctx.accounts.juror_stake.amount &gt;= MIN_BOND, ErrorCode::InsufficientBond);<br />
            &nbsp;&nbsp;record_ballot_leaf(&amp;ctx.accounts.merkle_tree, vote)?;<br />
            &nbsp;&nbsp;Ok(())<br />
            &#125;
          </div>
          <p className="text-[11px] text-[#cdc2d8] leading-relaxed">
            All escrow transfers are non-custodial Program Derived Addresses (PDAs) with multi-sig release guarantees.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider"
        >
          Close IDL
        </button>
      </div>
    </div>
  );
};

export const AppealsElectionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [votedCandidate, setVotedCandidate] = useState<string | null>(null);

  if (!isOpen) return null;

  const candidates = [
    { id: '1', name: 'Hon. Elena Vance', handle: '@magistrate_elena', votes: 682, rank: 'Tier 1 Magistrate' },
    { id: '2', name: 'Barrister Marcus Vance', handle: '@marcus_v', votes: 410, rank: 'Senior Arbiter' },
    { id: '3', name: 'Dr. Amara Sharma', handle: '@amara_sharma', votes: 398, rank: 'Lead Systems Arbiter' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d5baff]">how_to_vote</span>
            <span className="font-serif-court text-base text-white font-semibold">Appeals Council Election</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-[#cdc2d8]">
          Elect supreme appellate magistrates to serve on the 5-juror High Bench for Epoch 683.
        </p>

        <div className="space-y-2">
          {candidates.map((c) => (
            <div
              key={c.id}
              onClick={() => setVotedCandidate(c.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                votedCandidate === c.id
                  ? 'bg-[#1c1f2a] border-[#d5baff]'
                  : 'bg-[#181b26] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-mono-ledger font-semibold text-white">{c.name}</span>
                <span className="text-[10px] text-[#cdc2d8]">{c.handle} • {c.rank}</span>
              </div>
              <div className="text-right">
                <span className="font-mono-ledger text-xs text-white font-bold">{c.votes} votes</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider"
        >
          {votedCandidate ? 'Cast Appellate Ballot' : 'Close'}
        </button>
      </div>
    </div>
  );
};

export const PeerChatModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState([
    { sender: 'Amara', text: 'Elena, Docket #0x88F escrow evidence hashes were verified on block #289,140.', time: '10:30' },
    { sender: 'You', text: 'Understood. Reviewing the multi-sig timing assert statements now.', time: '10:32' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: 'You', text: inputMsg.trim(), time: 'Just now' },
    ]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img
              alt="Amara"
              className="w-7 h-7 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrM4uyLWiBYlg2O6IHNFtKgNw68qfXOaFu_maHxu7Ap9K5SQZ5BpiGuj4-q9WCbT89wQesMjTOTTz95pYdx9vu_qXhXfDWwOWWchT4nxguMysMZuL2iv8yBzCdyUBYk1PHY1P97zCC6SMxrsOiQBuOtcDvhiBw1uO_NrNFs1PlksJD-AQiqR8vQmPx1aW-0tmiEh_eTmltEnQfOD4wic5H1ImWOFYGC-Jh321hL9pLaInvFL5AlLTU"
            />
            <div>
              <span className="font-serif-court text-sm text-white font-semibold">Amara Sharma</span>
              <span className="font-mono-ledger text-[10px] text-[#a0ffc3] block">Encrypted Juror Channel</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 p-2 rounded-xl bg-[#0b0e18] border border-white/5 text-xs max-h-48">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-[85%] ${
                m.sender === 'You'
                  ? 'bg-[#8a42f5]/30 text-white ml-auto border border-[#8a42f5]/40'
                  : 'bg-[#1c1f2a] text-[#cdc2d8] border border-white/5'
              }`}
            >
              <div className="text-[10px] text-[#968da1]">{m.sender} • {m.time}</div>
              <p className="mt-0.5">{m.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type confidential juror note..."
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
