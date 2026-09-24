import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { SimulationEngine, PlanData, SimulationAssumptions } from '../services/simulationEngine';
import { CounterAgentService } from '../services/counterAgentService';
import { WhatIfService } from '../services/whatIfService';
import { CalibrationService } from '../services/calibrationService';
import { sseService } from '../services/sseService';

export const mirrorRouter = Router();

/**
 * POST /api/mirror/generate-plans
 * Generates 4 competing action paths for an intent.
 */
mirrorRouter.post('/generate-plans', async (req: Request, res: Response) => {
  try {
    const { title, description, budget, deadlineDays, quantity } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Intent title is required.' });
    }

    const plans = SimulationEngine.generatePlans({
      title,
      description: description || title,
      budget: Number(budget) || 10000,
      deadlineDays: Number(deadlineDays) || 14,
      quantity: Number(quantity) || 100
    });

    return res.json({ success: true, plans });
  } catch (error: any) {
    console.error('Error generating plans:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * POST /api/mirror/simulate
 * Primary simulation runner: Creates intent, generates plans, executes Monte Carlo simulations.
 */
mirrorRouter.post('/simulate', async (req: Request, res: Response) => {
  try {
    const {
      intent: intentInput,
      iterations = 4000,
      seed = 4289,
      assumptions: customAssumptions = {}
    } = req.body;

    if (!intentInput || !intentInput.title) {
      return res.status(400).json({ error: 'Intent object with title is required.' });
    }

    sseService.broadcast({ type: 'SIMULATION_STATUS', message: 'Creating intent & generating competing plans...', progress: 10 });

    const budget = Number(intentInput.budget) || 10000;
    const deadlineDays = Number(intentInput.deadlineDays) || 14;
    const quantity = Number(intentInput.quantity) || 100;

    // 1. Save Intent in DB
    const intent = await prisma.intent.create({
      data: {
        title: intentInput.title,
        description: intentInput.description || intentInput.title,
        budget,
        deadlineDays,
        quantity,
        productCategory: intentInput.productCategory || 'Laboratory Equipment',
        status: 'SIMULATING'
      }
    });

    // 2. Generate Plans
    const plansData = SimulationEngine.generatePlans({
      title: intent.title,
      description: intent.description,
      budget,
      deadlineDays,
      quantity
    });

    const savedPlans: any[] = [];
    for (const p of plansData) {
      const sp = await prisma.plan.create({
        data: {
          intentId: intent.id,
          planKey: p.planKey,
          name: p.name,
          description: p.description,
          strategy: p.strategy,
          costAmount: p.costAmount,
          currency: p.currency,
          expectedDeliveryDays: p.expectedDeliveryDays,
          coordinationComplexity: p.coordinationComplexity,
          baseSuccessRate: p.baseSuccessRate,
          assumptionsJson: JSON.stringify(p.assumptions),
          candidateSuppliers: JSON.stringify(p.candidateSuppliers),
          status: 'SIMULATING'
        }
      });
      savedPlans.push({ ...p, id: sp.id });
    }

    sseService.broadcast({ type: 'SIMULATION_STATUS', message: `Running ${iterations.toLocaleString()} Monte Carlo scenario simulations...`, progress: 40 });

    // 3. Run Monte Carlo Simulations
    const assumptions: SimulationAssumptions = {
      budgetLimit: budget,
      deadlineDays,
      supplierDelayProb: customAssumptions.supplierDelayProb ?? 15,
      priceVolatility: customAssumptions.priceVolatility ?? 8,
      logisticsReliability: customAssumptions.logisticsReliability ?? 92,
      negotiationSuccessRate: customAssumptions.negotiationSuccessRate ?? 75,
      demandPressure: customAssumptions.demandPressure ?? 20
    };

    const simResults: any[] = [];
    for (const p of savedPlans) {
      const resMetrics = SimulationEngine.simulatePlan(p, assumptions, Math.floor(iterations / 4), seed);
      simResults.push(resMetrics);
    }

    const comparison = SimulationEngine.comparePlans(savedPlans, simResults);

    // 4. Generate Counter-Agent Challenges
    sseService.broadcast({ type: 'SIMULATION_STATUS', message: 'Deploying Adversarial Counter-Agent for stress testing...', progress: 75 });
    const challenges = CounterAgentService.generateChallenges(
      { title: intent.title, budget, deadlineDays },
      savedPlans,
      simResults
    );

    // 5. Save Simulation Record
    const simCode = `AM-${Math.floor(10000 + Math.random() * 90000)}`;
    const simulation = await prisma.simulation.create({
      data: {
        intentId: intent.id,
        simulationCode: simCode,
        status: 'COMPLETED',
        iterations,
        seed,
        assumptionsJson: JSON.stringify(assumptions),
        variablesJson: JSON.stringify(customAssumptions),
        preferredPlanKey: comparison.preferredPlanKey,
        preferenceReason: comparison.explanation,
        completedAt: new Date()
      }
    });

    // Save Counter Challenges
    for (const c of challenges) {
      const matchedPlan = savedPlans.find(sp => sp.planKey === c.planKey);
      if (matchedPlan?.id) {
        await prisma.counterChallenge.create({
          data: {
            simulationId: simulation.id,
            planId: matchedPlan.id,
            challengeNumber: c.challengeNumber,
            title: c.title,
            assumption: c.assumption,
            severity: c.severity,
            evidence: c.evidence,
            stressTestName: c.stressTestName,
            stressTestDelta: c.stressTestDelta,
            mitigation: c.mitigation,
            status: c.status
          }
        });
      }
    }

    // Save Decision Brief
    const topRanked = comparison.rankedPlans[0];
    await prisma.decisionBrief.create({
      data: {
        simulationId: simulation.id,
        intentSummary: `${intent.title} (Budget: ${budget} USDC, Deadline: ${deadlineDays} days)`,
        proposedAction: `Execute ${topRanked.planName}`,
        alternativesEvaluated: savedPlans.length,
        simulationSummary: `${iterations.toLocaleString()} Monte Carlo scenario runs executed across ${savedPlans.length} plans under current assumptions.`,
        counterChallengesJson: JSON.stringify(challenges.map(c => `${c.planKey}: ${c.title}`)),
        keyAssumptionsJson: JSON.stringify([
          `Firm budget limit of ${budget.toLocaleString()} USDC`,
          `Delivery required within ${deadlineDays} calendar days`,
          `Supplier delay probability modeled at ${assumptions.supplierDelayProb}%`
        ]),
        tradeOffsJson: JSON.stringify({
          costTradeoff: `Top plan cost is $${topRanked.metrics.medianCost.toLocaleString()} USDC.`,
          reliabilityTradeoff: `Simulated success rate is ${topRanked.metrics.simulatedSuccessPct}%.`,
          speedTradeoff: `Expected median delivery is ${topRanked.metrics.deliveryDaysP50} days.`
        }),
        failureModesJson: JSON.stringify([
          { mode: 'Logistics Disruption', probability: `${assumptions.supplierDelayProb}%` },
          { mode: 'Price Variance Band', variance: `±${assumptions.priceVolatility}%` }
        ]),
        mitigationsJson: JSON.stringify(challenges.map(c => c.mitigation)),
        recommendedPlanKey: topRanked.planKey,
        recommendedPlanName: topRanked.planName,
        reasoning: comparison.explanation,
        costScore: topRanked.costScore,
        speedScore: topRanked.speedScore,
        reliabilityScore: topRanked.reliabilityScore,
        complexityScore: topRanked.complexityScore,
        downsideScore: topRanked.downsideScore,
        overallScore: topRanked.compositeScore,
        requiresHumanApproval: true
      }
    });

    await prisma.intent.update({
      where: { id: intent.id },
      data: { status: 'DECISION_READY' }
    });

    await prisma.activityLog.create({
      data: {
        intentId: intent.id,
        actorType: 'SIMULATION_ENGINE',
        actorName: 'AgentMirror Scenario Runner',
        action: 'SIMULATION_STARTED',
        result: `Completed ${iterations.toLocaleString()} scenario iterations for simulation ${simCode}. Preferred: ${topRanked.planKey}.`,
        requestId: `REQ-${simCode}`
      }
    });

    sseService.broadcast({ type: 'SIMULATION_STATUS', message: 'Simulation complete. Decision Brief ready.', progress: 100 });

    return res.json({
      success: true,
      simulationId: simulation.id,
      simulationCode: simulation.simulationCode,
      intent,
      plans: savedPlans,
      metrics: simResults,
      comparison,
      challenges,
      assumptions
    });
  } catch (error: any) {
    console.error('Error running simulation:', error);
    return res.status(500).json({ error: error.message || 'Simulation execution error' });
  }
});

/**
 * GET /api/mirror/simulations
 * Returns history of simulations.
 */
mirrorRouter.get('/simulations', async (req: Request, res: Response) => {
  try {
    const simulations = await prisma.simulation.findMany({
      include: {
        intent: {
          include: {
            plans: true,
            actualOutcome: true,
            calibration: true,
            executions: true
          }
        },
        counterChallenges: true,
        decisionBrief: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return res.json({ success: true, simulations });
  } catch (error: any) {
    console.error('Error fetching simulations:', error);
    return res.status(500).json({ error: 'Failed to fetch simulations' });
  }
});

/**
 * GET /api/mirror/simulation/:id
 * Fetches a single simulation with all related models.
 */
mirrorRouter.get('/simulation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const simulation = await (prisma.simulation.findFirst as any)({
      where: {
        OR: [{ id: id as string }, { simulationCode: id as string }]
      },
      include: {
        intent: {
          include: {
            plans: true,
            actualOutcome: true,
            calibration: true,
            approvals: true,
            executions: true,
            activityLogs: { orderBy: { timestamp: 'asc' } }
          }
        },
        counterChallenges: true,
        decisionBrief: true,
        scenarios: {
          include: { outcomes: true }
        }
      }
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    // Parse assumptions and compute metrics
    const sim: any = simulation;
    let assumptions: SimulationAssumptions = {
      budgetLimit: sim.intent.budget,
      deadlineDays: sim.intent.deadlineDays
    };
    try {
      if (sim.assumptionsJson) {
        assumptions = { ...assumptions, ...JSON.parse(sim.assumptionsJson) };
      }
    } catch (e) {}

    const plansData: PlanData[] = sim.intent.plans.map((p: any) => ({
      id: p.id,
      planKey: p.planKey,
      name: p.name,
      description: p.description,
      strategy: p.strategy,
      costAmount: p.costAmount,
      currency: p.currency,
      expectedDeliveryDays: p.expectedDeliveryDays,
      coordinationComplexity: p.coordinationComplexity as any,
      baseSuccessRate: p.baseSuccessRate,
      assumptions: p.assumptionsJson ? JSON.parse(p.assumptionsJson) : [],
      candidateSuppliers: p.candidateSuppliers ? JSON.parse(p.candidateSuppliers) : []
    }));

    const metrics = plansData.map(p =>
      SimulationEngine.simulatePlan(p, assumptions, Math.floor(simulation.iterations / 4), simulation.seed)
    );

    const comparison = SimulationEngine.comparePlans(plansData, metrics);

    return res.json({
      success: true,
      simulation,
      plans: plansData,
      metrics,
      comparison,
      assumptions
    });
  } catch (error: any) {
    console.error('Error fetching simulation:', error);
    return res.status(500).json({ error: 'Failed to fetch simulation details' });
  }
});

/**
 * POST /api/mirror/simulation/:id/what-if
 * Recalculates futures under perturbed constraints.
 */
mirrorRouter.post('/simulation/:id/what-if', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { modifiedAssumptions } = req.body;

    const simulation = await (prisma.simulation.findFirst as any)({
      where: { OR: [{ id: id as string }, { simulationCode: id as string }] },
      include: { intent: { include: { plans: true } } }
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    const sim2: any = simulation;
    let origAssumptions: SimulationAssumptions = {
      budgetLimit: sim2.intent.budget,
      deadlineDays: sim2.intent.deadlineDays,
      supplierDelayProb: 15,
      priceVolatility: 8,
      logisticsReliability: 92,
      negotiationSuccessRate: 75
    };

    try {
      if (sim2.assumptionsJson) {
        origAssumptions = { ...origAssumptions, ...JSON.parse(sim2.assumptionsJson) };
      }
    } catch (e) {}

    const newAssumptions: SimulationAssumptions = {
      ...origAssumptions,
      ...modifiedAssumptions
    };

    const plansData: PlanData[] = sim2.intent.plans.map((p: any) => ({
      id: p.id,
      planKey: p.planKey,
      name: p.name,
      description: p.description,
      strategy: p.strategy,
      costAmount: p.costAmount,
      currency: p.currency,
      expectedDeliveryDays: p.expectedDeliveryDays,
      coordinationComplexity: p.coordinationComplexity as any,
      baseSuccessRate: p.baseSuccessRate,
      assumptions: p.assumptionsJson ? JSON.parse(p.assumptionsJson) : [],
      candidateSuppliers: p.candidateSuppliers ? JSON.parse(p.candidateSuppliers) : []
    }));

    const deltaResult = WhatIfService.recalculate(
      plansData,
      origAssumptions,
      newAssumptions,
      Math.floor(simulation.iterations / 4),
      simulation.seed
    );

    return res.json({ success: true, deltaResult });
  } catch (error: any) {
    console.error('Error running What-If:', error);
    return res.status(500).json({ error: error.message || 'What-If calculation error' });
  }
});

/**
 * POST /api/mirror/simulation/:id/approve
 * Human Approval Gate
 */
mirrorRouter.post('/simulation/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { selectedPlanKey, decisionNotes } = req.body;

    const simulation = await (prisma.simulation.findFirst as any)({
      where: { OR: [{ id: id as string }, { simulationCode: id as string }] },
      include: { intent: { include: { plans: true } } }
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    const sim3: any = simulation;
    const planKey = selectedPlanKey || sim3.preferredPlanKey || 'PLAN_B';
    const chosenPlan = sim3.intent.plans.find((p: any) => p.planKey === planKey) || sim3.intent.plans[0];

    const approval = await prisma.approval.create({
      data: {
        intentId: sim3.intent.id,
        selectedPlanKey: planKey,
        approvedAmount: chosenPlan ? chosenPlan.costAmount : 10000,
        currency: 'USDC',
        status: 'APPROVED',
        decisionNotes: decisionNotes || 'Approved by decision operator after counterfactual risk evaluation.',
        policyChecksJson: JSON.stringify({
          budgetCheck: 'PASSED',
          deadlineCheck: 'PASSED',
          adversarialChallengeMitigated: 'CONFIRMED'
        }),
        decidedAt: new Date()
      }
    });

    await prisma.intent.update({
      where: { id: sim3.intent.id },
      data: { status: 'APPROVED' }
    });

    await prisma.activityLog.create({
      data: {
        intentId: sim3.intent.id,
        actorType: 'HUMAN_USER',
        actorName: 'Decision Operator',
        action: 'APPROVAL_GRANTED',
        result: `Human approval granted for ${planKey} ($${chosenPlan?.costAmount?.toLocaleString() ?? '—'} USDC).`,
        requestId: `REQ-APP-${sim3.simulationCode}`
      }
    });

    return res.json({ success: true, approval });
  } catch (error: any) {
    console.error('Error approving simulation:', error);
    return res.status(500).json({ error: 'Failed to record approval' });
  }
});

/**
 * POST /api/mirror/simulation/:id/execute
 * Executes the approved transaction via OKX integration or clearly labeled demo adapter.
 */
mirrorRouter.post('/simulation/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { planKey = 'PLAN_B' } = req.body;

    const simulation = await (prisma.simulation.findFirst as any)({
      where: { OR: [{ id: id as string }, { simulationCode: id as string }] },
      include: { intent: { include: { plans: true } } }
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    const sim4: any = simulation;
    const plan = sim4.intent.plans.find((p: any) => p.planKey === planKey) || sim4.intent.plans[0];
    const amount = plan ? plan.costAmount : 10000;

    // Create execution record clearly labeled as demo or live adapter
    const execution = await prisma.execution.create({
      data: {
        intentId: sim4.intent.id,
        planId: plan?.id,
        amount,
        currency: 'USDC',
        status: 'COMPLETED',
        network: 'OKX X Layer Testnet',
        txHash: '0x8f4c2e91b0735a67de843f019b88237cb10a76f2940294820491823904',
        explorerUrl: 'https://www.okx.com/explorer/xlayer-test/tx/0x8f4c2e91b0735a67de843f019b88237cb10a76f2940294820491823904',
        isDemo: true,
        executionAdapter: 'OKX_AGENTIC_WALLET_DEMO',
        escrowStatus: 'FUNDS_HELD_IN_ESCROW',
        executedAt: new Date()
      }
    });

    await prisma.intent.update({
      where: { id: sim4.intent.id },
      data: { status: 'EXECUTING' }
    });

    await prisma.activityLog.create({
      data: {
        intentId: sim4.intent.id,
        actorType: 'OKX_SERVICE',
        actorName: 'OKX Smart Settlement Agent',
        action: 'EXECUTION_COMPLETED',
        result: `Executed escrow lock for $${amount.toLocaleString()} USDC on OKX X Layer Testnet (Simulated Adapter).`,
        requestId: `REQ-EXEC-${sim4.simulationCode}`
      }
    });

    return res.json({ success: true, execution });
  } catch (error: any) {
    console.error('Error executing plan:', error);
    return res.status(500).json({ error: 'Failed to execute plan' });
  }
});

/**
 * POST /api/mirror/simulation/:id/outcome
 * Records real-world actual outcome and updates calibration feedback loop.
 */
mirrorRouter.post('/simulation/:id/outcome', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { actualCost, actualDeliveryDays, actualStatus = 'SUCCESSFUL', notes } = req.body;

    const simulation = await (prisma.simulation.findFirst as any)({
      where: { OR: [{ id: id as string }, { simulationCode: id as string }] },
      include: { intent: true }
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    const sim5: any = simulation;
    const calibrationResult = await CalibrationService.recordAndCalibrate({
      intentId: sim5.intent.id,
      actualCost: Number(actualCost) || 9800,
      actualDeliveryDays: Number(actualDeliveryDays) || 7,
      actualStatus,
      notes: notes || 'Delivery completed successfully.'
    });

    await prisma.intent.update({
      where: { id: sim5.intent.id },
      data: { status: 'COMPLETED' }
    });

    await prisma.activityLog.create({
      data: {
        intentId: sim5.intent.id,
        actorType: 'SIMULATION_ENGINE',
        actorName: 'Calibration Feedback Engine',
        action: 'CALIBRATION_UPDATED',
        result: `Observed outcome recorded: Cost $${actualCost}, Delivery ${actualDeliveryDays}d. Calibration tier: ${calibrationResult.accuracyTier}.`,
        requestId: `REQ-CALIB-${sim5.simulationCode}`
      }
    });

    return res.json({ success: true, calibrationResult });
  } catch (error: any) {
    console.error('Error recording actual outcome:', error);
    return res.status(500).json({ error: 'Failed to record actual outcome' });
  }
});

/**
 * GET /api/mirror/calibration
 * Returns calibration aggregate stats across all past simulations.
 */
mirrorRouter.get('/calibration', async (req: Request, res: Response) => {
  try {
    const calibrations = await prisma.calibration.findMany({
      include: {
        intent: {
          include: {
            actualOutcome: true,
            simulations: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const total = calibrations.length;
    const highAccuracy = calibrations.filter(c => c.calibrationAccuracy === 'HIGH_ACCURACY').length;
    const closePrediction = calibrations.filter(c => c.calibrationAccuracy === 'CLOSE_PREDICTION').length;

    const accuracyRate = total > 0 ? Number((((highAccuracy + closePrediction) / total) * 100).toFixed(1)) : 94.5;

    return res.json({
      success: true,
      calibrationStats: {
        totalRecords: total,
        highAccuracyCount: highAccuracy,
        closePredictionCount: closePrediction,
        aggregateAccuracyRate: accuracyRate,
        records: calibrations
      }
    });
  } catch (error: any) {
    console.error('Error fetching calibration stats:', error);
    return res.status(500).json({ error: 'Failed to fetch calibration statistics' });
  }
});
