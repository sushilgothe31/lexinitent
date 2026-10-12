import React, { useState } from 'react';
import { Docket, EmergencyStory } from '../types';

interface FeedViewProps {
  dockets: Docket[];
  stories: EmergencyStory[];
  onSelectStory: (story: EmergencyStory) => void;
  onEnterDeliberation: (docketId: string) => void;
  onOpenMemorandum: () => void;
  onJoinPublicGallery: () => void;
  onOpenComments: (docketId: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  dockets,
  stories,
  onSelectStory,
  onEnterDeliberation,
  onOpenMemorandum,
  onJoinPublicGallery,
  onOpenComments,
}) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{ [key: string]: boolean }>({});
  const [likes, setLikes] = useState<{ [key: string]: number }>({
    'post-1': 142,
    'post-2': 412,
    'post-3': 289,
  });
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setLikes((curr) => ({
        ...curr,
        [postId]: curr[postId] + (isLiked ? 1 : -1),
      }));
      return { ...prev, [postId]: isLiked };
    });
  };

  const handleShare = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`LexIntent Arbitration: ${title} https://lexintent.sol`);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const primaryDocket = dockets[0] || {};

  return (
    <div className="flex flex-col w-full">
      {/* Toast for Share */}
      {copiedLink && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1c1f2a] border border-[#a0ffc3]/40 text-[#a0ffc3] text-xs font-mono-ledger flex items-center gap-2 shadow-2xl">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          Docket cryptographic link copied to clipboard!
        </div>
      )}

      {/* Interactive Story Ribbon / Emergency Petitions Bar - Perfectly Centered */}
      <section className="w-full pt-3 pb-4 px-2 sm:px-4 bg-[#0b0e18] border-b border-white/5 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 sm:gap-3.5">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => onSelectStory(story)}
              aria-label={`Open ${story.title} Case`}
              className="flex flex-col items-center gap-1.5 flex-1 max-w-[68px] sm:max-w-[76px] group focus:outline-none"
              type="button"
            >
              <div
                className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 active:scale-95 shadow-md flex items-center justify-center ${
                  story.urgency === 'critical'
                    ? 'bg-gradient-to-tr from-white via-white/80 to-[#d5baff]'
                    : 'bg-[#272a35] group-hover:bg-white/40'
                }`}
              >
                <div className="w-full h-full rounded-full bg-[#181b26] p-1 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full rounded-full bg-[#1c1f2a] flex items-center justify-center text-white relative">
                    <span
                      className={`material-symbols-outlined text-[20px] sm:text-[24px] ${
                        story.urgency === 'critical' ? 'text-white' : 'text-[#cdc2d8] group-hover:text-white'
                      }`}
                    >
                      {story.icon}
                    </span>
                    {story.urgency === 'critical' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white ring-2 ring-[#1c1f2a]" />
                    )}
                  </div>
                </div>
              </div>
              <span
                className={`font-mono-ledger text-[10px] sm:text-[11px] truncate w-full text-center tracking-tight leading-tight ${
                  story.urgency === 'critical' ? 'text-white font-semibold' : 'text-[#cdc2d8] group-hover:text-white'
                }`}
              >
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Feed Dockets Stream */}
      <div className="flex flex-col w-full px-4 py-4 gap-6 max-w-lg mx-auto">
        {/* FEED POST 1: High Stakes Dispute Docket */}
        <article className="flex flex-col w-full rounded-xl bg-[#181b26] shadow-xl overflow-hidden transition-all duration-300 border border-white/5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-[#181b26]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 p-0.5 bg-[#323440] border border-white/10">
                <img
                  alt="Barrister Julian Vance, Reporter"
                  className="w-full h-full rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VWXSvWGoRfcS3k7_alf8i_eX9zgFp1bjQ4O3WidjkumaFfpnz7El8oRlnFFq050dYpVDsmSkgZJZlzKm-rYmRAthMNd7eJwyX0lk4fZNUd-0R8BIpaNkAuiTgQYFUSiYxxF08eEGU-JO4ULExKbVXsxGqbKsqp88U_h16fjUgcLo48cHRAuniI1cNoU70Lr83NMWKLrYrDvNwomdFYvVY2K0zbEc6281TgKQB7bsQdSySJJlubsuIGGAU"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono-ledger text-sm text-white font-semibold tracking-normal truncate">
                    @solventures
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#323440] text-white font-mono-ledger text-[10px] tracking-widest font-bold border border-white/20">
                    VS
                  </span>
                  <span className="font-mono-ledger text-sm text-white font-semibold tracking-normal truncate">
                    @devkael
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#cdc2d8] mt-0.5 text-xs">
                  <span className="font-mono-ledger">2h ago</span>
                  <span className="text-[8px] text-[#968da1]">•</span>
                  <span className="font-mono-ledger">Smart Escrow</span>
                  <span className="text-[8px] text-[#968da1]">•</span>
                  <span className="font-mono-ledger font-semibold text-white">45.0 SOL ($6,750)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleShare('Milestone 3 Escrow Withheld')}
              aria-label="Docket Context Menu"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#cdc2d8] hover:text-white hover:bg-[#272a35] transition-colors active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>

          {/* Media Viewport */}
          <div className="relative w-full aspect-[4/3] bg-[#0b0e18] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Dark dramatic interior courtroom desk"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByOpxKvDMLQqrI-uh06W8iCCDQDrwCUI2E7uV00OlwqIGznC0azvgVeIhES5iE7Mo-ixH0Nj5NQh48lkpXorS-yVSPnevtoM2DpvwlLMKtb53l150Gl1QqAT_jHbHCntQ6tQ-5OPrGf8jRxLU_ioLhU9B9V_J7CbEHQvNC8d2lheNo3NfMDvvsBi8bkBrYXAimXWrNMfeS6nAMnKUWIA3-v8nrJo7KL8AEL3n_j0YPYpd0LHqHhhRs"
            />
            {/* Active Deliberation Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-[#10131d]/85 backdrop-blur-md shadow-lg text-white border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-mono-ledger text-[11px] font-semibold text-white uppercase tracking-wider">
                Active Deliberation
              </span>
            </div>

            {/* Exhibit A Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10131d]/85 backdrop-blur-md shadow-md text-white border border-white/10">
              <span
                className="material-symbols-outlined text-[15px] text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="font-mono-ledger text-xs font-medium tracking-wide">
                Exhibit A: WebKit Passing Hash
              </span>
            </div>

            {/* Docket ID */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#272a35]/90 backdrop-blur-sm text-[#cdc2d8] font-mono-ledger text-xs font-mono border border-white/10">
              #LX-9014
            </div>
          </div>

          {/* Social Reactions Row */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 bg-[#181b26]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike('post-1')}
                aria-label="Weigh In With Gavel"
                className={`flex items-center gap-1 transition-colors active:scale-95 ${
                  likedPosts['post-1'] ? 'text-[#d5baff]' : 'text-[#e0e1f1] hover:text-white'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">balance</span>
                <span className="font-mono-ledger text-xs font-semibold">{likes['post-1']}</span>
              </button>

              <button
                onClick={() => onOpenComments(primaryDocket.id)}
                aria-label="View Sworn Briefs"
                className="flex items-center gap-1 text-[#cdc2d8] hover:text-white transition-colors active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">mode_comment</span>
                <span className="font-mono-ledger text-xs">18</span>
              </button>

              <button
                onClick={() => handleShare('Milestone 3 Escrow Withheld')}
                aria-label="Share Docket"
                className="flex items-center text-[#cdc2d8] hover:text-white transition-colors active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">send</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1c1f2a] text-white font-mono-ledger text-xs border border-white/10">
                <span
                  className="material-symbols-outlined text-[14px] text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                <span className="font-medium">1,280 SOL Staked</span>
              </div>

              <button
                onClick={() => toggleBookmark('post-1')}
                aria-label="Bookmark Case"
                className={`w-8 h-8 flex items-center justify-center transition-colors active:scale-95 ${
                  bookmarkedPosts['post-1'] ? 'text-[#edbf70]' : 'text-[#cdc2d8] hover:text-white'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {bookmarkedPosts['post-1'] ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>
          </div>

          {/* Description & Quorum Progress Bar */}
          <div className="px-4 pb-4 flex flex-col gap-2.5 bg-[#181b26]">
            <div className="flex flex-col gap-1">
              <h2 className="font-serif-court text-lg text-white font-semibold leading-snug">
                Milestone 3 Escrow Withheld: Proof-of-Deliverable Verification
              </h2>
              <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
                <span className="font-semibold text-white">@solventures:</span> Claimant withheld 45 SOL escrow after
                milestone delivery. Contractor verified cryptographic commit hash{' '}
                <span className="font-mono text-white text-[11px] bg-[#272a35] px-1.5 py-0.5 rounded border border-white/10">
                  #e4a8b...19c
                </span>{' '}
                on Devnet cluster.
              </p>
            </div>

            {/* Voting Meter */}
            <div className="w-full bg-[#1c1f2a] rounded-xl p-3 flex flex-col gap-2 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono-ledger">
                <div className="flex items-center gap-1.5 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="font-semibold">68% Release to Dev</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#cdc2d8]">
                  <span className="font-semibold">32% Refund Client</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#323440]" />
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-[#323440] overflow-hidden flex">
                <div className="h-full bg-white rounded-l-full transition-all duration-500" style={{ width: '68%' }} />
                <div className="h-full bg-[#8a42f5] transition-all duration-500" style={{ width: '32%' }} />
              </div>

              <div className="flex items-center justify-between text-[#cdc2d8] font-mono-ledger text-[11px] pt-0.5">
                <span>Quorum: 200 Jurors Req.</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-white">schedule</span> Closes in 04h 18m
                </span>
              </div>
            </div>

            {/* Enter Deliberation Chamber Action Button */}
            <div className="pt-1">
              <button
                onClick={() => onEnterDeliberation(primaryDocket.id || '#LX-9014')}
                className="w-full py-3 px-4 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all font-bold group"
                type="button"
              >
                <span
                  className="material-symbols-outlined text-[20px] text-black group-hover:scale-110 transition-transform"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  balance
                </span>
                <span className="font-mono-ledger text-xs uppercase tracking-wider text-black font-bold">
                  Enter Deliberation Chamber
                </span>
              </button>
            </div>
          </div>
        </article>

        {/* FEED POST 2: High Court Precedent & Settlement Dispatch */}
        <article className="flex flex-col w-full rounded-xl bg-[#181b26] shadow-xl overflow-hidden transition-all duration-300 border border-white/5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-[#181b26]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 p-0.5 bg-[#323440] border border-white/10">
                <img
                  alt="Senior Arbitrator Magistrate Elena Rostova"
                  className="w-full h-full rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1V1INzlSXQSDGjhQYWqt9vbqUHdnQDASJHEu38wqxyDwGTTGs4ohmOiU9emzS2iUWJ08NChJiFrtAhXk1lASGX9cw-6J_5w3XSYB54A8OgUkTk3I87lwpTMXB1DMbhYAiw4V5wYxmuLd7NKyLCFRPBvWzZ4dOf8JITK1bXTmW7EzpNacCI8ajrkU9ZD11z4Fo3KXpL65hzeS83q5IOGBsQx5FqTxS6l5dQtZ1VJ3qIzv2WSw0ywiFXOYA"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono-ledger text-sm text-white font-semibold tracking-normal truncate">
                    @magistrate_elena
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#323440] text-white font-mono-ledger text-[10px] tracking-wider uppercase font-semibold border border-white/10">
                    High Arbitrator
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#cdc2d8] mt-0.5 text-xs">
                  <span className="font-mono-ledger">5h ago</span>
                  <span className="text-[8px] text-[#968da1]">•</span>
                  <span className="font-mono-ledger">Supreme Precedent #1108</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleShare('Supreme Precedent #1108')}
              aria-label="Docket Context Menu"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#cdc2d8] hover:text-white hover:bg-[#272a35] transition-colors active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>

          {/* Settled Card Content */}
          <div className="px-4 py-2">
            <div className="w-full rounded-xl p-4 bg-[#1c1f2a] flex flex-col gap-3 relative overflow-hidden border border-white/5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-black font-mono-ledger text-[11px] font-bold tracking-wider uppercase">
                  <span
                    className="material-symbols-outlined text-[14px] text-black"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>{' '}
                  Unanimous Verdict
                </span>
                <span className="font-mono-ledger text-xs text-[#cdc2d8] font-mono">0x4F8...B22</span>
              </div>

              <div className="flex flex-col gap-1 z-10">
                <span className="font-serif-court text-lg text-white font-semibold">
                  Decentralized SLA Breach Settled in 4m 12s
                </span>
                <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
                  Automated multi-sig bond triggered immediately after respondent failed latency assertions across
                  three sovereign validator checkpoints.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 z-10 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="font-mono-ledger text-[10px] text-[#cdc2d8] uppercase tracking-wider">
                    Judicial Award
                  </span>
                  <span className="font-serif-court text-lg text-white font-bold">85.00 SOL</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#272a35] text-white font-mono-ledger text-xs font-medium border border-white/10">
                  <span className="material-symbols-outlined text-[16px] text-white">lock</span>
                  <span>Finalized Slot #291,048,221</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reactions */}
          <div className="flex items-center justify-between px-4 pt-2 pb-2 bg-[#181b26]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike('post-2')}
                aria-label="Agree with Precedent"
                className={`flex items-center gap-1 transition-colors active:scale-95 ${
                  likedPosts['post-2'] ? 'text-[#d5baff]' : 'text-[#e0e1f1] hover:text-white'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">thumb_up</span>
                <span className="font-mono-ledger text-xs font-semibold">{likes['post-2']}</span>
              </button>
              <button
                onClick={onOpenMemorandum}
                aria-label="Comments and Analysis"
                className="flex items-center gap-1 text-[#cdc2d8] hover:text-white transition-colors active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">comment</span>
                <span className="font-mono-ledger text-xs">34</span>
              </button>
              <button
                onClick={() => handleShare('SLA Breach Precedent')}
                aria-label="Share Precedent"
                className="flex items-center text-[#cdc2d8] hover:text-white transition-colors active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">share</span>
              </button>
            </div>

            <button
              onClick={() => toggleBookmark('post-2')}
              aria-label="Save Precedent to Dossier"
              className={`w-8 h-8 flex items-center justify-center transition-colors active:scale-95 ${
                bookmarkedPosts['post-2'] ? 'text-[#edbf70]' : 'text-[#cdc2d8] hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">
                {bookmarkedPosts['post-2'] ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>

          <div className="px-4 pb-4 flex flex-col gap-2 bg-[#181b26]">
            <p className="font-body-court text-xs text-[#cdc2d8]">
              <span className="font-semibold text-white">@magistrate_elena:</span> “The protocol covenant was crystal
              clear. Intent was preserved through deterministic on-chain logs. Sovereign juries require no further
              deposition.”
            </p>
            <button
              onClick={onOpenMemorandum}
              className="text-left font-mono-ledger text-xs text-white hover:underline pt-0.5 font-medium flex items-center gap-1"
              type="button"
            >
              Read full 12-page supreme memorandum &amp; validator attestation →
            </button>
          </div>
        </article>

        {/* FEED POST 3: Community Courtroom Assembly Visual Card */}
        <article className="flex flex-col w-full rounded-xl bg-[#181b26] shadow-xl overflow-hidden transition-all duration-300 border border-white/5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-[#181b26]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-[#272a35] flex items-center justify-center text-white border border-white/10">
                <span className="material-symbols-outlined text-[24px]">account_tree</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-ledger text-sm text-white font-semibold truncate">
                    @dao_arbitration_council
                  </span>
                  <span
                    className="material-symbols-outlined text-white text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#cdc2d8] text-xs">
                  <span className="font-mono-ledger">8h ago</span>
                  <span className="text-[8px] text-[#968da1]">•</span>
                  <span className="font-mono-ledger text-white font-medium">Special Grand Bench</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleShare('Cluster #4 Bench Hearing')}
              aria-label="Options"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#cdc2d8] hover:text-white active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>

          {/* Media Viewport */}
          <div className="relative w-full aspect-[16/10] bg-[#0b0e18] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Arbitration hearing in corporate conference room"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN1ZAhjASAfIe-1dLXkLwFS_tCkxTIP52H9jYO6AAJ3R82X6CWn9cHeBjJ4f4j6rOa6hQIYz9kQPw35icQE8KnADS3xa5S52F-0EcIs-4S4SKB1697c6uFDSTaZ-2TrQbke0zvPv4AqSpKuJceQ7vEwVPL6ZIBgBYdI5eS8zWqkWfs4VQeOJhFdeYT8Pxgyj5cbsHjGUTikzKdcdXeHPRZOWcQp5oc5rRbVJmTpZ9qeVj2yqUNCiYH"
            />
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#10131d]/85 backdrop-blur-md text-white font-mono-ledger text-xs flex items-center gap-1.5 border border-white/10">
              <span className="material-symbols-outlined text-[16px] text-white">groups</span>
              <span>Bench Hearing in Session: Cluster #4</span>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="px-4 pt-3 pb-4 flex flex-col gap-3 bg-[#181b26]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#e0e1f1]">
                <button
                  onClick={() => toggleLike('post-3')}
                  className={`flex items-center gap-1 transition-colors active:scale-95 ${
                    likedPosts['post-3'] ? 'text-[#d5baff]' : 'hover:text-white'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px]">thumb_up</span>
                  <span className="font-mono-ledger text-xs">{likes['post-3']}</span>
                </button>
                <button
                  onClick={onJoinPublicGallery}
                  className="flex items-center gap-1 hover:text-white transition-colors active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px]">forum</span>
                  <span className="font-mono-ledger text-xs">52</span>
                </button>
              </div>
              <span className="font-mono-ledger text-xs text-[#968da1]">Docket ID #0x0E...418</span>
            </div>

            <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
              The Council has impaneled 7 senior jurors to examine an ambiguous multi-token rebalancing trigger in
              Liquidity Pool #9. Sworn technical testimony opens at 14:00 UTC.
            </p>

            <button
              onClick={onJoinPublicGallery}
              className="w-full py-3 px-4 rounded-full bg-[#272a35] hover:bg-[#323440] text-white border border-white/15 flex items-center justify-center gap-2 active:scale-[0.98] transition-all group"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-white group-hover:scale-110 transition-transform">
                visibility
              </span>
              <span className="font-mono-ledger text-xs uppercase tracking-wider font-semibold">
                Join Live Public Gallery
              </span>
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
