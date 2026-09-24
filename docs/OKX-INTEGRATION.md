# OKX Ecosystem Integration Architecture & Technical Specifications
### DealMesh: The Agent-to-Agent Commerce Network

This document details the architectural specifications, schemas, endpoints, and behaviors implemented for the **OKX Dev Day 2026** hackathon (Track: Build a Company).

---

## 1. Directory Structure

The OKX integration layer is housed in:
- Root level: `integrations/okx/`
- Backend service level: `server/src/integrations/okx/`

```
integrations/okx/
├── okx-ai.ts           # OKX AI Tool function-calling definitions & execution engine
├── a2a.ts              # Agent-to-Agent (A2A) protocol schemas & session coordinator
├── payment.ts          # PaymentProvider abstraction (OKX Payment SDK & Mock provider)
├── agentic-wallet.ts   # ERC-4337 smart account session keys & human approval policy
└── xlayer.ts           # OKX X Layer L2 settlement adapter & explorer formatter
```

---

## 2. OKX AI Service (`okx-ai.ts`)

DealMesh exposes typed tool definitions allowing OKX AI Agents to discover suppliers, negotiate, and coordinate transactions.

### Registered Tools
1. `discover_agents`: Searches registry for supplier agents matching product keywords, budget, and delivery constraints.
2. `request_quote`: Dispatches formal A2A RFQ message.
3. `negotiate`: Runs multi-round game-theoretic counter-offers.
4. `get_reputation`: Fetches multi-dimensional reputation score and component breakdown.
5. `create_deal`: Initializes new buyer procurement requirement.
6. `request_approval`: Submits negotiated terms to human operator.
7. `execute_transaction`: Triggers OKX Escrow settlement after authorization.

### Endpoint
- `GET /api/integrations/okx/tools`: Returns tool schemas.
- `POST /api/integrations/okx/tools/execute`: Executes tool call with JSON parameters.

---

## 3. A2A Protocol (`a2a.ts`)

A2A protocol enables machine-to-machine communication without human chat UI limitations.

### Message Types
- `DISCOVERY`: Broadcast query across agent registry.
- `REQUEST_QUOTE`: Structured RFQ payload.
- `QUOTE`: Supplier pricing, lead times, quality certifications.
- `NEGOTIATE`: Buyer counter-offer with tactical rationale.
- `COUNTER_OFFER`: Supplier concession or firm counter.
- `ACCEPT_PENDING_HUMAN_APPROVAL`: Concluded agreement awaiting operator sign-off.
- `TRANSACTION_REQUEST` & `TRANSACTION_RESULT`: Escrow settlement coordination.

### A2A Endpoints
- `GET /api/a2a/agents`: Lists all active agents on the A2A bus.
- `GET /api/a2a/agents/:id`: Retrieves agent endpoint and capability manifest.
- `POST /api/a2a/discover`: Runs ontology capability search.
- `POST /api/a2a/request`: Dispatches structured quote request.
- `POST /api/a2a/quote`: Submits supplier quotation.
- `POST /api/a2a/negotiate`: Executes multi-round negotiation step.
- `POST /api/a2a/transaction`: Coordinates escrow settlement.

---

## 4. Payment & Escrow (`payment.ts`)

- **Provider Abstraction:** `PaymentProvider` interface with `OKXPaymentProvider` and `MockPaymentProvider`.
- **Smart Escrow Contract:** `0x32A465B15278453488fD76B133A183a241981F4B` on OKX X Layer Testnet.
- **Safety Policy:** Escrow releases funds only upon automated delivery verification or operator milestone release.

---

## 5. Agentic Wallet (`agentic-wallet.ts`)

- **Smart Account Standard:** ERC-4337 Account Abstraction.
- **Session Keys:** Time-bound, contract-restricted session keys.
- **Human-In-The-Loop Enforcement:** `maxTransactionWithoutApproval = 0` guarantees that autonomous agents cannot execute irreversible value transfers without explicit human confirmation.

---

## 6. X Layer L2 Settlement Adapter (`xlayer.ts`)

- **Network:** OKX X Layer Testnet (Sepolia)
- **Chain ID:** 195
- **RPC URL:** `https://xlayertestrpc.okx.com`
- **Block Explorer:** `https://www.oklink.com/xlayer-test`
- **Currency:** OKB (Gas) & USDC/USDT (Settlement)
