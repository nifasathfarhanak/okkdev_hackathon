"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatIfService = void 0;
const simulationEngine_1 = require("./simulationEngine");
class WhatIfService {
    static recalculate(plans, originalAssumptions, newAssumptions, iterations = 1000, seed = 4289) {
        const beforeMetrics = {};
        const afterMetrics = {};
        const beforeMetricsList = [];
        const afterMetricsList = [];
        for (const plan of plans) {
            const bRes = simulationEngine_1.SimulationEngine.simulatePlan(plan, originalAssumptions, iterations, seed);
            const aRes = simulationEngine_1.SimulationEngine.simulatePlan(plan, newAssumptions, iterations, seed);
            beforeMetrics[plan.planKey] = bRes;
            afterMetrics[plan.planKey] = aRes;
            beforeMetricsList.push(bRes);
            afterMetricsList.push(aRes);
        }
        const beforeComparison = simulationEngine_1.SimulationEngine.comparePlans(plans, beforeMetricsList);
        const afterComparison = simulationEngine_1.SimulationEngine.comparePlans(plans, afterMetricsList);
        const planDeltas = plans.map(p => {
            const b = beforeMetrics[p.planKey];
            const a = afterMetrics[p.planKey];
            return {
                planKey: p.planKey,
                planName: p.name,
                successRateBefore: b.simulatedSuccessPct,
                successRateAfter: a.simulatedSuccessPct,
                successRateDelta: Number((a.simulatedSuccessPct - b.simulatedSuccessPct).toFixed(1)),
                medianCostBefore: b.medianCost,
                medianCostAfter: a.medianCost,
                medianCostDelta: a.medianCost - b.medianCost,
                deliveryP50Before: b.deliveryDaysP50,
                deliveryP50After: a.deliveryDaysP50,
                deliveryP50Delta: a.deliveryDaysP50 - b.deliveryDaysP50,
                downsideBefore: b.downsideRiskScore,
                downsideAfter: a.downsideRiskScore,
                downsideDelta: Number((a.downsideRiskScore - b.downsideRiskScore).toFixed(1))
            };
        });
        const preferenceChanged = beforeComparison.preferredPlanKey !== afterComparison.preferredPlanKey;
        let explanation = '';
        if (preferenceChanged) {
            explanation = `Adjusting constraints shifted the preferred plan from ${beforeComparison.preferredPlanKey} to ${afterComparison.preferredPlanKey}. Under the modified assumptions, ${afterComparison.preferredPlanKey} provides greater feasibility against the updated constraints.`;
        }
        else {
            explanation = `Under the updated assumptions, ${afterComparison.preferredPlanKey} remains preferred with a simulated success rate of ${afterMetrics[afterComparison.preferredPlanKey]?.simulatedSuccessPct}%.`;
        }
        // Detail explanations if budget decreased
        if (newAssumptions.budgetLimit < originalAssumptions.budgetLimit) {
            explanation += ` The budget reduction ($${originalAssumptions.budgetLimit.toLocaleString()} -> $${newAssumptions.budgetLimit.toLocaleString()}) tightened financial feasibility margins across higher-cost plans.`;
        }
        // Detail explanations if deadline tightened
        if (newAssumptions.deadlineDays < originalAssumptions.deadlineDays) {
            explanation += ` The tighter deadline (${originalAssumptions.deadlineDays}d -> ${newAssumptions.deadlineDays}d) significantly increased delay risk on standard ground logistics paths.`;
        }
        return {
            variableChanges: {
                budgetLimit: { before: originalAssumptions.budgetLimit, after: newAssumptions.budgetLimit, unit: 'USDC' },
                deadlineDays: { before: originalAssumptions.deadlineDays, after: newAssumptions.deadlineDays, unit: 'days' },
                supplierDelayProb: { before: originalAssumptions.supplierDelayProb ?? 15, after: newAssumptions.supplierDelayProb ?? 15, unit: '%' },
                priceVolatility: { before: originalAssumptions.priceVolatility ?? 8, after: newAssumptions.priceVolatility ?? 8, unit: '%' },
                logisticsReliability: { before: originalAssumptions.logisticsReliability ?? 92, after: newAssumptions.logisticsReliability ?? 92, unit: '%' },
                negotiationSuccessRate: { before: originalAssumptions.negotiationSuccessRate ?? 75, after: newAssumptions.negotiationSuccessRate ?? 75, unit: '%' }
            },
            beforeMetrics,
            afterMetrics,
            planDeltas,
            preferredPlanBefore: beforeComparison.preferredPlanKey,
            preferredPlanAfter: afterComparison.preferredPlanKey,
            preferenceChanged,
            explanation
        };
    }
}
exports.WhatIfService = WhatIfService;
