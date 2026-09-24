"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const prisma_1 = require("./prisma");
async function seed() {
    console.log('🌱 Seeding AgentMirror Database for OKX Dev Day 2026...');
    // 1. Clear existing data safely
    try {
        await prisma_1.prisma.notification.deleteMany();
        await prisma_1.prisma.webhookEvent.deleteMany();
        await prisma_1.prisma.apiKey.deleteMany();
        await prisma_1.prisma.a2ASession.deleteMany();
        await prisma_1.prisma.integration.deleteMany();
        await prisma_1.prisma.activityLog.deleteMany();
        await prisma_1.prisma.calibration.deleteMany();
        await prisma_1.prisma.actualOutcome.deleteMany();
        await prisma_1.prisma.execution.deleteMany();
        await prisma_1.prisma.approval.deleteMany();
        await prisma_1.prisma.decisionBrief.deleteMany();
        await prisma_1.prisma.counterChallenge.deleteMany();
        await prisma_1.prisma.scenarioOutcome.deleteMany();
        await prisma_1.prisma.scenario.deleteMany();
        await prisma_1.prisma.simulationRun.deleteMany();
        await prisma_1.prisma.simulationVariable.deleteMany();
        await prisma_1.prisma.simulation.deleteMany();
        await prisma_1.prisma.plan.deleteMany();
        await prisma_1.prisma.intent.deleteMany();
        await prisma_1.prisma.agentCapability.deleteMany();
        await prisma_1.prisma.agent.deleteMany();
        await prisma_1.prisma.user.deleteMany();
    }
    catch (e) {
        console.log('Cleanup warning:', e);
    }
    // 2. Create Users
    const primaryUser = await prisma_1.prisma.user.create({
        data: {
            email: 'operator@biotech-labs.ai',
            name: 'Dr. Elena Rostova',
            role: 'DECISION_OPERATOR',
            company: 'Apex BioSynthetics Inc.',
            walletAddress: '0x4F79F447dC4E4c86F38E22217c7689A977e2F6A1'
        }
    });
    // 3. Create Seed Agents (Suppliers, Logistics, Payment, Data, Reviewer)
    const agentsData = [
        {
            id: 'agent-supplier-a',
            name: 'Supplier A (LabCore Precision)',
            description: 'Standard 3.3 Borosilicate double-jacketed laboratory glass reactors fabricator with high base capacity but single-point road logistics.',
            type: 'SUPPLIER',
            industry: 'Laboratory Equipment & Glassware',
            endpoint: '/api/a2a/agents/agent-supplier-a',
            protocol: 'OKX-A2A/1.0',
            status: 'ACTIVE',
            verificationStatus: 'VERIFIED',
            avgResponseTimeMs: 240,
            historicalReliability: 91.2,
            avgFulfillmentDays: 12.0,
            isAutonomous: true,
            capabilities: [
                { name: 'BOROSILICATE_REACTOR_SUPPLY', category: 'Manufacturing', description: 'Supply 10L-100L lab reactors with PTFE discharge valves.', parameters: '{}' },
                { name: 'VOLUME_DISCOUNTING', category: 'Commerce', description: 'Tiered wholesale pricing for orders above 50 units.', parameters: '{}' }
            ]
        },
        {
            id: 'agent-supplier-b',
            name: 'Supplier B (AeroGlass Ultra)',
            description: 'Premium expedited labware manufacturer with dedicated air freight dispatch and guaranteed sub-7 day turnaround.',
            type: 'SUPPLIER',
            industry: 'Expedited Scientific Hardware',
            endpoint: '/api/a2a/agents/agent-supplier-b',
            protocol: 'OKX-A2A/1.0',
            status: 'ACTIVE',
            verificationStatus: 'VERIFIED',
            avgResponseTimeMs: 180,
            historicalReliability: 98.4,
            avgFulfillmentDays: 6.0,
            isAutonomous: true,
            capabilities: [
                { name: 'EXPEDITED_REACTOR_FULFILLMENT', category: 'Manufacturing', description: 'Priority cleanroom fabrication and next-flight-out dispatch.', parameters: '{}' },
                { name: 'ISO9001_CERTIFIED', category: 'Quality', description: 'Cryptographically signed calibration and batch QA certificates.', parameters: '{}' }
            ]
        },
        {
            id: 'agent-supplier-c',
            name: 'Supplier C (BioGlass Global)',
            description: 'High-volume international manufacturer offering aggressive price negotiation for bulk commitments.',
            type: 'SUPPLIER',
            industry: 'High-Volume Glassware',
            endpoint: '/api/a2a/agents/agent-supplier-c',
            protocol: 'OKX-A2A/1.0',
            status: 'ACTIVE',
            verificationStatus: 'PLATFORM_OBSERVED',
            avgResponseTimeMs: 310,
            historicalReliability: 92.5,
            avgFulfillmentDays: 8.0,
            isAutonomous: true,
            capabilities: [
                { name: 'DYNAMIC_A2A_NEGOTIATION', category: 'Commerce', description: 'Interactive multi-round discount matching down to minimum reserve price.', parameters: '{}' }
            ]
        },
        {
            id: 'agent-logistics-fast',
            name: 'LogiFast Express Network',
            description: 'Dedicated shock-isolated cold-chain and glassware freight network with GPS IoT telematics.',
            type: 'LOGISTICS',
            industry: 'Specialized Cargo',
            endpoint: '/api/a2a/agents/agent-logistics-fast',
            protocol: 'OKX-A2A/1.0',
            status: 'ACTIVE',
            verificationStatus: 'VERIFIED',
            avgResponseTimeMs: 140,
            historicalReliability: 97.6,
            avgFulfillmentDays: 3.5,
            isAutonomous: true,
            capabilities: [
                { name: 'FRAGILE_GLASS_ROUTING', category: 'Logistics', description: 'Pneumatic suspension air and road routing with zero drop-shock guarantees.', parameters: '{}' }
            ]
        },
        {
            id: 'agent-okx-settlement',
            name: 'OKX Smart Settlement Agent',
            description: 'Native OKX Web3 settlement agent managing multi-sig escrow, ERC-4337 session policies, and instant disbursement.',
            type: 'PAYMENT',
            industry: 'Financial Infrastructure',
            endpoint: '/api/a2a/agents/agent-okx-settlement',
            protocol: 'OKX-A2A/1.0',
            status: 'ACTIVE',
            verificationStatus: 'VERIFIED',
            avgResponseTimeMs: 95,
            historicalReliability: 99.9,
            avgFulfillmentDays: 0.1,
            isAutonomous: true,
            capabilities: [
                { name: 'PROGRAMMABLE_ESCROW_LOCK', category: 'Settlement', description: 'Conditional escrow locking on OKX X Layer.', parameters: '{}' }
            ]
        },
        {
            id: 'agent-counter-adversary',
            name: 'AgentMirror Counter-Agent',
            description: 'Adversarial decision reviewer engineered to find failure modes, question optimistic assumptions, and stress-test agent plans.',
            type: 'REVIEWER',
            industry: 'Decision Intelligence',
            endpoint: '/api/a2a/agents/agent-counter-adversary',
            protocol: 'OKX-A2A/1.0',
            status: 'ACTIVE',
            verificationStatus: 'VERIFIED',
            avgResponseTimeMs: 110,
            historicalReliability: 99.5,
            avgFulfillmentDays: 0.1,
            isAutonomous: true,
            capabilities: [
                { name: 'ADVERSARIAL_ASSUMPTION_AUDIT', category: 'Analysis', description: 'Deconstructs plans into falsifiable assumptions and generates targeted stress tests.', parameters: '{}' },
                { name: 'FAILURE_MODE_SYNTHESIS', category: 'Simulation', description: 'Quantifies downside exposure under correlated cascading failure scenarios.', parameters: '{}' }
            ]
        }
    ];
    for (const aData of agentsData) {
        const { capabilities, ...rest } = aData;
        const createdAgent = await prisma_1.prisma.agent.create({
            data: {
                ...rest,
                ownerId: primaryUser.id
            }
        });
        if (capabilities) {
            for (const cap of capabilities) {
                await prisma_1.prisma.agentCapability.create({
                    data: {
                        agentId: createdAgent.id,
                        ...cap
                    }
                });
            }
        }
    }
    // 4. Seed Integrations
    const integrationsData = [
        {
            name: 'OKX_AI',
            serviceName: 'OKX AI Tool Protocol & Agent Gateway',
            endpoint: '/api/integrations/okx/ai',
            connectionStatus: 'DEMO',
            requestsHandled: 420,
            environment: 'Sandbox / Testnet',
            network: 'OKX X Layer Sepolia'
        },
        {
            name: 'OKX_A2A',
            serviceName: 'OKX A2A Agent Communication Bus',
            endpoint: '/api/a2a',
            connectionStatus: 'DEMO',
            requestsHandled: 1240,
            environment: 'Sandbox / Testnet',
            network: 'OKX Agent Mesh v1.0'
        },
        {
            name: 'OKX_PAYMENT',
            serviceName: 'OKX Payment SDK & Smart Escrow Protocol',
            endpoint: '/api/integrations/okx/payment',
            connectionStatus: 'DEMO',
            requestsHandled: 310,
            environment: 'Sandbox / Testnet',
            network: 'OKX X Layer Testnet'
        },
        {
            name: 'AGENTIC_WALLET',
            serviceName: 'OKX ERC-4337 Agentic Smart Account Session Bridge',
            endpoint: '/api/integrations/okx/wallet',
            connectionStatus: 'DEMO',
            requestsHandled: 285,
            environment: 'Sandbox / Testnet',
            network: 'OKX X Layer Testnet'
        },
        {
            name: 'XLAYER',
            serviceName: 'OKX X Layer Settlement Bridge',
            endpoint: 'https://xlayertestrpc.okx.com',
            connectionStatus: 'DEMO',
            requestsHandled: 190,
            environment: 'X Layer Sepolia (Chain ID 195)',
            network: 'X Layer Testnet'
        }
    ];
    for (const intg of integrationsData) {
        await prisma_1.prisma.integration.create({ data: intg });
    }
    // 5. Seed Simulation Variables
    const simVars = [
        { name: 'supplierDelayProb', label: 'Supplier Delay Probability', currentVal: 15.0, minVal: 0.0, maxVal: 50.0, unit: '%', description: 'Modeled likelihood that a supplier experiences factory batch hold-ups' },
        { name: 'priceVolatility', label: 'Price Volatility Band', currentVal: 8.0, minVal: 0.0, maxVal: 30.0, unit: '%', description: 'Estimated variance in spot raw material pricing during order finalization' },
        { name: 'logisticsReliability', label: 'Logistics Reliability', currentVal: 92.0, minVal: 50.0, maxVal: 100.0, unit: '%', description: 'Percentage of freight runs arriving without customs or corridor disruption' },
        { name: 'negotiationSuccessRate', label: 'Negotiation Acceptance Rate', currentVal: 75.0, minVal: 10.0, maxVal: 100.0, unit: '%', description: 'Modeled acceptance rate when requesting volume counter-offers from suppliers' },
        { name: 'demandPressure', label: 'Supply Chain Demand Index', currentVal: 20.0, minVal: 0.0, maxVal: 100.0, unit: '%', description: 'Market competitor demand pressure creating queue contention' }
    ];
    for (const sv of simVars) {
        await prisma_1.prisma.simulationVariable.create({ data: sv });
    }
    // 6. Seed Primary Demo Intent: "Purchase 100 laboratory glass reactors. Budget: 10,000 USDC. Delivery: 14 days."
    const demoIntent = await prisma_1.prisma.intent.create({
        data: {
            id: 'intent-demo-reactors-01',
            userId: primaryUser.id,
            title: 'Purchase 100 Laboratory Glass Reactors',
            description: 'Procurement order for 100 units of double-jacketed borosilicate laboratory glass reactors with PTFE drain valves, temperature range -80°C to 200°C. Budget cap 10,000 USDC, strict delivery deadline 14 days.',
            productCategory: 'Laboratory Equipment & Glassware',
            quantity: 100,
            budget: 10000.0,
            currency: 'USDC',
            deadlineDays: 14,
            status: 'DECISION_READY',
            targetSpecs: JSON.stringify({
                material: '3.3 Borosilicate Glass',
                capacity: '50 Liters',
                jacketType: 'Double Jacketed',
                certsRequired: ['ISO9001', 'GMP-Ready'],
                deadlineStrictDays: 14
            })
        }
    });
    // 7. Seed 4 Competing Plans for Demo Intent
    const planA = await prisma_1.prisma.plan.create({
        data: {
            id: 'plan-a-single-source',
            intentId: demoIntent.id,
            planKey: 'PLAN_A',
            name: 'Plan A: Direct Sourcing via Supplier A',
            description: 'Single-source procurement from Supplier A (LabCore Precision). Lowest catalog list price but relies on standard ground transport.',
            strategy: 'SINGLE_SOURCE',
            costAmount: 9400.0,
            currency: 'USDC',
            expectedDeliveryDays: 12,
            coordinationComplexity: 'LOW',
            baseSuccessRate: 74.0,
            assumptionsJson: JSON.stringify([
                'Supplier A factory line operates without maintenance hold-ups',
                'Standard ground logistics route remains open without regional customs delay',
                'Batch passes single-pass factory inspection'
            ]),
            candidateSuppliers: JSON.stringify(['Supplier A (LabCore Precision)']),
            status: 'SIMULATED'
        }
    });
    const planB = await prisma_1.prisma.plan.create({
        data: {
            id: 'plan-b-expedited-b',
            intentId: demoIntent.id,
            planKey: 'PLAN_B',
            name: 'Plan B: Priority Expedited via Supplier B',
            description: 'Procurement from Supplier B (AeroGlass Ultra) utilizing dedicated air freight. Uses full budget but has near-zero delivery delay risk.',
            strategy: 'EXPEDITED',
            costAmount: 10000.0,
            currency: 'USDC',
            expectedDeliveryDays: 6,
            coordinationComplexity: 'LOW',
            baseSuccessRate: 91.0,
            assumptionsJson: JSON.stringify([
                'Supplier B air cargo slot is reserved within 24h',
                'Zero customs buffer required under pre-cleared air waybill'
            ]),
            candidateSuppliers: JSON.stringify(['Supplier B (AeroGlass Ultra)']),
            status: 'SELECTED'
        }
    });
    const planC = await prisma_1.prisma.plan.create({
        data: {
            id: 'plan-c-negotiated-c',
            intentId: demoIntent.id,
            planKey: 'PLAN_C',
            name: 'Plan C: Dynamic A2A Negotiation with Supplier C',
            description: 'Engage Supplier C (BioGlass Global) in automated multi-round counter-offer negotiation to achieve target discount.',
            strategy: 'NEGOTIATED',
            costAmount: 9800.0,
            currency: 'USDC',
            expectedDeliveryDays: 8,
            coordinationComplexity: 'MEDIUM',
            baseSuccessRate: 87.0,
            assumptionsJson: JSON.stringify([
                'Supplier C accepts negotiated price of $98/unit',
                'Supplier C can fulfill all 100 units from a single production run',
                'Single logistics corridor operates at baseline 92% reliability'
            ]),
            candidateSuppliers: JSON.stringify(['Supplier C (BioGlass Global)']),
            status: 'CHALLENGED'
        }
    });
    const planD = await prisma_1.prisma.plan.create({
        data: {
            id: 'plan-d-split-dual',
            intentId: demoIntent.id,
            planKey: 'PLAN_D',
            name: 'Plan D: Dual-Supplier Split Sourcing (A + B)',
            description: 'Order 60 units from Supplier A for cost savings and 40 units from Supplier B for rapid buffer fulfillment.',
            strategy: 'DUAL_SOURCE',
            costAmount: 9600.0,
            currency: 'USDC',
            expectedDeliveryDays: 9,
            coordinationComplexity: 'HIGH',
            baseSuccessRate: 82.0,
            assumptionsJson: JSON.stringify([
                'Coordination overhead of 2 separate smart contracts and logistics tracking',
                'Reconciliation of two distinct manufacturer serial number formats'
            ]),
            candidateSuppliers: JSON.stringify(['Supplier A (LabCore Precision)', 'Supplier B (AeroGlass Ultra)']),
            status: 'SIMULATED'
        }
    });
    // 8. Seed Primary Simulation `AM-00182` with 4,000 Scenarios
    const demoSimulation = await prisma_1.prisma.simulation.create({
        data: {
            id: 'sim-demo-00182',
            intentId: demoIntent.id,
            simulationCode: 'AM-00182',
            status: 'COMPLETED',
            iterations: 4000,
            seed: 4289,
            assumptionsJson: JSON.stringify({
                budgetLimit: 10000,
                deadlineDays: 14,
                supplierDelayProb: 15,
                priceVolatility: 8,
                logisticsReliability: 92,
                negotiationSuccessRate: 75
            }),
            variablesJson: JSON.stringify({
                runsPerPlan: 1000,
                scenariosTested: 5,
                distributionModel: 'Monte Carlo with Seeded Mersenne Twister'
            }),
            preferredPlanKey: 'PLAN_B',
            preferenceReason: 'Plan B provides highest simulated reliability (91%) and fastest delivery (P50: 6 days, P90: 8 days) while strictly meeting the 10,000 USDC budget cap.',
            completedAt: new Date()
        }
    });
    // Seed Counter Challenges
    await prisma_1.prisma.counterChallenge.create({
        data: {
            simulationId: demoSimulation.id,
            planId: planC.id,
            challengeNumber: 1,
            title: 'Supplier C Single Logistics Corridor Bottleneck',
            assumption: 'Supplier C assumes single shipping route through Central Transit Hub without customs delay.',
            severity: 'HIGH',
            evidence: 'Historical port congestion data indicates 23% delay risk on the specific Central Transit corridor during peak biotech cycle.',
            stressTestName: 'Simulate 2-day port clearance delay on Supplier C corridor',
            stressTestDelta: 'Plan C simulated on-time delivery drops from 87% to 68%',
            mitigation: 'Require multi-modal air re-routing clause or diversify with Plan D split-order.',
            status: 'STRESS_TESTED'
        }
    });
    await prisma_1.prisma.counterChallenge.create({
        data: {
            simulationId: demoSimulation.id,
            planId: planC.id,
            challengeNumber: 2,
            title: 'Supplier C Full-Batch Capacity Assumption',
            assumption: 'Supplier C is assumed to have 100 units ready in stock or single production batch.',
            severity: 'MEDIUM',
            evidence: 'Telemetry shows Supplier C currently has 70 units buffer; remaining 30 units require 5 days tooling switch.',
            stressTestName: 'Capacity stress test: reduce immediate availability by 20%',
            stressTestDelta: 'Simulated probability of exceeding 14-day deadline increases to 39%',
            mitigation: 'Enforce pre-verification of serialized stock before issuing escrow release.',
            status: 'DISCOVERED'
        }
    });
    await prisma_1.prisma.counterChallenge.create({
        data: {
            simulationId: demoSimulation.id,
            planId: planD.id,
            challengeNumber: 3,
            title: 'Dual-Supplier Operational Coordination Overhead',
            assumption: 'Plan D assumes synchronized delivery and unified QA acceptance without added overhead.',
            severity: 'MEDIUM',
            evidence: 'Split orders create 2 independent escrow lock states and dual inspection windows.',
            stressTestName: 'Add 1.5-day administrative reconciliation buffer',
            stressTestDelta: 'Effective delivery date shifts from 9 days to 10.5 days; overall score drops 4 points.',
            mitigation: 'Use unified OKX Agentic Wallet batch intent to bundle escrow commitments.',
            status: 'DISCOVERED'
        }
    });
    // Seed Decision Brief
    await prisma_1.prisma.decisionBrief.create({
        data: {
            simulationId: demoSimulation.id,
            intentSummary: 'Purchase 100 laboratory glass reactors within 10,000 USDC budget and 14-day deadline.',
            proposedAction: 'Execute Plan B: Priority Expedited via Supplier B (AeroGlass Ultra).',
            alternativesEvaluated: 4,
            simulationSummary: '4,000 Monte Carlo scenario runs executed across 4 plans. Plan B demonstrated superior robustness against logistics shocks and supplier capacity fluctuations.',
            counterChallengesJson: JSON.stringify([
                'Plan C vulnerable to single transit corridor bottleneck (23% delay risk under peak load)',
                'Plan A has 23% simulated delay risk exceeding deadline',
                'Plan D introduces high multi-contract coordination overhead'
            ]),
            keyAssumptionsJson: JSON.stringify([
                'Supplier B maintains dedicated air cargo allotment',
                'Budget ceiling is firm at 10,000 USDC without overdraft tolerance',
                'Delivery beyond 14 days incurs severe downstream lab downtime penalty'
            ]),
            tradeOffsJson: JSON.stringify({
                costTradeoff: 'Plan B costs $600 more than Plan A and $200 more than Plan C, but saves 6 days and reduces delay risk by 15-18%.',
                riskTradeoff: 'Plan B provides 91% simulated success rate vs Plan A (74%), Plan C (87%), and Plan D (82%).',
                speedTradeoff: 'Plan B delivers in 6 days (P50) vs Plan A (12 days), Plan C (8 days), Plan D (9 days).'
            }),
            failureModesJson: JSON.stringify([
                { mode: 'Logistics Corridor Delay', impact: 'Plan A: HIGH (12d -> 16d), Plan B: MINIMAL (6d -> 7d), Plan C: MEDIUM (8d -> 11d)' },
                { mode: 'Capacity Bottleneck', impact: 'Plan C fails on 30% units if stock buffer is exhausted' },
                { mode: 'Coordination Desync', impact: 'Plan D requires dual inspection and multiple escrow releases' }
            ]),
            mitigationsJson: JSON.stringify([
                'Contractually lock delivery SLA with Supplier B via OKX smart escrow milestone condition',
                'Retain Plan C counter-offer as backup if air slot fails'
            ]),
            recommendedPlanKey: 'PLAN_B',
            recommendedPlanName: 'Plan B: Priority Expedited via Supplier B',
            reasoning: 'Under the simulated assumptions with heavy priority on delivery certainty (14-day hard cap), Plan B provides the maximum reliability buffer (6 days margin) while utilizing 100% of the allocated 10,000 USDC budget.',
            costScore: 78.0,
            speedScore: 98.0,
            reliabilityScore: 96.0,
            complexityScore: 92.0,
            downsideScore: 94.0,
            overallScore: 91.6,
            requiresHumanApproval: true
        }
    });
    // Seed Scenarios for demo simulation
    const scenariosList = [
        { type: 'BASELINE', name: 'Baseline Operating Environment', prob: 0.50, runs: 2000, succ: 1720, del: 210, fail: 70, cost: 9700, deliv: 8.2, sum: 'Standard freight lanes open, nominal supplier throughput.' },
        { type: 'DELAY', name: 'Logistics Corridor Delay (+2 Days)', prob: 0.20, runs: 800, succ: 610, del: 140, fail: 50, cost: 9850, deliv: 10.4, sum: 'Regional freight bottleneck adding 48 hours to ground transit.' },
        { type: 'PRICE_CHANGE', name: 'Raw Material Spot Volatility (+5%)', prob: 0.15, runs: 600, succ: 490, del: 70, fail: 40, cost: 10120, deliv: 8.5, sum: 'Borosilicate raw tube price increases prior to contract finalization.' },
        { type: 'CAPACITY_SHORTAGE', name: 'Supplier Capacity Shortage (-20%)', prob: 0.10, runs: 400, succ: 280, del: 80, fail: 40, cost: 9800, deliv: 11.2, sum: 'Supplier batch split across two scheduled manufacturing shifts.' },
        { type: 'COMBINED_FAILURE', name: 'Stress Test: Correlated Failure Mode', prob: 0.05, runs: 200, succ: 110, del: 50, fail: 40, cost: 10400, deliv: 13.8, sum: 'Simultaneous logistics disruption and supplier shift hold-up.' }
    ];
    for (const sc of scenariosList) {
        const createdScenario = await prisma_1.prisma.scenario.create({
            data: {
                simulationId: demoSimulation.id,
                scenarioType: sc.type,
                name: sc.name,
                probability: sc.prob,
                runsCount: sc.runs,
                successCount: sc.succ,
                delayCount: sc.del,
                failureCount: sc.fail,
                avgCost: sc.cost,
                avgDelivery: sc.deliv,
                summary: sc.sum
            }
        });
        // Seed scenario outcomes for Plan A, B, C, D
        const planOutcomes = [
            { key: 'PLAN_A', succ: 74.0, medCost: 9400, p10: 10, p50: 12, p90: 15, downside: 26.0 },
            { key: 'PLAN_B', succ: 91.0, medCost: 10000, p10: 5, p50: 6, p90: 8, downside: 9.0 },
            { key: 'PLAN_C', succ: 87.0, medCost: 9800, p10: 7, p50: 8, p90: 11, downside: 13.0 },
            { key: 'PLAN_D', succ: 82.0, medCost: 9600, p10: 7, p50: 9, p90: 12, downside: 18.0 }
        ];
        for (const po of planOutcomes) {
            await prisma_1.prisma.scenarioOutcome.create({
                data: {
                    scenarioId: createdScenario.id,
                    planKey: po.key,
                    successRate: po.succ,
                    medianCost: po.medCost,
                    p10Days: po.p10,
                    p50Days: po.p50,
                    p90Days: po.p90,
                    downsideRisk: po.downside
                }
            });
        }
    }
    // 9. Seed 10 Historical Finished Simulations with Actual Outcomes & Calibration Data
    const historicalItems = [
        { code: 'AM-00181', title: '50 units 20L Automated Rotary Evaporators', budget: 18000, predCost: 17200, predDays: 8, predSucc: 88.0, actCost: 17150, actDays: 7, status: 'SUCCESSFUL', accuracy: 'HIGH_ACCURACY', note: 'Actual delivery arrived 1 day ahead of P50 estimate. Cost variance -$50 USDC.' },
        { code: 'AM-00180', title: '20 units HPLC-Grade Solvents 500L', budget: 8500, predCost: 8100, predDays: 5, predSucc: 94.0, actCost: 8100, actDays: 5, status: 'SUCCESSFUL', accuracy: 'HIGH_ACCURACY', note: 'Perfect match on simulated median cost and median delivery time.' },
        { code: 'AM-00179', title: '4 units Ultra-Low Freezer -86°C', budget: 24000, predCost: 23200, predDays: 10, predSucc: 82.0, actCost: 23400, actDays: 12, status: 'DELAYED', accuracy: 'CLOSE_PREDICTION', note: 'Freight delayed by 2 days due to weather, well within simulated P90 boundary (13 days).' },
        { code: 'AM-00178', title: '6 units Biosafety Cabinets Class II', budget: 22000, predCost: 20500, predDays: 9, predSucc: 89.0, actCost: 20400, actDays: 8, status: 'SUCCESSFUL', accuracy: 'HIGH_ACCURACY', note: 'Cost within 0.5% of predicted median. Delivery 1 day early.' },
        { code: 'AM-00177', title: '2 units Stainless Mixing Vessel 500L', budget: 35000, predCost: 32200, predDays: 14, predSucc: 79.0, actCost: 32000, actDays: 13, status: 'SUCCESSFUL', accuracy: 'HIGH_ACCURACY', note: 'Supplier fulfilled on day 13; prediction model correctly favored split logistics.' },
        { code: 'AM-00176', title: '20 units High-Precision Peristaltic Pumps', budget: 9500, predCost: 8700, predDays: 7, predSucc: 92.0, actCost: 8750, actDays: 7, status: 'SUCCESSFUL', accuracy: 'HIGH_ACCURACY', note: 'Actual cost within $50 of simulated median.' },
        { code: 'AM-00175', title: '3 units Spectrophotometer UV-Vis Double Beam', budget: 14000, predCost: 12900, predDays: 8, predSucc: 86.0, actCost: 13100, actDays: 9, status: 'SUCCESSFUL', accuracy: 'CLOSE_PREDICTION', note: 'Minor price adjustment during A2A finalization. Within 1.5% model error.' },
        { code: 'AM-00174', title: '15 units Glass Chromatography Column 50x1000mm', budget: 7200, predCost: 6650, predDays: 6, predSucc: 90.0, actCost: 6600, actDays: 6, status: 'SUCCESSFUL', accuracy: 'HIGH_ACCURACY', note: 'Model accurately captured supplier standard inventory status.' },
        { code: 'AM-00173', title: '5 units Vacuum Drying Oven 100L Digital', budget: 12500, predCost: 11550, predDays: 9, predSucc: 85.0, actCost: 11500, actDays: 8, status: 'SUCCESSFUL', accuracy: 'HIGH_ACCURACY', note: 'Delivered in 8 days against 9-day simulated median.' },
        { code: 'AM-00172', title: '2 units Lyophilizer Freeze Dryer Benchtop', budget: 19000, predCost: 17700, predDays: 11, predSucc: 81.0, actCost: 17800, actDays: 11, status: 'SUCCESSFUL', accuracy: 'HIGH_ACCURACY', note: 'Exact match on delivery days. Calibration factor maintained at 1.0.' }
    ];
    for (let i = 0; i < historicalItems.length; i++) {
        const h = historicalItems[i];
        const hIntent = await prisma_1.prisma.intent.create({
            data: {
                userId: primaryUser.id,
                title: h.title,
                description: `Historical procurement simulation for ${h.title}. Budget: $${h.budget.toLocaleString()} USDC.`,
                productCategory: 'Laboratory Equipment',
                quantity: 10,
                budget: h.budget,
                currency: 'USDC',
                deadlineDays: 14,
                status: 'COMPLETED',
                createdAt: new Date(Date.now() - (i + 1) * 86400000 * 3)
            }
        });
        const hPlan = await prisma_1.prisma.plan.create({
            data: {
                intentId: hIntent.id,
                planKey: 'PLAN_A',
                name: `Optimal Plan for ${h.title}`,
                description: 'Simulated optimal procurement path.',
                strategy: 'EXPEDITED',
                costAmount: h.predCost,
                currency: 'USDC',
                expectedDeliveryDays: h.predDays,
                coordinationComplexity: 'LOW',
                baseSuccessRate: h.predSucc,
                assumptionsJson: JSON.stringify(['Standard supplier delivery', 'Pre-qualified quality specs']),
                candidateSuppliers: JSON.stringify(['Supplier B (AeroGlass Ultra)']),
                status: 'SELECTED',
                createdAt: new Date(Date.now() - (i + 1) * 86400000 * 3)
            }
        });
        await prisma_1.prisma.simulation.create({
            data: {
                intentId: hIntent.id,
                simulationCode: h.code,
                status: 'COMPLETED',
                iterations: 4000,
                seed: 3000 + i,
                assumptionsJson: JSON.stringify({ budget: h.budget, deadlineDays: 14 }),
                variablesJson: JSON.stringify({ runs: 4000 }),
                preferredPlanKey: 'PLAN_A',
                preferenceReason: `Optimal balance of cost ($${h.predCost.toLocaleString()}) and reliability (${h.predSucc}%).`,
                completedAt: new Date(Date.now() - (i + 1) * 86400000 * 3)
            }
        });
        // Actual Outcome
        await prisma_1.prisma.actualOutcome.create({
            data: {
                intentId: hIntent.id,
                actualCost: h.actCost,
                actualDeliveryDays: h.actDays,
                actualStatus: h.status,
                notes: h.note,
                observedVarianceCost: h.actCost - h.predCost,
                observedVarianceDays: h.actDays - h.predDays,
                recordedAt: new Date(Date.now() - (i + 1) * 86400000 * 2.5)
            }
        });
        // Calibration Record
        await prisma_1.prisma.calibration.create({
            data: {
                intentId: hIntent.id,
                predictedCostMedian: h.predCost,
                predictedDeliveryP50: h.predDays,
                predictedSuccessPct: h.predSucc,
                actualCost: h.actCost,
                actualDeliveryDays: h.actDays,
                calibrationAccuracy: h.accuracy,
                calibrationDeltaNote: h.note,
                calibrationMultiplier: 1.0,
                updatedAt: new Date(Date.now() - (i + 1) * 86400000 * 2.5)
            }
        });
        // Execution Record
        await prisma_1.prisma.execution.create({
            data: {
                intentId: hIntent.id,
                planId: hPlan.id,
                amount: h.actCost,
                currency: 'USDC',
                status: 'COMPLETED',
                network: 'OKX X Layer Testnet',
                txHash: `0x8f4c2e91b0735a67${i}de843f019b88237cb10a76f`,
                explorerUrl: 'https://www.okx.com/explorer/xlayer-test/tx/0x8f4c2e91b0735a67de843f019b88237cb10a76f',
                isDemo: true,
                executionAdapter: 'OKX_AGENTIC_WALLET_DEMO',
                escrowStatus: 'RELEASED_TO_SUPPLIER',
                executedAt: new Date(Date.now() - (i + 1) * 86400000 * 2.8)
            }
        });
        // Activity Log
        await prisma_1.prisma.activityLog.create({
            data: {
                intentId: hIntent.id,
                actorType: 'OKX_SERVICE',
                actorName: 'OKX Smart Settlement Agent',
                action: 'EXECUTION_COMPLETED',
                result: `Successfully settled $${h.actCost.toLocaleString()} USDC on X Layer Testnet for ${h.title}`,
                requestId: `REQ-HIST-${h.code}`,
                timestamp: new Date(Date.now() - (i + 1) * 86400000 * 2.5)
            }
        });
    }
    // Activity logs for current demo
    await prisma_1.prisma.activityLog.create({
        data: {
            intentId: demoIntent.id,
            actorType: 'PRIMARY_AGENT',
            actorName: 'AgentMirror Plan Generator',
            action: 'PLAN_GENERATED',
            result: 'Generated 4 competing execution paths (Plan A, B, C, D) for 100 Lab Glass Reactors.',
            requestId: 'REQ-AM-001',
            timestamp: new Date(Date.now() - 3600000)
        }
    });
    await prisma_1.prisma.activityLog.create({
        data: {
            intentId: demoIntent.id,
            actorType: 'SIMULATION_ENGINE',
            actorName: 'Monte Carlo Scenario Runner',
            action: 'SIMULATION_STARTED',
            result: 'Executed 4,000 deterministic scenario iterations (Seed 4289) across 5 stress conditions.',
            requestId: 'REQ-AM-002',
            timestamp: new Date(Date.now() - 3000000)
        }
    });
    await prisma_1.prisma.activityLog.create({
        data: {
            intentId: demoIntent.id,
            actorType: 'COUNTER_AGENT',
            actorName: 'Adversarial Decision Reviewer',
            action: 'CHALLENGE_DISCOVERED',
            result: 'Discovered 3 critical vulnerabilities: Single transit corridor bottleneck in Plan C, capacity shortfall, and Plan D coordination overhead.',
            requestId: 'REQ-AM-003',
            timestamp: new Date(Date.now() - 1800000)
        }
    });
    await prisma_1.prisma.activityLog.create({
        data: {
            intentId: demoIntent.id,
            actorType: 'SIMULATION_ENGINE',
            actorName: 'Decision Intelligence Engine',
            action: 'DECISION_GENERATED',
            result: 'Decision Brief generated: Preferred Plan B (Score: 91.6) under current reliability and delivery deadline constraints.',
            requestId: 'REQ-AM-004',
            timestamp: new Date(Date.now() - 600000)
        }
    });
    console.log('✅ AgentMirror Seed Completed: 6 Agents, 1 Primary Demo (AM-00182) with 4 Plans & 4,000 runs, 3 Counter Challenges, 10 Historical Calibration Records, 5 Integrations.');
}
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
    seed()
        .then(() => process.exit(0))
        .catch(err => {
        console.error(err);
        process.exit(1);
    });
}
