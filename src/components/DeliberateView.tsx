import React, { useState, useEffect, useRef } from 'react';
import { Docket } from '../types';

interface DeliberateViewProps {
  dockets: Docket[];
  onVoteComplete?: (docketId: string, verdict: 'claimant' | 'contractor' | 'abstained') => void;
  onInspectExhibit: (image: string, title: string) => void;
}

export const DeliberateView: React.FC<DeliberateViewProps> = ({
  dockets,
  onVoteComplete,
  onInspectExhibit,
}) => {
  const [activeMode, setActiveMode] = useState<'quick' | 'trial'>('quick');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [cardTransform, setCardTransform] = useState<string>('none');
  const [cardOpacity, setCardOpacity] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);

  const [voteToast, setVoteToast] = useState<{ show: boolean; message: string; submessage: string }>({
    show: false,
    message: '',
    submessage: '',
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const activeDocket = dockets[currentIdx % dockets.length] || dockets[0];

  // Touch and mouse drag handlers for natural card swiping
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragCurrentX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragCurrentX(clientX);
    const diff = clientX - dragStartX;
    const rotate = diff * 0.08;
    setCardTransform(`translateX(${diff}px) rotate(${rotate}deg)`);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragCurrentX - dragStartX;
    if (diff > 80) {
      handleVote('contractor');
    } else if (diff < -80) {
      handleVote('claimant');
    } else {
      setCardTransform('none');
    }
  };

  // Web Audio synthesizer for realistic deposition sound
  const togglePlayAudio = () => {
    if (!isPlayingAudio) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(160, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          oscillatorRef.current = osc;
        }
      } catch {
        // Fallback gracefully if audio blocked
      }
      setIsPlayingAudio(true);
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      setIsPlayingAudio(false);
    }
  };

  // Audio timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 24) {
            setIsPlayingAudio(false);
            if (oscillatorRef.current) {
              try {
                oscillatorRef.current.stop();
              } catch {
                // ignore
              }
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlayingAudio]);

  const handleVote = (verdict: 'claimant' | 'contractor' | 'abstained') => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {
          // ignore
        }
      }
    }

    if (verdict === 'claimant') {
      setCardTransform('translateX(-120%) rotate(-12deg)');
      setCardOpacity(0);
    } else if (verdict === 'contractor') {
      setCardTransform('translateX(120%) rotate(12deg)');
      setCardOpacity(0);
    } else {
      setCardTransform('scale(0.92)');
    }

    const verdictLabel =
      verdict === 'claimant'
        ? `Claimant (${activeDocket.claimant.username})`
        : verdict === 'contractor'
        ? `Contractor (${activeDocket.respondent.username})`
        : 'Abstained / Discovery Requested';

    const slotNumber = Math.floor(289410000 + Math.random() * 50000);

    setVoteToast({
      show: true,
      message: `Vote Sealed: Ruled for ${verdictLabel}`,
      submessage: `Hash committed to Solana slot #${slotNumber.toLocaleString()} with 12.5 SOL slash guarantee.`,
    });

    if (onVoteComplete) {
      onVoteComplete(activeDocket.id, verdict);
    }

    setTimeout(() => {
      setCardTransform('none');
      setCardOpacity(1);
      setCurrentIdx((prev) => (prev + 1) % dockets.length);
      setAudioProgress(0);
    }, 450);

    setTimeout(() => {
      setVoteToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const dragOffset = isDragging ? dragCurrentX - dragStartX : 0;

  return (
    <div className="flex flex-col w-full px-4 space-y-4 max-w-lg mx-auto relative pb-6 select-none">
      {/* Top Segmented Pill Mode Switcher & Streak Banner */}
      <div className="w-full flex flex-col items-center gap-2 pt-1">
        {/* Segmented Control */}
        <div className="w-full max-w-xs flex items-center p-1 rounded-full bg-[#181b26] shadow-md border border-white/5">
          <button
            onClick={() => setActiveMode('quick')}
            className={`flex-1 py-1.5 px-4 rounded-full font-mono-ledger text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'quick'
                ? 'bg-[#10131d] text-[#e0e1f1] shadow-sm font-semibold'
                : 'text-[#cdc2d8] hover:text-[#e0e1f1]'
            }`}
            id="mode-quick"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Quick Review
          </button>
          <button
            onClick={() => setActiveMode('trial')}
            className={`flex-1 py-1.5 px-4 rounded-full font-mono-ledger text-xs transition-all flex items-center justify-center gap-1 ${
              activeMode === 'trial'
                ? 'bg-[#10131d] text-[#e0e1f1] shadow-sm font-semibold'
                : 'text-[#cdc2d8] hover:text-[#e0e1f1]'
            }`}
            id="mode-trial"
          >
            Full Trial
          </button>
        </div>

        {/* Juror Streak & Stake Metric Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1f2a] text-[#cdc2d8] font-mono-ledger text-xs border border-white/5">
          <span
            className="material-symbols-outlined text-[15px] text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span className="text-[#e0e1f1] font-medium">5 Dockets Reviewed</span>
          <span className="opacity-30">•</span>
          <span className="text-white font-medium">+12.5 SOL Staked</span>
        </div>
      </div>

      {/* Central Swipeable Verdict Card */}
      <div
        id="verdict-card"
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{
          transform: cardTransform,
          opacity: cardOpacity,
          transition: isDragging ? 'none' : 'transform 0.45s ease-out, opacity 0.45s ease-out',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="w-full relative rounded-2xl overflow-hidden bg-[#181b26] shadow-2xl flex flex-col border border-white/10"
      >
        {/* Swipe Feedback Overlay Indicator */}
        {dragOffset > 30 && (
          <div className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-full bg-white text-black font-mono-ledger text-xs font-bold shadow-lg border border-white/20 animate-fadeIn">
            RULE CONTRACTOR →
          </div>
        )}
        {dragOffset < -30 && (
          <div className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-full bg-[#272a35] text-white font-mono-ledger text-xs font-bold shadow-lg border border-white/20 animate-fadeIn">
            ← RULE CLAIMANT
          </div>
        )}

        {/* Top Progress Bar */}
        <div className="w-full flex items-center gap-1 px-4 pt-3 pb-1">
          {dockets.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-colors ${
                idx === currentIdx % dockets.length ? 'bg-white' : 'bg-[#323440]'
              }`}
            />
          ))}
        </div>

        {/* Card Engraved Header */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono-ledger text-xs text-white tracking-wider uppercase font-semibold">
                {activeDocket.id}
              </span>
              <span className="text-[#cdc2d8] text-[11px]">•</span>
              <span className="font-body-court text-xs text-[#cdc2d8]">{activeDocket.category}</span>
            </div>
            <span className="font-serif-court text-base text-white font-semibold tracking-tight truncate">
              {activeDocket.subtitle || activeDocket.title}
            </span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="px-2 py-0.5 rounded-full bg-[#323440] text-white font-mono-ledger text-xs flex items-center gap-1 border border-white/10">
              <span className="material-symbols-outlined text-[13px] text-white">schedule</span>{' '}
              {activeDocket.timeRemaining}
            </div>
            <span className="font-mono-ledger text-xs text-white font-semibold mt-0.5">
              {activeDocket.solAmount.toFixed(1)} SOL (${activeDocket.usdAmount.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Exhibit Visual Viewport with Media Overlay */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0b0e18]">
          <img
            className="w-full h-full object-cover pointer-events-none"
            alt="Evidentiary exhibit photo"
            src={activeDocket.exhibitImage}
          />

          {/* Visual Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181b26] via-transparent to-black/40 pointer-events-none" />

          {/* Exhibit Floating Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10131d]/85 backdrop-blur-md text-white border border-white/10 shadow-sm pointer-events-none">
            <span
              className="material-symbols-outlined text-[14px] text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-mono-ledger text-xs tracking-wide">
              {activeDocket.exhibitName}
            </span>
          </div>

          {/* Quick Fullscreen Inspector Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspectExhibit(activeDocket.exhibitImage, activeDocket.exhibitName);
            }}
            aria-label="Expand Exhibit"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#10131d]/75 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#10131d] border border-white/10 transition-colors z-20"
          >
            <span className="material-symbols-outlined text-[16px]">fullscreen</span>
          </button>

          {/* Parties VS Mini-Bar */}
          <div className="absolute bottom-2 inset-x-3 p-2.5 rounded-xl bg-[#10131d]/90 backdrop-blur-md flex items-center justify-between shadow-lg border border-white/10">
            {/* Claimant */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img
                alt="Claimant Avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white/10"
                src={activeDocket.claimant.avatar}
              />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-white tracking-tight truncate">
                  {activeDocket.claimant.username}
                </span>
                <span className="font-body-court text-[10px] text-[#cdc2d8] truncate">
                  "{activeDocket.claimant.claimSynopsis}"
                </span>
              </div>
            </div>

            {/* VS Badge */}
            <div className="px-2 py-0.5 mx-1 rounded-full bg-[#323440] text-white font-mono-ledger text-[10px] tracking-widest font-bold border border-white/20">
              VS
            </div>

            {/* Contractor / Respondent */}
            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end text-right">
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-white tracking-tight truncate">
                  {activeDocket.respondent.username}
                </span>
                <span className="font-body-court text-[10px] text-[#cdc2d8] truncate">
                  "{activeDocket.respondent.claimSynopsis}"
                </span>
              </div>
              <img
                alt="Contractor Avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white/10"
                src={activeDocket.respondent.avatar}
              />
            </div>
          </div>
        </div>

        {/* Sworn Evidentiary Summary */}
        <div className="p-4 flex flex-col gap-2.5">
          <p className="font-body-court text-xs text-[#cdc2d8] leading-relaxed">
            {activeDocket.evidenceSummary}
          </p>

          {/* Quick Audio Deposition Preview */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#1c1f2a] border border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayAudio();
                }}
                aria-label="Play Sworn Statement"
                className={`w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-sm ${
                  isPlayingAudio ? 'bg-[#a0ffc3] text-[#00391f]' : 'bg-white text-black'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlayingAudio ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <div className="flex flex-col">
                <span className="font-mono-ledger text-xs text-white leading-tight font-medium">
                  {activeDocket.audioDeposition?.title || 'Sworn Deposition'}
                </span>
                <span className="font-body-court text-[10px] text-[#cdc2d8]">
                  0:{audioProgress < 10 ? `0${audioProgress}` : audioProgress} •{' '}
                  {activeDocket.audioDeposition?.speaker || 'Lead Systems Architect'}
                </span>
              </div>
            </div>

            {/* Audio Waveform */}
            <div className="flex items-center gap-0.5 h-6 px-2">
              {[8, 14, 20, 10, 16, 6, 12, 18, 9].map((height, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlayingAudio
                      ? `${Math.max(4, (height * (1 + (i % 3) * 0.5 + Math.random() * 0.4)) % 22)}px`
                      : `${height}px`,
                    transition: 'height 0.15s ease',
                  }}
                  className={`w-0.5 rounded-full ${
                    isPlayingAudio ? 'bg-[#a0ffc3]' : i % 2 === 0 ? 'bg-white' : 'bg-[#968da1]'
                  }`}
                />
              ))}
            </div>
          </div>

          {activeMode === 'trial' && (
            <div className="p-2.5 rounded-xl bg-[#1c1f2a]/60 border border-white/5 space-y-2 mt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#cdc2d8]">Smart Contract Verification</span>
                <span className="text-[#a0ffc3] font-mono font-medium">Anchor Validated</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#cdc2d8]">On-Chain Cluster Hash</span>
                <span className="font-mono text-white text-[10px]">#e4a8b79c02aa11e8</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#cdc2d8]">Quorum Reached</span>
                <span className="font-mono-ledger text-white font-medium">
                  {activeDocket.stats.quorumCurrent} / {activeDocket.stats.quorumReq} Required
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deliberation Decision Action Bar */}
      <div className="w-full flex flex-col items-center gap-1.5 pt-1">
        <div className="w-full flex items-center justify-between px-1 gap-2">
          {/* Rule Claimant */}
          <button
            onClick={() => handleVote('claimant')}
            className="flex-1 h-14 rounded-full bg-[#272a35] hover:bg-[#323440] text-white flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md group border border-white/5"
            id="btn-claimant"
          >
            <div className="w-8 h-8 rounded-full bg-[#181b26] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px] text-white">gavel</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono-ledger text-xs text-white font-semibold uppercase leading-none">
                Rule
              </span>
              <span className="font-body-court text-[11px] text-[#cdc2d8] leading-tight">
                Claimant
              </span>
            </div>
          </button>

          {/* Abstain */}
          <button
            onClick={() => handleVote('abstained')}
            aria-label="Abstain or Request Discovery"
            className="w-14 h-14 rounded-full bg-[#272a35] hover:bg-[#323440] text-[#cdc2d8] hover:text-white flex items-center justify-center transition-transform active:scale-90 shadow-md border border-white/5 shrink-0"
            id="btn-abstain"
          >
            <span className="material-symbols-outlined text-[20px]">balance</span>
          </button>

          {/* Rule Contractor */}
          <button
            onClick={() => handleVote('contractor')}
            className="flex-1 h-14 rounded-full bg-white text-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg group border border-white"
            id="btn-contractor"
          >
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[18px] text-black"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono-ledger text-xs text-black font-bold uppercase leading-none">
                Rule
              </span>
              <span className="font-body-court text-[11px] text-black/80 font-medium leading-tight">
                Contractor
              </span>
            </div>
          </button>
        </div>

        {/* Cryptographic Helper Micro-Caption */}
        <div className="flex items-center gap-1 text-center text-[#cdc2d8] pt-1">
          <span className="material-symbols-outlined text-[13px] text-white">lock</span>
          <p className="font-body-court text-[11px] tracking-tight">
            Swipe or tap to vote. Judgments anchor to Solana with 12.5 SOL slash guarantee.
          </p>
        </div>
      </div>

      {/* Interactive Juror Deliberation Notification Toast */}
      {voteToast.show && (
        <div className="fixed bottom-24 left-4 right-4 z-50 p-3.5 rounded-xl bg-[#272a35] text-white shadow-2xl flex items-center gap-3 border border-white/20 animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-[#00ec91] text-[#00391f] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] font-bold">done_all</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1 text-left">
            <span className="font-mono-ledger text-xs text-[#00ec91] font-bold uppercase">
              {voteToast.message}
            </span>
            <span className="font-body-court text-xs text-[#cdc2d8] truncate">
              {voteToast.submessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
