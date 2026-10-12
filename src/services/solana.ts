import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction as SolanaTransaction,
  TransactionInstruction,
  clusterApiUrl,
} from '@solana/web3.js';
import bs58 from 'bs58';

export type NetworkType = 'devnet' | 'mainnet';

const LOCAL_KEYPAIR_KEY = 'lexintent_solana_keypair_secret';

// Memo Program ID on Solana
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export class SolanaService {
  private connection: Connection;
  private currentNetwork: NetworkType;
  private localKeypair: Keypair | null = null;

  constructor(network: NetworkType = 'devnet') {
    this.currentNetwork = network;
    const endpoint =
      network === 'devnet'
        ? clusterApiUrl('devnet')
        : clusterApiUrl('mainnet-beta');
    this.connection = new Connection(endpoint, 'confirmed');
    this.initLocalKeypair();
  }

  public setNetwork(network: NetworkType) {
    this.currentNetwork = network;
    const endpoint =
      network === 'devnet'
        ? clusterApiUrl('devnet')
        : clusterApiUrl('mainnet-beta');
    this.connection = new Connection(endpoint, 'confirmed');
  }

  public getNetwork(): NetworkType {
    return this.currentNetwork;
  }

  public getConnection(): Connection {
    return this.connection;
  }

  /**
   * Initializes or restores an in-browser Burner Keypair.
   * This gives ANY user a REAL Solana account immediately without needing an extension.
   */
  private initLocalKeypair(): Keypair {
    try {
      const stored = localStorage.getItem(LOCAL_KEYPAIR_KEY);
      if (stored) {
        const secret = bs58.decode(stored);
        this.localKeypair = Keypair.fromSecretKey(secret);
        return this.localKeypair;
      }
    } catch {
      // ignore
    }
    const newKp = Keypair.generate();
    try {
      localStorage.setItem(LOCAL_KEYPAIR_KEY, bs58.encode(newKp.secretKey));
    } catch {
      // ignore
    }
    this.localKeypair = newKp;
    return newKp;
  }

  public getLocalKeypair(): Keypair {
    if (!this.localKeypair) {
      return this.initLocalKeypair();
    }
    return this.localKeypair;
  }

  public getLocalPublicKey(): string {
    return this.getLocalKeypair().publicKey.toBase58();
  }

  public getLocalSecretKeyBase58(): string {
    return bs58.encode(this.getLocalKeypair().secretKey);
  }

  /**
   * Detects if Phantom or another Solana browser wallet extension is installed.
   */
  public hasExtensionWallet(): boolean {
    if (typeof window === 'undefined') return false;
    const anyWindow = window as any;
    return !!(anyWindow.solana?.isPhantom || anyWindow.solflare || anyWindow.solana);
  }

  /**
   * Connects to Phantom or browser extension wallet.
   */
  public async connectExtensionWallet(): Promise<{ publicKey: string; walletName: string }> {
    const anyWindow = window as any;
    if (anyWindow.solana) {
      const resp = await anyWindow.solana.connect();
      return {
        publicKey: resp.publicKey.toString(),
        walletName: anyWindow.solana.isPhantom ? 'Phantom' : 'Solana Wallet',
      };
    } else if (anyWindow.solflare) {
      await anyWindow.solflare.connect();
      return {
        publicKey: anyWindow.solflare.publicKey.toString(),
        walletName: 'Solflare',
      };
    }
    throw new Error('No Solana browser extension detected. You can use the built-in Instant Solana Wallet.');
  }

  /**
   * Fetches real live balance from Solana network in SOL.
   */
  public async getBalance(pubkeyStr: string): Promise<number> {
    try {
      const pubkey = new PublicKey(pubkeyStr);
      const lamports = await this.connection.getBalance(pubkey);
      return lamports / LAMPORTS_PER_SOL;
    } catch (err) {
      console.warn('Failed to fetch balance from Solana RPC:', err);
      return 0;
    }
  }

  /**
   * Requests real Devnet Airdrop of SOL.
   */
  public async requestAirdrop(pubkeyStr: string, amountSol: number = 1.0): Promise<string> {
    if (this.currentNetwork !== 'devnet') {
      throw new Error('Airdrops are only available on Solana Devnet.');
    }
    const pubkey = new PublicKey(pubkeyStr);
    const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
    const sig = await this.connection.requestAirdrop(pubkey, lamports);
    
    // Wait for confirmation
    const latestBlockhash = await this.connection.getLatestBlockhash();
    await this.connection.confirmTransaction({
      signature: sig,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });
    return sig;
  }

  /**
   * Sends a real on-chain transaction.
   * If wallet is an extension, prompts user to sign.
   * If using the in-app keypair, signs directly with keypair.
   * Includes both a System transfer or escrow intent memo recorded on-chain.
   */
  public async sendOnChainProtocolTransaction({
    fromPubkeyStr,
    toPubkeyStr,
    amountSol,
    actionMemo,
    isExtensionWallet = false,
  }: {
    fromPubkeyStr: string;
    toPubkeyStr?: string;
    amountSol?: number;
    actionMemo: string;
    isExtensionWallet?: boolean;
  }): Promise<{ signature: string; explorerUrl: string }> {
    const fromPubkey = new PublicKey(fromPubkeyStr);
    const transaction = new SolanaTransaction();

    // 1. If an amount is specified and destination exists, add transfer
    if (amountSol && amountSol > 0) {
      const destination = toPubkeyStr ? new PublicKey(toPubkeyStr) : fromPubkey;
      // Transfer lamports (at least dust or the amount)
      const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
      transaction.add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: destination,
          lamports,
        })
      );
    }

    // 2. Add Memo instruction so this LexIntent action is permanently written to Solana ledger
    const memoData = new TextEncoder().encode(actionMemo);
    transaction.add(
      new TransactionInstruction({
        keys: [{ pubkey: fromPubkey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: memoData as any,
      })
    );

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    let signature: string;

    const anyWindow = window as any;
    if (isExtensionWallet && anyWindow.solana) {
      // Sign with browser extension
      const signed = await anyWindow.solana.signAndSendTransaction(transaction);
      signature = signed.signature;
      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });
    } else {
      // Sign with in-app keypair
      const keypair = this.getLocalKeypair();
      signature = await this.connection.sendTransaction(transaction, [keypair]);
      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });
    }

    const clusterParam = this.currentNetwork === 'devnet' ? '?cluster=devnet' : '';
    const explorerUrl = `https://solscan.io/tx/${signature}${clusterParam}`;

    return { signature, explorerUrl };
  }
}

export const solanaService = new SolanaService('devnet');
