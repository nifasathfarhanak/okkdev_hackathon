"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reputationService = void 0;
const prisma_1 = require("../db/prisma");
class ReputationService {
    /**
     * Transparent formula:
     * Score = Fulfillment(40%) + Reliability(25%) + History(25%) + ImprovementBonus(10%) - DisputePenalty
     */
    calculateScore(metrics) {
        // 1. Fulfillment component (max 40 pts)
        const fulfillmentScore = Math.min(40, (metrics.fulfillmentRate / 100) * 40);
        // 2. Response Reliability component (max 25 pts)
        // <=200ms gives 25pts, 1000ms gives 10pts, >2000ms gives 0pts
        const reliabilityScore = Math.max(0, Math.min(25, 25 - ((metrics.avgResponseMs - 150) / 1000) * 15));
        // 3. History component (max 25 pts)
        // 50+ deals gives full 25pts
        const historyScore = Math.min(25, (metrics.totalCompletedDeals / 50) * 25);
        // 4. Dispute Penalty (up to 20 pts deduction)
        const disputePenalty = Math.min(20, metrics.disputeRate * 10);
        // 5. Improvement bonus (up to 10 pts)
        const improvementBonus = Math.min(10, (metrics.avgImprovementPct / 15) * 10);
        const rawScore = fulfillmentScore + reliabilityScore + historyScore + improvementBonus - disputePenalty;
        const overallScore = Number(Math.max(0, Math.min(100, rawScore)).toFixed(1));
        return {
            overallScore,
            components: {
                fulfillmentScore: Number(fulfillmentScore.toFixed(1)),
                reliabilityScore: Number(reliabilityScore.toFixed(1)),
                historyScore: Number(historyScore.toFixed(1)),
                disputePenalty: Number(disputePenalty.toFixed(1)),
                improvementBonus: Number(improvementBonus.toFixed(1))
            }
        };
    }
    async getAgentReputation(agentId) {
        const agent = await prisma_1.prisma.agent.findUnique({
            where: { id: agentId },
            include: { reputation: true }
        });
        if (!agent || !agent.reputation)
            return null;
        const rep = agent.reputation;
        const calculated = this.calculateScore({
            fulfillmentRate: rep.fulfillmentRate,
            avgResponseMs: rep.avgResponseMs,
            totalCompletedDeals: rep.totalCompletedDeals,
            disputeRate: rep.disputeRate,
            avgImprovementPct: rep.avgImprovementPct
        });
        return {
            agentId: agent.id,
            agentName: agent.name,
            overallScore: calculated.overallScore,
            verificationTier: rep.verificationTier,
            formula: 'Overall = Fulfillment(40%) + Reliability(25%) + History(25%) + ImprovementBonus(10%) - DisputePenalty',
            components: calculated.components,
            metrics: {
                fulfillmentRate: rep.fulfillmentRate,
                cancellationRate: rep.cancellationRate,
                disputeRate: rep.disputeRate,
                avgResponseMs: rep.avgResponseMs,
                avgImprovementPct: rep.avgImprovementPct,
                totalCompletedDeals: rep.totalCompletedDeals,
                totalVolumeTransacted: rep.totalVolumeTransacted
            },
            explanation: `Agent ${agent.name} has maintained a ${rep.fulfillmentRate}% on-time fulfillment rate across ${rep.totalCompletedDeals} transactions with an average response time of ${rep.avgResponseMs}ms and low dispute rate of ${rep.disputeRate}%.`
        };
    }
    async getAllReputations() {
        const agents = await prisma_1.prisma.agent.findMany({
            include: { reputation: true }
        });
        const results = [];
        for (const agent of agents) {
            if (agent.reputation) {
                const rep = agent.reputation;
                const calculated = this.calculateScore({
                    fulfillmentRate: rep.fulfillmentRate,
                    avgResponseMs: rep.avgResponseMs,
                    totalCompletedDeals: rep.totalCompletedDeals,
                    disputeRate: rep.disputeRate,
                    avgImprovementPct: rep.avgImprovementPct
                });
                results.push({
                    agentId: agent.id,
                    agentName: agent.name,
                    overallScore: calculated.overallScore,
                    verificationTier: rep.verificationTier,
                    formula: 'Overall = Fulfillment(40%) + Reliability(25%) + History(25%) + ImprovementBonus(10%) - DisputePenalty',
                    components: calculated.components,
                    metrics: {
                        fulfillmentRate: rep.fulfillmentRate,
                        cancellationRate: rep.cancellationRate,
                        disputeRate: rep.disputeRate,
                        avgResponseMs: rep.avgResponseMs,
                        avgImprovementPct: rep.avgImprovementPct,
                        totalCompletedDeals: rep.totalCompletedDeals,
                        totalVolumeTransacted: rep.totalVolumeTransacted
                    },
                    explanation: `Agent ${agent.name} holds ${calculated.overallScore}/100 reputation on DealMesh.`
                });
            }
        }
        return results.sort((a, b) => b.overallScore - a.overallScore);
    }
}
exports.reputationService = new ReputationService();
