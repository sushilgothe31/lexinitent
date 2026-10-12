import React, { useState, useMemo } from 'react';
import { JurorLeaderboardEntry } from '../types';
import { INITIAL_JUROR_LEADERBOARD } from '../data/mockData';

export type BadgeTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export interface BadgeInfo {
  tier: BadgeTier;
  icon: string;
  label: string;
  shortLabel: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  glowClass: string;
  description: string;
}

export function getJurorBadge(successRate: number): BadgeInfo {
  if (successRate >= 98.5) {
    return {
      tier: 'Platinum',
      icon: 'diamond',
      label: 'Platinum Arbiter',
      shortLabel: 'Platinum',
      textColor: 'text-cyan-300',
      bgColor: 'bg-cyan-950/60',
      borderColor: 'border-cyan-400/50',
      glowClass: 'shadow-[0_0_12px_rgba(34,211,238,0.35)]',
      description: 'Elite Tier • Success Rate ≥ 98.5%',
    };
  }
  if (successRate >= 97.0) {
    return {
      tier: 'Gold',
      icon: 'workspace_premium',
      label: 'Gold Arbiter',
      shortLabel: 'Gold',
      textColor: 'text-amber-300',
      bgColor: 'bg-amber-950/60',
      borderColor: 'border-amber-400/50',
      glowClass: 'shadow-[0_0_12px_rgba(251,191,36,0.35)]',
      description: 'Senior Tier • Success Rate 97.0% - 98.4%',
    };
  }
  if (successRate >= 95.0) {
    return {
      tier: 'Silver',
      icon: 'military_tech',
      label: 'Silver Arbiter',
      shortLabel: 'Silver',
      textColor: 'text-slate-200',
      bgColor: 'bg-slate-900/70',
      borderColor: 'border-slate-300/40',
      glowClass: 'shadow-[0_0_12px_rgba(203,213,225,0.25)]',
      description: 'Distinguished Tier • Success Rate 95.0% - 96.9%',
    };
  }
  return {
    tier: 'Bronze',
    icon: 'shield',
    label: 'Bronze Arbiter',
    shortLabel: 'Bronze',
    textColor: 'text-amber-500',
    bgColor: 'bg-stone-900/70',
    borderColor: 'border-amber-700/40',
    glowClass: 'shadow-[0_0_12px_rgba(217,119,6,0.25)]',
    description: 'Sworn Juror • Success Rate < 95.0%',
  };
}

interface JurorLeaderboardProps {
  onOpenPeerChat?: () => void;
}

export const JurorLeaderboard: React.FC<JurorLeaderboardProps> = ({ onOpenPeerChat }) => {
  const [jurors] = useState<JurorLeaderboardEntry[]>(INITIAL_JUROR_LEADERBOARD);
  const [sortBy, setSortBy] = useState<'reputation' | 'arbitrations' | 'rate' | 'staked'>('reputation');
  const [selectedGuild, setSelectedGuild] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJuror, setSelectedJuror] = useState<JurorLeaderboardEntry | null>(null);
  const [showBadgeLegend, setShowBadgeLegend] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const calculateSuccessRate = (juror: JurorLeaderboardEntry): number => {
    if (!juror.totalArbitrations || juror.totalArbitrations === 0) return juror.consensusRate;
    return Number(((juror.successfulArbitrations / juror.totalArbitrations) * 100).toFixed(1));
  };

  const filteredAndSortedJurors = useMemo(() => {
    return [...jurors]
      .filter((j) => {
        if (selectedGuild !== 'all' && j.guild !== selectedGuild) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = j.name.toLowerCase().includes(q);
          const matchHandle = j.handle.toLowerCase().includes(q);
          const matchAddress = j.address.toLowerCase().includes(q);
          const matchGuild = j.guild.toLowerCase().includes(q);
          if (!matchName && !matchHandle && !matchAddress && !matchGuild) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'reputation') {
          return b.reputationScore - a.reputationScore;
        }
        if (sortBy === 'arbitrations') {
          return b.successfulArbitrations - a.successfulArbitrations;
        }
        if (sortBy === 'rate') {
          return calculateSuccessRate(b) - calculateSuccessRate(a);
        }
        if (sortBy === 'staked') {
          return b.stakedSol - a.stakedSol;
        }
        return 0;
      });
  }, [jurors, sortBy, selectedGuild, searchQuery]);

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard?.writeText(addr);
    setCopyFeedback(addr);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#272a35] flex items-center justify-center text-[#edbf70] border border-[#edbf70]/20 shadow-sm">
            <span className="material-symbols-outlined text-[19px]">leaderboard</span>
          </div>
          <div>
            <h2 className="font-serif-court text-base text-white font-semibold flex items-center gap-2">
              Juror Leaderboard
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono-ledger text-[10px] uppercase font-bold tracking-wider">
                Live
              </span>
            </h2>
            <p className="font-body-court text-xs text-[#cdc2d8]">
              Ranked by reputation score &amp; arbitration success
            </p>
          </div>
        </div>

        {/* Badge Legend Toggle Button */}
        <button
          onClick={() => setShowBadgeLegend((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-ledger transition-all border ${
            showBadgeLegend
              ? 'bg-[#323440] text-white border-white/20'
              : 'bg-[#1c1f2a] text-[#cdc2d8] hover:text-white border-white/10'
          }`}
          title="View Arbitration Badge Tier System"
          type="button"
        >
          <span className="material-symbols-outlined text-[15px] text-[#edbf70]">military_tech</span>
          <span className="hidden sm:inline">Badges</span>
          <span className="material-symbols-outlined text-[13px]">
            {showBadgeLegend ? 'expand_less' : 'help_outline'}
          </span>
        </button>
      </div>

      {/* Arbitration Badge System Legend Drawer / Banner */}
      {showBadgeLegend && (
        <div className="p-3.5 rounded-xl bg-[#141722] border border-white/10 space-y-2.5 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#edbf70]">workspace_premium</span>
              <span className="font-mono-ledger text-xs text-white uppercase font-bold tracking-wider">
                Arbitration Success Rate Badges
              </span>
            </div>
            <span className="text-[11px] font-mono-ledger text-[#968da1]">Solana Anchor Standard</span>
          </div>
          <p className="font-body-court text-xs text-[#cdc2d8]">
            Distinct insignia awarded to deliberating jurists based on verified consensus rulings:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {/* Platinum */}
            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-400/30 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                <span className="material-symbols-outlined text-[17px]">diamond</span>
              </div>
              <div className="min-w-0">
                <span className="font-mono-ledger text-[11px] text-cyan-300 font-bold block leading-tight">
                  Platinum
                </span>
                <span className="font-mono-ledger text-[10px] text-cyan-200/70 block">≥ 98.5% Success</span>
              </div>
            </div>

            {/* Gold */}
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-400/30 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                <span className="material-symbols-outlined text-[17px]">workspace_premium</span>
              </div>
              <div className="min-w-0">
                <span className="font-mono-ledger text-[11px] text-amber-300 font-bold block leading-tight">
                  Gold
                </span>
                <span className="font-mono-ledger text-[10px] text-amber-200/70 block">97.0% - 98.4%</span>
              </div>
            </div>

            {/* Silver */}
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-300/30 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-400/20 flex items-center justify-center text-slate-200 shadow-[0_0_8px_rgba(203,213,225,0.2)]">
                <span className="material-symbols-outlined text-[17px]">military_tech</span>
              </div>
              <div className="min-w-0">
                <span className="font-mono-ledger text-[11px] text-slate-200 font-bold block leading-tight">
                  Silver
                </span>
                <span className="font-mono-ledger text-[10px] text-slate-300/70 block">95.0% - 96.9%</span>
              </div>
            </div>

            {/* Bronze */}
            <div className="p-2 rounded-lg bg-stone-900/60 border border-amber-700/40 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-800/30 flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined text-[17px]">shield</span>
              </div>
              <div className="min-w-0">
                <span className="font-mono-ledger text-[11px] text-amber-500 font-bold block leading-tight">
                  Bronze
                </span>
                <span className="font-mono-ledger text-[10px] text-amber-600/80 block">&lt; 95.0% Success</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sorting Controls */}
      <div className="bg-[#181b26] p-3 rounded-xl border border-white/10 space-y-2.5 shadow-md">
        {/* Sort selector pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-mono-ledger text-[11px] text-[#cdc2d8] uppercase tracking-wider">
            Rank Jurors By:
          </span>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1">
            <button
              onClick={() => setSortBy('reputation')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-ledger transition-colors flex items-center justify-center gap-1 ${
                sortBy === 'reputation'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#272a35] text-[#cdc2d8] hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Reputation
            </button>
            <button
              onClick={() => setSortBy('arbitrations')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-ledger transition-colors flex items-center justify-center gap-1 ${
                sortBy === 'arbitrations'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#272a35] text-[#cdc2d8] hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">gavel</span>
              Arbitrations
            </button>
            <button
              onClick={() => setSortBy('rate')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-ledger transition-colors flex items-center justify-center gap-1 ${
                sortBy === 'rate'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#272a35] text-[#cdc2d8] hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">percent</span>
              Success Rate
            </button>
            <button
              onClick={() => setSortBy('staked')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-ledger transition-colors flex items-center justify-center gap-1 ${
                sortBy === 'staked'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#272a35] text-[#cdc2d8] hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Staked SOL
            </button>
          </div>
        </div>

        {/* Guild Category Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-white/5">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-[16px] text-[#968da1] absolute left-2.5 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by juror, handle or pubkey..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0b0e18] border border-white/10 text-white font-mono-ledger text-xs placeholder:text-[#5d5666] focus:outline-none focus:border-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#968da1] hover:text-white"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          {/* Guild Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {['all', 'Smart Escrow', 'Protocol Security', 'IP & Code', 'Appeals Bench'].map((guild) => (
              <button
                key={guild}
                onClick={() => setSelectedGuild(guild)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono-ledger whitespace-nowrap transition-colors ${
                  selectedGuild === guild
                    ? 'bg-[#323440] text-white border border-white/20'
                    : 'text-[#968da1] hover:text-white bg-transparent'
                }`}
                type="button"
              >
                {guild === 'all' ? 'All Guilds' : guild}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards (when viewing all jurors without active text filter) */}
      {!searchQuery && selectedGuild === 'all' && (
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* #2 Silver Position */}
          {filteredAndSortedJurors[1] && (
            <div
              onClick={() => setSelectedJuror(filteredAndSortedJurors[1])}
              className="rounded-xl bg-[#181b26] p-2.5 pt-3 flex flex-col items-center text-center cursor-pointer border border-white/10 hover:border-white/20 hover:bg-[#1c1f2a] transition-all group relative active:scale-95 shadow-md"
            >
              <div className="w-5 h-5 rounded-full bg-slate-300 text-black font-mono-ledger text-[10px] font-bold flex items-center justify-center absolute -top-2">
                #2
              </div>
              <div className="relative mb-1.5 mt-1">
                <img
                  src={filteredAndSortedJurors[1].avatar}
                  alt={filteredAndSortedJurors[1].name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-300/40"
                />
                {(() => {
                  const b = getJurorBadge(calculateSuccessRate(filteredAndSortedJurors[1]));
                  return (
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${b.bgColor} ${b.borderColor} border flex items-center justify-center ${b.textColor} ${b.glowClass}`}
                      title={`${b.label} (${calculateSuccessRate(filteredAndSortedJurors[1])}%)`}
                    >
                      <span className="material-symbols-outlined text-[13px]">{b.icon}</span>
                    </div>
                  );
                })()}
              </div>
              <span className="font-serif-court text-xs text-white font-semibold line-clamp-1 group-hover:text-amber-200 transition-colors">
                {filteredAndSortedJurors[1].name.replace('Hon. ', '').replace('Dr. ', '')}
              </span>
              <span className="font-mono-ledger text-[10px] text-white/90 font-bold mt-0.5">
                {filteredAndSortedJurors[1].reputationScore} Rep
              </span>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8]">
                {filteredAndSortedJurors[1].successfulArbitrations} Wins
              </span>
            </div>
          )}

          {/* #1 Gold Position (Center, Elevated) */}
          {filteredAndSortedJurors[0] && (
            <div
              onClick={() => setSelectedJuror(filteredAndSortedJurors[0])}
              className="rounded-xl bg-gradient-to-b from-[#232736] to-[#181b26] p-2.5 pt-3.5 flex flex-col items-center text-center cursor-pointer border-2 border-[#edbf70]/60 hover:border-[#edbf70] transition-all group relative active:scale-95 shadow-[0_4px_20px_rgba(237,191,112,0.15)] -translate-y-1"
            >
              <div className="w-6 h-6 rounded-full bg-[#edbf70] text-black font-mono-ledger text-xs font-bold flex items-center justify-center absolute -top-2.5 shadow-md">
                👑
              </div>
              <div className="relative mb-1.5 mt-1">
                <img
                  src={filteredAndSortedJurors[0].avatar}
                  alt={filteredAndSortedJurors[0].name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-[#edbf70]"
                />
                {(() => {
                  const b = getJurorBadge(calculateSuccessRate(filteredAndSortedJurors[0]));
                  return (
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${b.bgColor} ${b.borderColor} border flex items-center justify-center ${b.textColor} ${b.glowClass}`}
                      title={`${b.label} (${calculateSuccessRate(filteredAndSortedJurors[0])}%)`}
                    >
                      <span className="material-symbols-outlined text-[13px]">{b.icon}</span>
                    </div>
                  );
                })()}
              </div>
              <span className="font-serif-court text-xs text-white font-bold line-clamp-1 group-hover:text-[#edbf70] transition-colors">
                {filteredAndSortedJurors[0].name.replace('Hon. ', '')}
              </span>
              <span className="font-mono-ledger text-[11px] text-[#edbf70] font-bold mt-0.5">
                {filteredAndSortedJurors[0].reputationScore} Rep
              </span>
              <span className="font-mono-ledger text-[10px] text-[#a0ffc3]">
                {filteredAndSortedJurors[0].successfulArbitrations} Wins
              </span>
            </div>
          )}

          {/* #3 Bronze Position */}
          {filteredAndSortedJurors[2] && (
            <div
              onClick={() => setSelectedJuror(filteredAndSortedJurors[2])}
              className="rounded-xl bg-[#181b26] p-2.5 pt-3 flex flex-col items-center text-center cursor-pointer border border-white/10 hover:border-white/20 hover:bg-[#1c1f2a] transition-all group relative active:scale-95 shadow-md"
            >
              <div className="w-5 h-5 rounded-full bg-amber-700 text-white font-mono-ledger text-[10px] font-bold flex items-center justify-center absolute -top-2">
                #3
              </div>
              <div className="relative mb-1.5 mt-1">
                <img
                  src={filteredAndSortedJurors[2].avatar}
                  alt={filteredAndSortedJurors[2].name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-700/50"
                />
                {(() => {
                  const b = getJurorBadge(calculateSuccessRate(filteredAndSortedJurors[2]));
                  return (
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${b.bgColor} ${b.borderColor} border flex items-center justify-center ${b.textColor} ${b.glowClass}`}
                      title={`${b.label} (${calculateSuccessRate(filteredAndSortedJurors[2])}%)`}
                    >
                      <span className="material-symbols-outlined text-[13px]">{b.icon}</span>
                    </div>
                  );
                })()}
              </div>
              <span className="font-serif-court text-xs text-white font-semibold line-clamp-1 group-hover:text-amber-200 transition-colors">
                {filteredAndSortedJurors[2].name.replace('Dr. ', '').replace('Hon. ', '')}
              </span>
              <span className="font-mono-ledger text-[10px] text-white/90 font-bold mt-0.5">
                {filteredAndSortedJurors[2].reputationScore} Rep
              </span>
              <span className="font-mono-ledger text-[10px] text-[#cdc2d8]">
                {filteredAndSortedJurors[2].successfulArbitrations} Wins
              </span>
            </div>
          )}
        </div>
      )}

      {/* Juror List Table / Cards */}
      <div className="space-y-2">
        {filteredAndSortedJurors.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#181b26] text-center border border-white/10 space-y-2">
            <span className="material-symbols-outlined text-[32px] text-[#968da1]">search_off</span>
            <p className="font-serif-court text-sm text-white">No jurors found matching query</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGuild('all');
              }}
              className="text-xs font-mono-ledger text-[#edbf70] underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredAndSortedJurors.map((juror, index) => {
            const successRate = calculateSuccessRate(juror);
            const badge = getJurorBadge(successRate);
            const isTop3 = index < 3;

            return (
              <div
                key={juror.id}
                onClick={() => setSelectedJuror(juror)}
                className={`p-3.5 rounded-xl transition-all border cursor-pointer flex flex-col gap-2.5 active:scale-[0.99] ${
                  juror.isCurrentUser
                    ? 'bg-[#1b2030] border-[#edbf70]/40 shadow-[0_4px_16px_rgba(237,191,112,0.1)]'
                    : 'bg-[#181b26] hover:bg-[#1d202e] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Numerical Rank Badge */}
                  <div className="shrink-0 flex items-center justify-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono-ledger text-xs font-bold ${
                        index === 0
                          ? 'bg-[#edbf70] text-black shadow-md'
                          : index === 1
                          ? 'bg-slate-300 text-black'
                          : index === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-[#272a35] text-[#cdc2d8]'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Avatar with Status Ring */}
                  <div className="relative shrink-0">
                    <img
                      src={juror.avatar}
                      alt={juror.name}
                      className="w-11 h-11 rounded-full object-cover border border-white/10"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0b0e18] flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Juror Identity, Name & Distinct Arbitration Badge */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-serif-court text-sm text-white font-semibold truncate">
                        {juror.name}
                      </span>

                      {/* DISTINCT BADGE ICON NEXT TO JUROR'S NAME */}
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono-ledger font-semibold border ${badge.bgColor} ${badge.borderColor} ${badge.textColor} ${badge.glowClass}`}
                        title={`${badge.label}: ${successRate}% Arbitration Success Rate (${juror.successfulArbitrations}/${juror.totalArbitrations})`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {badge.icon}
                        </span>
                        <span>{badge.shortLabel}</span>
                      </span>

                      {/* If current user */}
                      {juror.isCurrentUser && (
                        <span className="px-1.5 py-0.2 rounded bg-[#edbf70] text-black font-mono-ledger text-[10px] font-bold uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono-ledger text-xs text-[#cdc2d8] truncate">
                        {juror.handle}
                      </span>
                      <span className="text-[#4b4455]">•</span>
                      <span className="font-mono-ledger text-[11px] text-white/70">
                        {juror.guild}
                      </span>
                    </div>
                  </div>

                  {/* Score Pill */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-serif-court text-base text-white font-bold">
                        {juror.reputationScore}
                      </span>
                      <span className="font-mono-ledger text-[10px] text-[#cdc2d8]">/1000</span>
                    </div>
                    <span className="font-mono-ledger text-[10px] text-emerald-300 block">
                      Reputation
                    </span>
                  </div>
                </div>

                {/* Sub-metrics bar: Arbitrations count, Success Rate bar, Staked SOL */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono-ledger text-[#cdc2d8] flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    {/* Successful arbitrations */}
                    <span className="flex items-center gap-1 text-white font-medium">
                      <span className="material-symbols-outlined text-[14px] text-[#edbf70]">gavel</span>
                      {juror.successfulArbitrations}{' '}
                      <span className="text-[#cdc2d8] font-normal">/ {juror.totalArbitrations} cases</span>
                    </span>

                    {/* Success Rate */}
                    <span className={`flex items-center gap-1 font-bold ${badge.textColor}`}>
                      <span className="material-symbols-outlined text-[13px]">{badge.icon}</span>
                      {successRate}% win
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-white/90">
                      <span className="material-symbols-outlined text-[14px] text-white/70">lock</span>
                      {juror.stakedSol.toFixed(1)} SOL
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-[#cdc2d8]">chevron_right</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Juror Detailed Inspection Dossier Modal */}
      {selectedJuror && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#edbf70]">shield_person</span>
                <span className="font-serif-court text-base text-white font-semibold">
                  Judicial Dossier
                </span>
              </div>
              <button
                onClick={() => setSelectedJuror(null)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
                aria-label="Close dossier"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Juror Identity Card */}
            {(() => {
              const successRate = calculateSuccessRate(selectedJuror);
              const badge = getJurorBadge(successRate);

              return (
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={selectedJuror.avatar}
                        alt={selectedJuror.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${badge.bgColor} ${badge.borderColor} border flex items-center justify-center ${badge.textColor} ${badge.glowClass}`}
                      >
                        <span className="material-symbols-outlined text-[15px]">{badge.icon}</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-serif-court text-base text-white font-bold">
                          {selectedJuror.name}
                        </h3>
                        {selectedJuror.isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded bg-[#edbf70] text-black font-mono-ledger text-[10px] font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="font-mono-ledger text-xs text-[#cdc2d8] block">
                        {selectedJuror.handle} • {selectedJuror.tier}
                      </span>
                      {/* Distinct Badge Banner */}
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono-ledger font-semibold border ${badge.bgColor} ${badge.borderColor} ${badge.textColor} ${badge.glowClass}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {badge.icon}
                          </span>
                          {badge.label}
                        </span>
                        <span className="font-mono-ledger text-xs text-[#cdc2d8]">
                          Guild: {selectedJuror.guild}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Public Key Pill with Copy and Explorer */}
                  <div className="p-2.5 rounded-xl bg-[#0b0e18] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-[#cdc2d8]">key</span>
                      <span className="font-mono text-xs text-white truncate max-w-[220px]">
                        {selectedJuror.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyAddress(selectedJuror.address)}
                        className="p-1 rounded hover:bg-white/10 text-[#cdc2d8] hover:text-white transition-colors"
                        title="Copy Solana Address"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {copyFeedback === selectedJuror.address ? 'check' : 'content_copy'}
                        </span>
                      </button>
                      <a
                        href={`https://solscan.io/account/${selectedJuror.address}?cluster=devnet`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded hover:bg-white/10 text-[#cdc2d8] hover:text-white transition-colors"
                        title="View on Solscan"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>
                    </div>
                  </div>

                  {/* Detailed Performance Metric Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Reputation Score */}
                    <div className="p-3 rounded-xl bg-[#1c1f2a] border border-white/5">
                      <span className="font-mono-ledger text-[11px] text-[#cdc2d8] uppercase block">
                        Reputation Score
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-serif-court text-xl text-white font-bold">
                          {selectedJuror.reputationScore}
                        </span>
                        <span className="font-mono-ledger text-xs text-[#cdc2d8]">/ 1000</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                          style={{ width: `${(selectedJuror.reputationScore / 1000) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Arbitration Success Rate */}
                    <div className="p-3 rounded-xl bg-[#1c1f2a] border border-white/5">
                      <span className="font-mono-ledger text-[11px] text-[#cdc2d8] uppercase block">
                        Arbitration Success Rate
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`font-serif-court text-xl font-bold ${badge.textColor}`}>
                          {successRate}%
                        </span>
                        <span className="font-mono-ledger text-xs text-[#cdc2d8]">consensus</span>
                      </div>
                      <span className="font-mono-ledger text-[11px] text-[#cdc2d8] block mt-1">
                        {selectedJuror.successfulArbitrations} won / {selectedJuror.totalArbitrations} trials
                      </span>
                    </div>

                    {/* Staked Judicial Bond */}
                    <div className="p-3 rounded-xl bg-[#1c1f2a] border border-white/5">
                      <span className="font-mono-ledger text-[11px] text-[#cdc2d8] uppercase block">
                        Staked Bond
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-serif-court text-xl text-white font-bold">
                          {selectedJuror.stakedSol.toFixed(1)}
                        </span>
                        <span className="font-mono-ledger text-xs text-white/80">SOL</span>
                      </div>
                      <span className="font-mono-ledger text-[11px] text-emerald-300 block">
                        0 Slashes • 100% Secure
                      </span>
                    </div>

                    {/* Cumulative Fees Earned */}
                    <div className="p-3 rounded-xl bg-[#1c1f2a] border border-white/5">
                      <span className="font-mono-ledger text-[11px] text-[#cdc2d8] uppercase block">
                        Jury Yield Earned
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-serif-court text-xl text-white font-bold">
                          +{selectedJuror.yieldEarnedSol || 14.5}
                        </span>
                        <span className="font-mono-ledger text-xs text-white/80">SOL</span>
                      </div>
                      <span className="font-mono-ledger text-[11px] text-[#cdc2d8] block">
                        Avg verdict: {selectedJuror.avgResponseTime || '4.2m'}
                      </span>
                    </div>
                  </div>

                  {/* Certified Badges & Accolades */}
                  <div className="space-y-1.5">
                    <span className="font-mono-ledger text-xs text-[#cdc2d8] uppercase tracking-wider block">
                      Certified Judicial Accreditations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJuror.badges.map((b) => (
                        <span
                          key={b}
                          className="px-2.5 py-1 rounded-full bg-[#272a35] text-white font-mono-ledger text-[11px] border border-white/10 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[13px] text-[#edbf70]">
                            verified
                          </span>
                          {b}
                        </span>
                      ))}
                      <span
                        className={`px-2.5 py-1 rounded-full font-mono-ledger text-[11px] border ${badge.bgColor} ${badge.borderColor} ${badge.textColor} flex items-center gap-1`}
                      >
                        <span className="material-symbols-outlined text-[13px]">{badge.icon}</span>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedJuror(null)}
                      className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-mono-ledger text-xs font-semibold hover:bg-white/15"
                      type="button"
                    >
                      Close Dossier
                    </button>
                    {onOpenPeerChat && (
                      <button
                        onClick={() => {
                          setSelectedJuror(null);
                          onOpenPeerChat();
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold hover:bg-white/90 active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">forum</span>
                        Message Juror
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
