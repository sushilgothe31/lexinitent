export type TabType = 'feed' | 'escrows' | 'deliberate' | 'archive' | 'chamber';

export interface Agreement {
  id: string; // e.g. 'escrow-001'
  client: string;
  freelancer: string;
  amount: number;
  intentText: string;
  state: 'Active' | 'Disputed' | 'Completed' | 'ResolvedClient' | 'ResolvedFreelancer';
  createdAt: number;
  disputeStartedAt: number | null;
  commitCount: number;
  revealCount: number;
  votesClient: number;
  votesFreelancer: number;
}

export interface JurorStake {
  id: string;
  staker: string;
  stakeAmount: number;
  isActive: boolean;
}

export interface JurorLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  address: string;
  title: string;
  tier: string;
  reputationScore: number; // e.g. 998 / 1000
  successfulArbitrations: number; // e.g. 420
  totalArbitrations: number; // e.g. 426
  consensusRate: number; // e.g. 98.7%
  stakedSol: number; // e.g. 150
  guild: 'Smart Escrow' | 'Protocol Security' | 'IP & Code' | 'Appeals Bench' | 'General';
  badges: string[];
  isCurrentUser?: boolean;
  solanaBlockHeight?: number;
  avgResponseTime?: string;
  yieldEarnedSol?: number;
}

export interface VoteRecord {
  id: string;
  juror: string;
  escrowId: string;
  voteHash: string;
  revealed: boolean;
  vote: 0 | 1 | null; // 0: Client, 1: Freelancer
}

export interface Transaction {
  id: string;
  type:
    | 'create_escrow'
    | 'accept_work'
    | 'file_dispute'
    | 'stake_for_jury'
    | 'commit_vote'
    | 'reveal_vote'
    | 'airdrop'
    | 'transfer';
  status: 'success' | 'pending' | 'error';
  signature: string;
  timestamp: number;
  description: string;
  amount?: number;
  explorerUrl?: string;
}

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number;
  network: 'mainnet' | 'devnet';
  walletName: string;
  isRealWallet?: boolean;
  secretKeyBase58?: string;
}

export interface Party {
  username: string;
  avatar: string;
  role: string;
  claimSynopsis: string;
  address?: string;
}

export interface Docket {
  id: string; // e.g. '#LX-9014'
  title: string;
  subtitle?: string;
  category: 'Smart Escrow' | 'IP & Code' | 'DAO Governance' | 'Protocol Security' | 'Appeals Bench';
  solAmount: number;
  usdAmount: number;
  timeRemaining: string;
  status: 'Active Deliberation' | 'Bench Hearing' | 'Finalized' | 'Dismissed';
  exhibitName: string;
  exhibitImage: string;
  claimant: Party;
  respondent: Party;
  evidenceSummary: string;
  reporter?: {
    name: string;
    avatar: string;
    handle: string;
    title: string;
  };
  audioDeposition?: {
    title: string;
    speaker: string;
    duration: string;
  };
  stats: {
    gavels: number;
    comments: number;
    stakedSol: number;
    quorumReq: number;
    quorumCurrent: number;
    devVotesPercent: number;
    clientVotesPercent: number;
  };
  hasVoted?: 'claimant' | 'contractor' | 'abstained';
  bookmarked?: boolean;
}

export interface Precedent {
  id: string;
  title: string;
  category: 'Smart Escrow' | 'IP & Code' | 'DAO Governance' | 'Appeals Bench';
  summary: string;
  verdict: string;
  verdictType: 'unanimous' | 'majority' | 'dismissed' | 'mediated';
  solSettled: number;
  settledTime: string;
  solanaBlock: string;
  dossierVolume?: string;
  leadJurist: {
    name: string;
    handle: string;
    avatar: string;
    sig: string;
  };
  panelJurists?: string[];
  fullMemorandum?: string;
}

export interface EmergencyStory {
  id: string;
  title: string;
  icon: string;
  badge: string;
  docketId: string;
  urgency: 'high' | 'critical' | 'standard';
  description: string;
  poolValue: string;
}
