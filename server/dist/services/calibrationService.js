"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalibrationService = void 0;
const prisma_1 = require("../db/prisma");
class CalibrationService {
    /**
     * Records real-world actual outcome and updates calibration metrics.
     */
    static async recordAndCalibrate(params) {
        const simulation = await prisma_1.prisma.simulation.findFirst({
            where: { intentId: params.intentId },
            include: { intent: { include: { plans: true } } }
        });
        const selectedPlan = simulation?.intent.plans.find(p => p.planKey === simulation.preferredPlanKey) || simulation?.intent.plans[0];
        const predCost = selectedPlan ? selectedPlan.costAmount : 9800;
        const predDelivery = selectedPlan ? selectedPlan.expectedDeliveryDays : 8;
        const predSuccess = selectedPlan ? selectedPlan.baseSuccessRate : 85.0;
        const costVariance = params.actualCost - predCost;
        const deliveryVariance = params.actualDeliveryDays - predDelivery;
        let accuracyTier = 'HIGH_ACCURACY';
        let feedbackNote = '';
        const costDiffPct = Math.abs(costVariance / predCost) * 100;
        const daysDiff = Math.abs(deliveryVariance);
        if (costDiffPct <= 2.0 && daysDiff <= 1) {
            accuracyTier = 'HIGH_ACCURACY';
            feedbackNote = `High prediction calibration. Actual outcome arrived within ${daysDiff} day(s) and ±${costDiffPct.toFixed(1)}% of simulated median.`;
        }
        else if (costDiffPct <= 5.0 && daysDiff <= 3) {
            accuracyTier = 'CLOSE_PREDICTION';
            feedbackNote = `Close prediction. Observed variance was well within the simulated P90 boundary range.`;
        }
        else if (deliveryVariance > 3) {
            accuracyTier = 'MILD_UNDERESTIMATE';
            feedbackNote = `Simulation underestimated real-world friction. Increasing future logistics delay probability parameter by 5%.`;
        }
        else {
            accuracyTier = 'SIGNIFICANT_DEVIATION';
            feedbackNote = `Deviation observed. Flagged for review in model assumptions.`;
        }
        // Save actual outcome
        await prisma_1.prisma.actualOutcome.upsert({
            where: { intentId: params.intentId },
            update: {
                actualCost: params.actualCost,
                actualDeliveryDays: params.actualDeliveryDays,
                actualStatus: params.actualStatus,
                notes: params.notes,
                observedVarianceCost: costVariance,
                observedVarianceDays: deliveryVariance,
                recordedAt: new Date()
            },
            create: {
                intentId: params.intentId,
                actualCost: params.actualCost,
                actualDeliveryDays: params.actualDeliveryDays,
                actualStatus: params.actualStatus,
                notes: params.notes,
                observedVarianceCost: costVariance,
                observedVarianceDays: deliveryVariance
            }
        });
        // Save calibration
        await prisma_1.prisma.calibration.upsert({
            where: { intentId: params.intentId },
            update: {
                predictedCostMedian: predCost,
                predictedDeliveryP50: predDelivery,
                predictedSuccessPct: predSuccess,
                actualCost: params.actualCost,
                actualDeliveryDays: params.actualDeliveryDays,
                calibrationAccuracy: accuracyTier,
                calibrationDeltaNote: feedbackNote,
                calibrationMultiplier: accuracyTier === 'HIGH_ACCURACY' ? 1.0 : 1.05,
                updatedAt: new Date()
            },
            create: {
                intentId: params.intentId,
                predictedCostMedian: predCost,
                predictedDeliveryP50: predDelivery,
                predictedSuccessPct: predSuccess,
                actualCost: params.actualCost,
                actualDeliveryDays: params.actualDeliveryDays,
                calibrationAccuracy: accuracyTier,
                calibrationDeltaNote: feedbackNote,
                calibrationMultiplier: accuracyTier === 'HIGH_ACCURACY' ? 1.0 : 1.05
            }
        });
        return {
            intentId: params.intentId,
            predictedCostMedian: predCost,
            predictedDeliveryP50: predDelivery,
            predictedSuccessPct: predSuccess,
            actualCost: params.actualCost,
            actualDeliveryDays: params.actualDeliveryDays,
            costVariance,
            deliveryVariance,
            accuracyTier,
            calibrationMultiplier: accuracyTier === 'HIGH_ACCURACY' ? 1.0 : 1.05,
            feedbackNote
        };
    }
}
exports.CalibrationService = CalibrationService;
