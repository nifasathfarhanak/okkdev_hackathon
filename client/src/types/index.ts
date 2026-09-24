export type DealStatus = 
  | 'CREATED'
  | 'DISCOVERING'
  | 'QUALIFYING'
  | 'QUOTING'
  | 'NEGOTIATING'
  | 'OFFER_SELECTED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'TRANSACTION_PENDING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'FAILED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  walletAddress?: string;
}

export interface AgentCapability {
  id: string;
  agentId: string;
  name: string;
  category: string;
  description: string;
  parameters: string;
}

export interface AgentReputation {
  id: string;
  agentId: string;
  overallScore: number;
  fulfillmentRate: number;
  cancellationRate: number;
  disputeRate: number;
  avgResponseMs: number;
  avgImprovementPct: number;
  totalCompletedDeals: number;
  totalVolumeTransacted: number;
  verificationTier: 'VERIFIED' | 'PLATFORM_OBSERVED' | 'SELF_REPORTED' | 'DEMO';
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'BUYER' | 'SUPPLIER' | 'SERVICE' | 'LOGISTICS' | 'PAYMENT' | 'DATA' | 'DEVELOPER';
  industry: string;
  endpoint: string;
  protocol: string;
  status: 'ACTIVE' | 'BUSY' | 'OFFLINE' | 'MAINTENANCE';
  verificationStatus: 'VERIFIED' | 'PLATFORM_OBSERVED' | 'SELF_REPORTED' | 'DEMO';
  pricingModel: string;
  supportedPayments: string;
  avgResponseTimeMs: number;
  capabilities: AgentCapability[];
  reputation?: AgentReputation;
  reputationBreakdown?: any;
}

export interface DealRequirement {
  id: string;
  dealId: string;
  productName: string;
  unitType: string;
  maxDeliveryDays: number;
  maxBudgetPerUnit: number;
  acceptableTerms: string;
  requiredCertifications: string;
  targetSpecs: string;
}

export interface Quote {
  id: string;
  dealId: string;
  agentId: string;
  price: number;
  unitPrice: number;
  currency: string;
  deliveryDays: number;
  terms: string;
  qualityGrade: string;
  validUntil: string;
  status: 'SUBMITTED' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'SUPERSEDED';
  notes?: string;
  agent: Agent;
}

export interface NegotiationMessage {
  id: string;
  negotiationId: string;
  round: number;
  senderAgentId: string;
  receiverAgentId: string;
  messageType: string;
  summary: string;
  payload: string;
  timestamp: string;
}

export interface Negotiation {
  id: string;
  dealId: string;
  buyerAgentId: string;
  sellerAgentId: string;
  status: string;
  currentRound: number;
  maxRounds: number;
  initialPrice: number;
  currentPrice: number;
  finalPrice?: number;
  initialDelivery: number;
  currentDelivery: number;
  finalDelivery?: number;
  aiStrategyReasoning?: string;
  buyerAgent: Agent;
  sellerAgent: Agent;
  messages: NegotiationMessage[];
}

export interface Approval {
  id: string;
  dealId: string;
  userId: string;
  supplierAgentId: string;
  proposedPrice: number;
  originalPrice: number;
  savingsAmount: number;
  currency: string;
  deliveryDays: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  decisionNotes?: string;
  requestedAt: string;
  decidedAt?: string;
  deal?: Deal;
  user?: User;
}

export interface Transaction {
  id: string;
  dealId: string;
  agentId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'AUTHORIZED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  network: string;
  txHash?: string;
  explorerUrl?: string;
  isDemo: boolean;
  paymentMethod: string;
  recipientAddress: string;
  createdAt: string;
  deal?: Deal;
  agent?: Agent;
  payment?: {
    id: string;
    provider: string;
    paymentIntentId: string;
    escrowStatus: string;
    releaseCondition: string;
  };
}

export interface ActivityLog {
  id: string;
  dealId?: string;
  actorType: 'BUYER_AGENT' | 'SUPPLIER_AGENT' | 'SYSTEM' | 'USER' | 'OKX_SERVICE';
  actorName: string;
  action: string;
  result: string;
  details?: string;
  requestId: string;
  timestamp: string;
}

export interface Deal {
  id: string;
  buyerId: string;
  title: string;
  description: string;
  productCategory: string;
  quantity: number;
  budget: number;
  currency: string;
  deadlineDays: number;
  status: DealStatus;
  preferredLocation: string;
  qualitySpecs?: string;
  selectedAgentId?: string;
  selectedQuoteId?: string;
  savingsAmount: number;
  savingsPct: number;
  createdAt: string;
  updatedAt: string;
  buyer?: User;
  selectedAgent?: Agent;
  requirement?: DealRequirement;
  quotes: Quote[];
  negotiations: Negotiation[];
  approvals: Approval[];
  transactions: Transaction[];
  activityLogs: ActivityLog[];
}

export interface NetworkStats {
  activeDeals: number;
  pendingApprovals: number;
  completedDeals: number;
  totalAgents: number;
  totalVolume: number;
  totalSavings: number;
  avgSavingsPct: number;
  avgNetworkReputation: number;
  uptimePct: number;
  a2aThroughputPerMin: number;
}
