import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenFileDispute: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenFileDispute,
}) => {
  return (
    <>
      {/* Floating Action Button (FAB) for Create Escrow / File Dispute */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          onClick={onOpenFileDispute}
          aria-label="Create Escrow or File Dispute"
          className="w-13 h-13 sm:w-14 sm:h-14 bg-white text-black flex items-center justify-center rounded-full shadow-[0_8px_25px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95 transition-all border border-white/20 group"
        >
          <span className="material-symbols-outlined text-[26px] text-black font-semibold group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
        </button>
      </div>

      {/* 5-Tab Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#10131d]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1 sm:px-2 relative">
          {/* 1. Feed Tab */}
          <button
            onClick={() => onChangeTab('feed')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 relative ${
              activeTab === 'feed'
                ? 'text-white font-semibold'
                : 'text-[#cdc2d8] hover:text-white'
            }`}
            aria-label="Feed Tab"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: activeTab === 'feed' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              article
            </span>
            <span
              className={`font-mono-ledger text-[9px] sm:text-[10px] tracking-wider uppercase ${
                activeTab === 'feed' ? 'text-white font-bold' : 'font-medium'
              }`}
            >
              Feed
            </span>
            {activeTab === 'feed' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>

          {/* 2. Escrows Tab (From Vercel App) */}
          <button
            onClick={() => onChangeTab('escrows')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 relative ${
              activeTab === 'escrows'
                ? 'text-white font-semibold'
                : 'text-[#cdc2d8] hover:text-white'
            }`}
            aria-label="Escrows Tab"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: activeTab === 'escrows' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              handshake
            </span>
            <span
              className={`font-mono-ledger text-[9px] sm:text-[10px] tracking-wider uppercase ${
                activeTab === 'escrows' ? 'text-white font-bold' : 'font-medium'
              }`}
            >
              Escrows
            </span>
            {activeTab === 'escrows' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>

          {/* 3. Deliberate Tab */}
          <button
            onClick={() => onChangeTab('deliberate')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 relative ${
              activeTab === 'deliberate'
                ? 'text-white font-semibold'
                : 'text-[#cdc2d8] hover:text-white'
            }`}
            aria-label="Deliberate Tab"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: activeTab === 'deliberate' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              balance
            </span>
            <span
              className={`font-mono-ledger text-[9px] sm:text-[10px] tracking-wider uppercase ${
                activeTab === 'deliberate' ? 'text-white font-bold' : 'font-medium'
              }`}
            >
              Deliberate
            </span>
            {activeTab === 'deliberate' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>

          {/* 4. Archive Tab */}
          <button
            onClick={() => onChangeTab('archive')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 relative ${
              activeTab === 'archive'
                ? 'text-white font-semibold'
                : 'text-[#cdc2d8] hover:text-white'
            }`}
            aria-label="Archive Tab"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: activeTab === 'archive' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              menu_book
            </span>
            <span
              className={`font-mono-ledger text-[9px] sm:text-[10px] tracking-wider uppercase ${
                activeTab === 'archive' ? 'text-white font-bold' : 'font-medium'
              }`}
            >
              Archive
            </span>
            {activeTab === 'archive' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>

          {/* 5. Chamber Tab */}
          <button
            onClick={() => onChangeTab('chamber')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 relative ${
              activeTab === 'chamber'
                ? 'text-white font-semibold'
                : 'text-[#cdc2d8] hover:text-white'
            }`}
            aria-label="Chamber Tab"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: activeTab === 'chamber' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              account_balance
            </span>
            <span
              className={`font-mono-ledger text-[9px] sm:text-[10px] tracking-wider uppercase ${
                activeTab === 'chamber' ? 'text-white font-bold' : 'font-medium'
              }`}
            >
              Chamber
            </span>
            {activeTab === 'chamber' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
