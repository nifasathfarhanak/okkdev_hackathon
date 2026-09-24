"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationEngine = exports.SeededPRNG = void 0;
// Seeded pseudo-random number generator (Mulberry32) for reproducible Monte Carlo runs
class SeededPRNG {
    s;
    constructor(seed) {
        this.s = seed >>> 0;
    }
    // Returns float [0, 1)
    next() {
        let t = (this.s += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    // Returns integer in range [min, max]
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    // Normal distribution via Box-Muller transform
    nextGaussian(mean, stdDev) {
        const u1 = Math.max(1e-10, this.next());
        const u2 = this.next();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return mean + z0 * stdDev;
    }
}
exports.SeededPRNG = SeededPRNG;
class SimulationEngine {
    /**
     * Generates 4 competing plans based on user intent and available agents.
     */
    static generatePlans(intent) {
        const budget = intent.budget || 10000;
        const deadline = intent.deadlineDays || 14;
        return [
            {
                planKey: 'PLAN_A',
                name: 'Plan A: Direct Sourcing via Supplier A',
                description: 'Single-source procurement from Supplier A (LabCore Precision). Lowest catalog list price but relies on standard ground transport.',
                strategy: 'SINGLE_SOURCE',
                costAmount: Math.round(budget * 0.94),
                currency: 'USDC',
                expectedDeliveryDays: Math.min(12, Math.round(deadline * 0.85)),
                coordinationComplexity: 'LOW',
                baseSuccessRate: 74.0,
                assumptions: [
                    'Supplier A factory line operates without maintenance hold-ups',
                    'Standard ground logistics route remains open without regional customs delay',
                    'Batch passes single-pass factory inspection'
                ],
                candidateSuppliers: ['Supplier A (LabCore Precision)']
            },
            {
                planKey: 'PLAN_B',
                name: 'Plan B: Priority Expedited via Supplier B',
                description: 'Procurement from Supplier B (AeroGlass Ultra) utilizing dedicated air freight. Uses full budget but has near-zero delivery delay risk.',
                strategy: 'EXPEDITED',
                costAmount: budget,
                currency: 'USDC',
                expectedDeliveryDays: Math.max(4, Math.round(deadline * 0.43)),
                coordinationComplexity: 'LOW',
                baseSuccessRate: 91.0,
                assumptions: [
                    'Supplier B air cargo slot is reserved within 24h',
                    'Zero customs buffer required under pre-cleared air waybill'
                ],
                candidateSuppliers: ['Supplier B (AeroGlass Ultra)']
            },
            {
                planKey: 'PLAN_C',
                name: 'Plan C: Dynamic A2A Negotiation with Supplier C',
                description: 'Engage Supplier C (BioGlass Global) in automated multi-round counter-offer negotiation to achieve target discount.',
                strategy: 'NEGOTIATED',
                costAmount: Math.round(budget * 0.98),
                currency: 'USDC',
                expectedDeliveryDays: Math.round(deadline * 0.57),
                coordinationComplexity: 'MEDIUM',
                baseSuccessRate: 87.0,
                assumptions: [
                    'Supplier C accepts negotiated price',
                    'Supplier C can fulfill all units from a single production run',
                    'Single logistics corridor operates at baseline 92% reliability'
                ],
                candidateSuppliers: ['Supplier C (BioGlass Global)']
            },
            {
                planKey: 'PLAN_D',
                name: 'Plan D: Dual-Supplier Split Sourcing (A + B)',
                description: 'Order 60% from Supplier A for cost savings and 40% from Supplier B for rapid buffer fulfillment.',
                strategy: 'DUAL_SOURCE',
                costAmount: Math.round(budget * 0.96),
                currency: 'USDC',
                expectedDeliveryDays: Math.round(deadline * 0.64),
                coordinationComplexity: 'HIGH',
                baseSuccessRate: 82.0,
                assumptions: [
                    'Coordination overhead of 2 separate smart contracts and logistics tracking',
                    'Reconciliation of two distinct manufacturer serial number formats'
                ],
                candidateSuppliers: ['Supplier A (LabCore Precision)', 'Supplier B (AeroGlass Ultra)']
            }
        ];
    }
    /**
     * Runs deterministic Monte Carlo simulations across 5 scenario conditions for a given plan.
     */
    static simulatePlan(plan, assumptions, iterations = 1000, seed = 4289) {
        const prng = new SeededPRNG(seed + plan.name.length);
        const delayProb = (assumptions.supplierDelayProb ?? 15) / 100;
        const priceVol = (assumptions.priceVolatility ?? 8) / 100;
        const logisticsRel = (assumptions.logisticsReliability ?? 92) / 100;
        const negRate = (assumptions.negotiationSuccessRate ?? 75) / 100;
        const costs = [];
        const deliveries = [];
        let successCount = 0;
        let delayCount = 0;
        let failureCount = 0;
        let constraintViolations = 0;
        const scenarioDistribution = {
            baseline: { runs: 0, success: 0, delay: 0, failure: 0 },
            logisticsDelay: { runs: 0, success: 0, delay: 0, failure: 0 },
            priceSpike: { runs: 0, success: 0, delay: 0, failure: 0 },
            capacityShortage: { runs: 0, success: 0, delay: 0, failure: 0 },
            combinedStress: { runs: 0, success: 0, delay: 0, failure: 0 }
        };
        for (let i = 0; i < iterations; i++) {
            const scenarioRoll = prng.next();
            let scenarioType = 'baseline';
            let runCost = plan.costAmount;
            let runDelivery = plan.expectedDeliveryDays;
            let isSuccess = true;
            let isDelayed = false;
            let isFailed = false;
            // Base variance
            const costVariance = prng.nextGaussian(0, priceVol * plan.costAmount * 0.4);
            runCost = Math.max(plan.costAmount * 0.9, Math.round(runCost + costVariance));
            if (scenarioRoll < 0.50) {
                // Baseline (50% of runs)
                scenarioType = 'baseline';
                if (prng.next() > logisticsRel) {
                    runDelivery += prng.nextInt(1, 3);
                }
            }
            else if (scenarioRoll < 0.70) {
                // Logistics Delay (20% of runs)
                scenarioType = 'logisticsDelay';
                const delayMagnitude = plan.strategy === 'EXPEDITED' ? 1 : prng.nextInt(2, 5);
                runDelivery += delayMagnitude;
            }
            else if (scenarioRoll < 0.85) {
                // Price Spike (15% of runs)
                scenarioType = 'priceSpike';
                runCost += Math.round(plan.costAmount * (priceVol * prng.next()));
            }
            else if (scenarioRoll < 0.95) {
                // Capacity Shortage (10% of runs)
                scenarioType = 'capacityShortage';
                if (plan.strategy === 'NEGOTIATED' || plan.strategy === 'SINGLE_SOURCE') {
                    runDelivery += prng.nextInt(3, 6);
                    if (prng.next() > negRate) {
                        runCost += Math.round(plan.costAmount * 0.05);
                    }
                }
                else {
                    runDelivery += prng.nextInt(1, 2);
                }
            }
            else {
                // Combined stress test (5% of runs)
                scenarioType = 'combinedStress';
                runCost += Math.round(plan.costAmount * 0.08);
                runDelivery += prng.nextInt(3, 7);
            }
            // Check Constraints
            if (runCost > assumptions.budgetLimit) {
                constraintViolations++;
                isFailed = true;
            }
            if (runDelivery > assumptions.deadlineDays) {
                constraintViolations++;
                if (runDelivery > assumptions.deadlineDays + 2) {
                    isFailed = true;
                }
                else {
                    isDelayed = true;
                }
            }
            if (isFailed) {
                failureCount++;
                isSuccess = false;
                scenarioDistribution[scenarioType].failure++;
            }
            else if (isDelayed) {
                delayCount++;
                isSuccess = false;
                scenarioDistribution[scenarioType].delay++;
            }
            else {
                successCount++;
                scenarioDistribution[scenarioType].success++;
            }
            scenarioDistribution[scenarioType].runs++;
            costs.push(runCost);
            deliveries.push(runDelivery);
        }
        // Sort to extract percentiles P10, P50 (median), P90
        costs.sort((a, b) => a - b);
        deliveries.sort((a, b) => a - b);
        const getP = (arr, pct) => arr[Math.floor(arr.length * pct)];
        const successPct = Number(((successCount / iterations) * 100).toFixed(1));
        const delayPct = Number(((delayCount / iterations) * 100).toFixed(1));
        const failurePct = Number(((failureCount / iterations) * 100).toFixed(1));
        const downsideScore = Number((failurePct * 1.5 + delayPct * 0.5).toFixed(1));
        const complexityScore = plan.coordinationComplexity === 'LOW' ? 95 : plan.coordinationComplexity === 'MEDIUM' ? 85 : 70;
        return {
            planKey: plan.planKey,
            planName: plan.name,
            iterations,
            simulatedSuccessPct: successPct,
            simulatedDelayPct: delayPct,
            simulatedFailurePct: failurePct,
            medianCost: getP(costs, 0.5),
            costP10: getP(costs, 0.1),
            costP50: getP(costs, 0.5),
            costP90: getP(costs, 0.9),
            deliveryDaysP10: getP(deliveries, 0.1),
            deliveryDaysP50: getP(deliveries, 0.5),
            deliveryDaysP90: getP(deliveries, 0.9),
            downsideRiskScore: downsideScore,
            complexityScore,
            constraintViolationsCount: constraintViolations,
            scenarioDistribution
        };
    }
    /**
     * Compares all simulated plans using multi-attribute utility theory with user-configurable weights.
     */
    static comparePlans(plans, results, weights = { costWeight: 0.30, speedWeight: 0.30, reliabilityWeight: 0.25, complexityWeight: 0.15 }) {
        const minCost = Math.min(...results.map(r => r.medianCost));
        const maxCost = Math.max(...results.map(r => r.medianCost));
        const minDays = Math.min(...results.map(r => r.deliveryDaysP50));
        const maxDays = Math.max(...results.map(r => r.deliveryDaysP50));
        const ranked = results.map(r => {
            // Cost score: 100 for lowest, scale down
            const costScore = maxCost === minCost ? 90 : Math.round(100 - ((r.medianCost - minCost) / (maxCost - minCost)) * 30);
            // Speed score: 100 for fastest
            const speedScore = maxDays === minDays ? 95 : Math.round(100 - ((r.deliveryDaysP50 - minDays) / (maxDays - minDays)) * 40);
            // Reliability score: direct success percentage
            const reliabilityScore = r.simulatedSuccessPct;
            // Complexity score
            const complexityScore = r.complexityScore;
            // Downside score: 100 - downsideRisk
            const downsideScore = Math.max(0, Math.round(100 - r.downsideRiskScore));
            const compositeScore = Number((costScore * weights.costWeight +
                speedScore * weights.speedWeight +
                reliabilityScore * weights.reliabilityWeight +
                complexityScore * weights.complexityWeight).toFixed(1));
            return {
                planKey: r.planKey,
                planName: r.planName,
                compositeScore,
                costScore,
                speedScore,
                reliabilityScore,
                complexityScore,
                downsideScore,
                metrics: r
            };
        });
        ranked.sort((a, b) => b.compositeScore - a.compositeScore);
        const topPlan = ranked[0];
        const explanation = `Under current weighting (Cost: ${(weights.costWeight * 100).toFixed(0)}%, Speed: ${(weights.speedWeight * 100).toFixed(0)}%, Reliability: ${(weights.reliabilityWeight * 100).toFixed(0)}%, Complexity: ${(weights.complexityWeight * 100).toFixed(0)}%), ${topPlan.planName} is preferred with an overall score of ${topPlan.compositeScore}/100. It demonstrates a simulated success rate of ${topPlan.metrics.simulatedSuccessPct}% and expected delivery of ${topPlan.metrics.deliveryDaysP50} days.`;
        return {
            rankedPlans: ranked,
            preferredPlanKey: topPlan.planKey,
            explanation
        };
    }
}
exports.SimulationEngine = SimulationEngine;
