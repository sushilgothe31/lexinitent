import React, { useState } from 'react';
import { WalletState } from '../types';
import { solanaService } from '../services/solana';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnectExtension: () => Promise<void>;
  onConnectLocalKeypair: () => void;
  onRequestAirdrop: () => Promise<void>;
  onRefreshBalance: () => Promise<void>;
  onToggleNetwork: (network: 'mainnet' | 'devnet') => void;
  onDisconnect: () => void;
  isAirdropping?: boolean;
  isRefreshing?: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnectExtension,
  onConnectLocalKeypair,
  onRequestAirdrop,
  onRefreshBalance,
  onToggleNetwork,
  onDisconnect,
  isAirdropping = false,
  isRefreshing = false,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  if (!isOpen) return null;

  const hasExtension = solanaService.hasExtensionWallet();

  const handleCopyPubkey = () => {
    if (wallet.publicKey && navigator.clipboard) {
      navigator.clipboard.writeText(wallet.publicKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleCopySecretKey = () => {
    if (wallet.secretKeyBase58 && navigator.clipboard) {
      navigator.clipboard.writeText(wallet.secretKeyBase58);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2500);
    }
  };

  const handleExtensionConnect = async () => {
    try {
      setConnectError(null);
      await onConnectExtension();
      onClose();
    } catch (err: any) {
      setConnectError(err.message || 'Failed to connect extension wallet');
    }
  };

  const handleLocalConnect = () => {
    setConnectError(null);
    onConnectLocalKeypair();
    onClose();
  };

  const clusterParam = wallet.network === 'devnet' ? '?cluster=devnet' : '';
  const explorerUrl = wallet.publicKey
    ? `https://solscan.io/account/${wallet.publicKey}${clusterParam}`
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181b26] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a0ffc3] text-[22px]">
              account_balance_wallet
            </span>
            <span className="font-serif-court text-base text-white font-semibold">
              Solana On-Chain Wallet
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Network Cluster Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1c1f2a] border border-white/5 text-xs font-mono">
          <span className="text-[#cdc2d8] flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                wallet.network === 'devnet' ? 'bg-[#00ec91]' : 'bg-[#edbf70]'
              }`}
            />
            Cluster:
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onToggleNetwork('devnet')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                wallet.network === 'devnet'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#cdc2d8] hover:text-white'
              }`}
            >
              Devnet
            </button>
            <button
              onClick={() => onToggleNetwork('mainnet')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                wallet.network === 'mainnet'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#cdc2d8] hover:text-white'
              }`}
            >
              Mainnet
            </button>
          </div>
        </div>

        {connectError && (
          <div className="p-2.5 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-mono">
            {connectError}
          </div>
        )}

        {/* Connected Wallet Info */}
        {wallet.connected && wallet.publicKey ? (
          <div className="p-4 rounded-xl bg-[#0b0e18] border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#a0ffc3] flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00ec91] animate-pulse"></span>
                {wallet.walletName}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onRefreshBalance}
                  disabled={isRefreshing}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white"
                  title="Refresh Balance from Solana RPC"
                >
                  <span
                    className={`material-symbols-outlined text-[14px] ${
                      isRefreshing ? 'animate-spin' : ''
                    }`}
                  >
                    refresh
                  </span>
                </button>
                <span className="font-bold text-white text-sm">
                  {wallet.balance.toFixed(4)} SOL
                </span>
              </div>
            </div>

            {/* Public Key Display */}
            <div className="p-2 rounded-lg bg-[#181b26] border border-white/5 flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#cdc2d8] truncate" title={wallet.publicKey}>
                {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-6)}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleCopyPubkey}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {copiedKey ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded bg-[#8a42f5]/20 hover:bg-[#8a42f5]/30 text-[#d5baff] text-[10px] flex items-center gap-1"
                >
                  <span>Solscan</span>
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>
              </div>
            </div>

            {/* Airdrop Button (Devnet) */}
            {wallet.network === 'devnet' && (
              <button
                onClick={onRequestAirdrop}
                disabled={isAirdropping}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00ec91] to-[#a0ffc3] hover:opacity-95 text-black font-mono-ledger text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-95 transition-all"
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    isAirdropping ? 'animate-spin' : ''
                  }`}
                >
                  {isAirdropping ? 'sync' : 'toll'}
                </span>
                <span>
                  {isAirdropping ? 'Requesting 1 SOL...' : 'Airdrop 1.0 SOL (Devnet)'}
                </span>
              </button>
            )}

            {/* Private key backup toggle if local burner keypair */}
            {wallet.secretKeyBase58 && (
              <div className="pt-1">
                <button
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="text-[10px] text-[#968da1] hover:text-white flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[12px]">key</span>
                  <span>{showSecretKey ? 'Hide Secret Key' : 'Show Private Key Backup'}</span>
                </button>
                {showSecretKey && (
                  <div className="mt-1.5 p-2 rounded bg-red-950/20 border border-red-500/20 space-y-1">
                    <p className="text-[9px] text-[#ffb4ab]">
                      Do not share this key with anyone.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/80 font-mono truncate max-w-[190px]">
                        {wallet.secretKeyBase58}
                      </span>
                      <button
                        onClick={handleCopySecretKey}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[9px] text-white flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[10px]">
                          {copiedSecret ? 'check' : 'content_copy'}
                        </span>
                        <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onDisconnect}
              className="w-full py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 font-mono-ledger text-xs font-semibold transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          /* Connection Options */
          <div className="space-y-2.5">
            <span className="text-xs font-mono-ledger text-[#cdc2d8] block">
              Choose a connection method:
            </span>

            {/* 1. Phantom / Solflare Extension */}
            <button
              onClick={handleExtensionConnect}
              className="w-full p-3 rounded-xl bg-[#1c1f2a] hover:bg-[#272a35] border border-white/10 flex items-center justify-between transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ab9ff2]/20 flex items-center justify-center text-[#ab9ff2]">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-ledger text-xs font-bold text-white">
                      Phantom / Browser Wallet
                    </span>
                    {hasExtension && (
                      <span className="px-1.5 py-0.2 rounded bg-[#00ec91]/20 text-[#a0ffc3] text-[9px] font-bold">
                        Detected
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#968da1]">
                    {hasExtension
                      ? 'Click to connect browser extension'
                      : 'Browser extension (Phantom/Solflare)'}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#cdc2d8] group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            {/* 2. Instant Built-in Solana Keypair */}
            <button
              onClick={handleLocalConnect}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-[#181b26] to-[#1c1f2a] hover:bg-[#272a35] border border-[#a0ffc3]/30 flex items-center justify-between transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00ec91]/20 flex items-center justify-center text-[#00ec91]">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-ledger text-xs font-bold text-white">
                      Instant On-Chain Keypair
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-white text-[9px] font-bold">
                      Recommended
                    </span>
                  </div>
                  <span className="text-[10px] text-[#968da1]">
                    Zero setup • Real Solana address with 1-click Devnet SOL
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#cdc2d8] group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white text-black font-mono-ledger text-xs font-bold uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
