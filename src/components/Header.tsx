import React, { useState } from 'react';
import { TabType, WalletState } from '../types';

interface HeaderProps {
  activeTab: TabType;
  wallet?: WalletState;
  onOpenWallet?: () => void;
  onOpenTransactions?: () => void;
  transactionCount?: number;
  onOpenNotifications?: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  wallet,
  onOpenWallet,
  onOpenTransactions,
  transactionCount = 4,
  onOpenNotifications,
  notificationCount = 2,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const getSubTitle = () => {
    switch (activeTab) {
      case 'feed':
        return 'Dispute Feed';
      case 'escrows':
        return 'Freelance Escrows';
      case 'deliberate':
        return 'Deliberation Chamber';
      case 'archive':
        return 'Precedent Archive';
      case 'chamber':
        return 'Juror Guild Vault';
      default:
        return 'Protocol';
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-[#10131d]/90 backdrop-blur-xl pt-safe shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-white/5">
        <div className="h-16 px-3 sm:px-4 flex items-center justify-between relative max-w-lg mx-auto">
          {/* Logo & Emblem */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#323440] flex-shrink-0 shadow-sm border border-white/10 p-0.5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP-dma8wZpzE2S8gL-OjszCaRUhSv58_9U5X_gA_oJIMiYykGKDKhzVYjQVmlanvpgSBy-u7Ia8ThSKTGQhuwVHOwfUBupDVlDPGx0pYwNueHn_RvSyZwd0XoX5geb2qPTiLBhvmvsg-Ha33zKUuelx2p-Rdk6CiZJYUcDCwXcJHfWyZ-53W8uJNrx6C-UYTs8g32E_836A9Xp0p5xgOZV06Ae8FSF8aKPas4ODZDawLHOlnjuldya02NL5SrhQLstew"
                alt="LexIntent Emblem"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Centered Brand Title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="font-serif-court text-[1.2rem] text-white font-bold leading-none tracking-tight">
              LEXINTENT
            </span>
            <span className="font-mono-ledger text-[9px] sm:text-[10px] text-[#cdc2d8] tracking-widest uppercase mt-0.5">
              {getSubTitle()}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1">
            {/* Wallet Quick Connect Pill */}
            {onOpenWallet && (
              <button
                onClick={onOpenWallet}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181b26] hover:bg-[#272a35] border border-white/10 text-xs font-mono transition-colors"
                title="Solana Wallet Status"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    wallet?.connected ? 'bg-[#00ec91]' : 'bg-white/40'
                  }`}
                />
                <span className="text-[11px] font-semibold text-white">
                  {wallet?.connected
                    ? `${wallet.balance.toFixed(1)} SOL`
                    : 'Connect'}
                </span>
              </button>
            )}

            {/* Transactions Drawer Trigger */}
            {onOpenTransactions && (
              <button
                onClick={onOpenTransactions}
                aria-label="Transactions Ledger"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-[#cdc2d8] hover:text-white transition-colors relative hover:bg-white/5 active:scale-95"
                title="On-Chain Transactions"
              >
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                {transactionCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8a42f5] text-[9px] font-mono font-bold text-white flex items-center justify-center">
                    {transactionCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              aria-label="Notifications"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#cdc2d8] hover:text-white transition-colors relative hover:bg-white/5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white ring-2 ring-[#10131d]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#1c1f2a] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d5baff]">tune</span>
                <span className="font-serif-court text-lg text-white font-semibold">Chamber Settings</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181b26]">
                <span className="text-[#cdc2d8]">Solana Cluster</span>
                <span className="font-mono-ledger text-white font-semibold text-xs bg-white/10 px-2 py-0.5 rounded">MAINNET-BETA</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181b26]">
                <span className="text-[#cdc2d8]">Quorum Threshold</span>
                <span className="font-mono-ledger text-white font-semibold text-xs">66.7% Supermajority</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181b26]">
                <span className="text-[#cdc2d8]">Slash Guarantee Ratio</span>
                <span className="font-mono-ledger text-white font-semibold text-xs">10.0% Initial Escrow</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181b26]">
                <span className="text-[#cdc2d8]">Fast Finality Check</span>
                <span className="font-mono-ledger text-[#a0ffc3] font-semibold text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a0ffc3] animate-pulse"></span>
                  ENABLED (400ms)
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs uppercase font-bold tracking-wider hover:bg-white/90 active:scale-95 transition-transform"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
