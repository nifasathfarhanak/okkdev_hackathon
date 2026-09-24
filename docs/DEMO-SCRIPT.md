# DEALMESH: Official Hackathon Video Demo Script
### OKX Dev Day 2026 — Track 1: Build a Company (Remote Build)
**Target Duration:** 2.5 – 3.5 Minutes

---

## ⏱️ Video Breakdown

### 0:00 – 0:20 | The Problem (Human Procurement Friction)
- **Visual:** Landing page (`/`) showing the hero headline: *"Don't search for businesses. Let your agent negotiate with theirs."*
- **Speaker:** 
  > "Welcome to DealMesh. Today, B2B procurement takes 2–3 weeks of email back-and-forth, opaque markups, and high counterparty risk. We built DealMesh for OKX Dev Day 2026 to bring autonomous Agent-to-Agent commerce to life — keeping the human in control."

---

### 0:20 – 0:40 | Creating a Purchase Requirement
- **Visual:** Click **"Launch 60s Demo"** or navigate to `/deals/new`.
- **Action:** Show the form filled with:
  - Product: *Laboratory Glass Reactor (100 units)*
  - Budget: *$10,000 USDC*
  - Required Delivery: *14 days*
  - Quality Spec: *ISO-9001, GMP Certified*
- **Speaker:**
  > "The buyer specifies their intent once. They define the product specifications, a budget ceiling of $10,000 USDC, and a 14-day delivery requirement. Clicking 'Launch Buyer Agent' spins up an autonomous procurement task."

---

### 0:40 – 1:00 | Autonomous Discovery on OKX Agent Mesh
- **Visual:** Deal Workspace (`/deals/:id`) entering `DISCOVERING` & `QUALIFYING` states.
- **Action:** Center timeline updates showing 10 agents searched and 3 qualified supplier agents (*PrecisionLab, LabCore, GlassWorks*).
- **Speaker:**
  > "The Buyer Agent immediately queries the OKX Agent Network registry. It matches capabilities, checks ISO-9001 certifications, and filters 3 qualified supplier agents ready to quote."

---

### 1:00 – 1:20 | Supplier Quotes Received
- **Visual:** Right sidebar populated with Quotes comparison table.
- **Action:** Point out *PrecisionLab Agent's* initial quote of `$10,500 USDC` at 8 days lead time.
- **Speaker:**
  > "Supplier agents return formal A2A quotations in milliseconds. PrecisionLab Agent quotes $10,500 USDC. Because this exceeds our target budget of $10,000, our Buyer Agent autonomously initiates multi-round A2A negotiation."

---

### 1:20 – 1:45 | Autonomous Multi-Round A2A Negotiation
- **Visual:** Live A2A Protocol Stream in center column. Toggle **"Inspect A2A Protocol JSON"**.
- **Action:** 
  - Show Round 1: Buyer Agent counters with `$9,800`. PrecisionLab counters with `$10,200`.
  - Show Round 2: Buyer Agent offers `$10,000`. PrecisionLab **ACCEPTS** ($10,000, 8 days delivery).
- **Speaker:**
  > "Notice the structured A2A JSON payloads. The agents run game-theoretic counter-offers. In Round 2, PrecisionLab accepts our exact $10,000 target budget with 8-day expedited air freight. Net savings: $500 USDC."

---

### 1:45 – 2:00 | Transparent Reputation Evaluation
- **Visual:** AI Reasoning Strategy card & navigate to `/reputation`.
- **Speaker:**
  > "DealMesh evaluates agent trustworthiness with transparent, non-fabricated metrics: 98.8% on-time fulfillment, 240ms response latency, and low dispute penalty. PrecisionLab earns a 96.5/100 verified score."

---

### 2:00 – 2:20 | Human-In-The-Loop Approval Gate (Safety)
- **Visual:** Approval Center (`/approvals`) and amber proposal card in Deal Workspace.
- **Action:** Review proposal card ($10,500 down to $10,000, $500 savings) and click **"APPROVE DEAL"**.
- **Speaker:**
  > "Here is our core safety principle: Autonomous agents negotiate, but zero funds move without human authorization. The operator sees the $500 savings, verifies the supplier reputation, and signs off."

---

### 2:20 – 2:45 | OKX Web3 Settlement & Smart Escrow Lock
- **Visual:** Click **"Execute OKX Escrow Settlement"** and navigate to `/transactions`.
- **Action:** Show funds locked in the OKX Escrow contract on OKX X Layer Testnet (Chain ID 195).
- **Speaker:**
  > "Upon approval, the OKX Agentic Smart Account executes the transaction via ERC-4337 session keys, locking $10,000 USDC into the OKX Smart Escrow contract on X Layer L2. The deal is marked COMPLETED with an immutable audit log."

---

### 2:45 – 3:10 | OKX Integrations & Developer Hub
- **Visual:** `/integrations/okx` and `/developer`.
- **Action:** Show the 5 live components (OKX AI Tools, A2A Protocol Bus, Payment SDK, Agentic Smart Account, and X Layer Settlement). Run a quick live tool execution in the UI console.
- **Speaker:**
  > "Under the hood, DealMesh provides 5 dedicated OKX integration modules, OpenAPI specifications, and an open A2A bus for third-party developers to register their own agents."

---

### 3:10 – 3:30 | Conclusion & Vision
- **Visual:** Return to `/hackathon` compliance matrix (10/10 requirements satisfied).
- **Speaker:**
  > "DealMesh transforms commerce from slow human search to instant agent negotiation. Built for OKX Dev Day 2026. Thank you."
