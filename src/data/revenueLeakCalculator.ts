export type RecoveryUseCaseKey =
  | 'demo-recovery'
  | 'failed-payment-recovery'
  | 'no-show-recovery'
  | 'buyer-insights'

export type RecoveryRoiCalculatorInputs = {
  monthlyMoments: number
  currentRecoveryRate: number
  recoveredLiftRate: number
  averageValue: number
  actionToRevenueRate: number
  feePerRecoveredAction: number
  minimumFee: number
}

export type RecoveryRoiCalculation = {
  currentActions: number
  recoveredActions: number
  qualifiedRecoveredActions: number
  pipelineInfluenced: number
  estimatedFee: number
  modeledRoi: number
}

export type RecoveryUseCaseConfig = {
  key: RecoveryUseCaseKey
  label: string
  shortLabel: string
  eyebrow: string
  description: string
  inputLabels: {
    monthlyMoments: string
    currentRecoveryRate: string
    recoveredLiftRate: string
    averageValue: string
    actionToRevenueRate: string
  }
  resultLabels: {
    currentActions: string
    recoveredActions: string
    qualifiedRecoveredActions: string
    pipelineInfluenced: string
  }
  loopTitle: string
  loopBody: string
  stages: readonly { title: string; body: string }[]
  defaults: RecoveryRoiCalculatorInputs
}

export const RECOVERY_USE_CASES: readonly RecoveryUseCaseConfig[] = [
  {
    key: 'demo-recovery',
    label: 'Demo Recovery',
    shortLabel: 'Demo',
    eyebrow: 'Use case / Demo Recovery',
    description:
      'Model high-intent website visitors who can be qualified, routed to the right meeting path, and synced into the revenue stack.',
    inputLabels: {
      monthlyMoments: 'Monthly high-intent page visitors',
      currentRecoveryRate: 'Current demo conversion rate',
      recoveredLiftRate: 'Recovered demo lift',
      averageValue: 'Average contract value',
      actionToRevenueRate: 'Demo-to-opportunity rate',
    },
    resultLabels: {
      currentActions: 'Current demos from high-intent pages',
      recoveredActions: 'Estimated recovered demos',
      qualifiedRecoveredActions: 'Estimated qualified recovered actions',
      pipelineInfluenced: 'Estimated pipeline influenced',
    },
    loopTitle: 'Demo recovery loop from intent to qualified meeting.',
    loopBody:
      'Detect high-intent page behavior, qualify fit, open the right meeting path, sync the context, and keep the meeting visible.',
    stages: [
      {
        title: 'Detect',
        body: 'Identify revenue-ready behavior on pricing, demo, comparison, integration, security, docs, and customer-story pages.',
      },
      {
        title: 'Qualify',
        body: 'Confirm role, company domain, use case, stack, timing, urgency, and fit before opening the booking path.',
      },
      {
        title: 'Route',
        body: 'Send qualified visitors to the right scheduler, router, workflow, or owner with the buying context preserved.',
      },
      {
        title: 'Sync',
        body: 'Send pages viewed, qualification answers, summary, action details, and suggested opener to the revenue stack.',
      },
      {
        title: 'Remind',
        body: 'Send reminders and owner alerts so the meeting stays visible and the team starts prepared.',
      },
    ],
    defaults: {
      monthlyMoments: 1000,
      currentRecoveryRate: 2,
      recoveredLiftRate: 1,
      averageValue: 12000,
      actionToRevenueRate: 30,
      feePerRecoveredAction: 100,
      minimumFee: 500,
    },
  },
  {
    key: 'failed-payment-recovery',
    label: 'Failed Payment Recovery',
    shortLabel: 'Payment',
    eyebrow: 'Use case / Failed Payment Recovery',
    description:
      'Model failed-payment, retry, and cancellation-risk moments that can be classified, routed, retried, or escalated before revenue is lost.',
    inputLabels: {
      monthlyMoments: 'Monthly payment-risk moments',
      currentRecoveryRate: 'Current payment recovery rate',
      recoveredLiftRate: 'SentientWeb recovery lift',
      averageValue: 'Average revenue at risk',
      actionToRevenueRate: 'Recovery-to-retained-revenue rate',
    },
    resultLabels: {
      currentActions: 'Current recovered payment moments',
      recoveredActions: 'Estimated additional recoveries',
      qualifiedRecoveredActions: 'Estimated retained accounts',
      pipelineInfluenced: 'Estimated revenue retained',
    },
    loopTitle: 'Payment recovery loop from failed charge to retained revenue.',
    loopBody:
      'Detect billing risk, classify the reason, call the right retry or save workflow, and sync the outcome to the stack.',
    stages: [
      {
        title: 'Detect',
        body: 'Catch failed charges, renewal friction, cancellation intent, and account-risk signals as they happen.',
      },
      {
        title: 'Classify',
        body: 'Separate card failure, plan confusion, budget issue, low-value account, and high-value save paths.',
      },
      {
        title: 'Recover',
        body: 'Call billing, messaging, support, CRM, or webhook tools to trigger the right recovery action.',
      },
      {
        title: 'Sync',
        body: 'Write retry, save, cancellation, owner task, and write-off outcomes back to the revenue stack.',
      },
      {
        title: 'Report',
        body: 'Show which payment moments were recovered and which policies or pages need repair.',
      },
    ],
    defaults: {
      monthlyMoments: 300,
      currentRecoveryRate: 22,
      recoveredLiftRate: 8,
      averageValue: 240,
      actionToRevenueRate: 90,
      feePerRecoveredAction: 35,
      minimumFee: 500,
    },
  },
  {
    key: 'no-show-recovery',
    label: 'No-Show Recovery',
    shortLabel: 'No-show',
    eyebrow: 'Use case / No-Show Recovery',
    description:
      'Model booked meetings that can be reminded, rescheduled, or routed to an owner while the original buying context is still useful.',
    inputLabels: {
      monthlyMoments: 'Monthly booked meetings at risk',
      currentRecoveryRate: 'Current no-show recovery rate',
      recoveredLiftRate: 'Reschedule recovery lift',
      averageValue: 'Average opportunity value',
      actionToRevenueRate: 'Reschedule-to-opportunity rate',
    },
    resultLabels: {
      currentActions: 'Current recovered no-shows',
      recoveredActions: 'Estimated additional reschedules',
      qualifiedRecoveredActions: 'Estimated protected meetings',
      pipelineInfluenced: 'Estimated pipeline protected',
    },
    loopTitle: 'No-show recovery loop from missed meeting to protected opportunity.',
    loopBody:
      'Use the original page context, reminder reason, reschedule path, and owner alert to recover missed meetings.',
    stages: [
      {
        title: 'Detect',
        body: 'Connect the booked meeting to page history, qualification answers, and the reason the visitor booked.',
      },
      {
        title: 'Remind',
        body: 'Send context-aware reminders before the meeting and immediate follow-up if the buyer misses it.',
      },
      {
        title: 'Reschedule',
        body: 'Open the right reschedule path with the original buying reason preserved.',
      },
      {
        title: 'Alert',
        body: 'Route high-intent no-shows to a human owner with the full context attached.',
      },
      {
        title: 'Sync',
        body: 'Update the CRM, scheduler, and messaging stack with reschedule and no-show outcomes.',
      },
    ],
    defaults: {
      monthlyMoments: 80,
      currentRecoveryRate: 10,
      recoveredLiftRate: 12,
      averageValue: 12000,
      actionToRevenueRate: 25,
      feePerRecoveredAction: 75,
      minimumFee: 500,
    },
  },
  {
    key: 'buyer-insights',
    label: 'Buyer Insights',
    shortLabel: 'Insights',
    eyebrow: 'Use case / Buyer Insights',
    description:
      'Model buyer hesitation signals that can become page repairs, playbook updates, objection follow-up, and weekly RevOps action.',
    inputLabels: {
      monthlyMoments: 'Monthly buyer hesitation signals',
      currentRecoveryRate: 'Current insight-to-action rate',
      recoveredLiftRate: 'SentientWeb insight lift',
      averageValue: 'Average pipeline value per action',
      actionToRevenueRate: 'Action-to-pipeline rate',
    },
    resultLabels: {
      currentActions: 'Current repair actions',
      recoveredActions: 'Estimated new repair actions',
      qualifiedRecoveredActions: 'Estimated qualified insights',
      pipelineInfluenced: 'Estimated pipeline influenced',
    },
    loopTitle: 'Buyer insight loop from hesitation signal to revenue repair.',
    loopBody:
      'Group buyer questions, exits, no-shows, and objections into page, playbook, sales, and RevOps repair work.',
    stages: [
      {
        title: 'Capture',
        body: 'Collect questions, exits, bookings, no-shows, cancellation signals, and buyer objections from high-intent moments.',
      },
      {
        title: 'Group',
        body: 'Cluster friction by page, role, use case, urgency, account type, and stack fit.',
      },
      {
        title: 'Prioritize',
        body: 'Rank the highest-value repair work for sales, founder, lifecycle, and RevOps review.',
      },
      {
        title: 'Repair',
        body: 'Turn repeated hesitation into page updates, follow-up plays, routing changes, and workflow rules.',
      },
      {
        title: 'Measure',
        body: 'Track which repair actions improve recovered actions and which issues keep leaking revenue.',
      },
    ],
    defaults: {
      monthlyMoments: 500,
      currentRecoveryRate: 4,
      recoveredLiftRate: 2,
      averageValue: 8000,
      actionToRevenueRate: 20,
      feePerRecoveredAction: 100,
      minimumFee: 500,
    },
  },
] as const

export const DEFAULT_RECOVERY_USE_CASE_KEY: RecoveryUseCaseKey = 'demo-recovery'

export const DEFAULT_RECOVERY_ROI_INPUTS =
  RECOVERY_USE_CASES.find((useCase) => useCase.key === DEFAULT_RECOVERY_USE_CASE_KEY)?.defaults ??
  RECOVERY_USE_CASES[0].defaults

export type DemoRoiCalculatorInputs = RecoveryRoiCalculatorInputs
export type DemoRoiCalculation = RecoveryRoiCalculation & {
  currentDemos: number
  recoveredDemos: number
  qualifiedBookedDemos: number
}

export const DEFAULT_DEMO_ROI_INPUTS: DemoRoiCalculatorInputs = DEFAULT_RECOVERY_ROI_INPUTS

function nonNegativeFinite(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function percentageRate(value: number) {
  return Math.min(nonNegativeFinite(value), 100)
}

export function getRecoveryUseCaseConfig(key: RecoveryUseCaseKey): RecoveryUseCaseConfig {
  return RECOVERY_USE_CASES.find((useCase) => useCase.key === key) ?? RECOVERY_USE_CASES[0]
}

export function calculateRecoveryRoi(input: RecoveryRoiCalculatorInputs): RecoveryRoiCalculation {
  const monthlyMoments = nonNegativeFinite(input.monthlyMoments)
  const currentRecoveryRate = percentageRate(input.currentRecoveryRate)
  const recoveredLiftRate = percentageRate(input.recoveredLiftRate)
  const averageValue = nonNegativeFinite(input.averageValue)
  const actionToRevenueRate = percentageRate(input.actionToRevenueRate)
  const feePerRecoveredAction = nonNegativeFinite(input.feePerRecoveredAction)
  const minimumFee = nonNegativeFinite(input.minimumFee)

  const currentActions = monthlyMoments * (currentRecoveryRate / 100)
  const recoveredActions = monthlyMoments * (recoveredLiftRate / 100)
  const qualifiedRecoveredActions = recoveredActions
  const pipelineInfluenced = qualifiedRecoveredActions * averageValue * (actionToRevenueRate / 100)
  const estimatedFee =
    qualifiedRecoveredActions > 0 ? Math.max(qualifiedRecoveredActions * feePerRecoveredAction, minimumFee) : 0

  return {
    currentActions,
    recoveredActions,
    qualifiedRecoveredActions,
    pipelineInfluenced,
    estimatedFee,
    modeledRoi:
      estimatedFee > 0
        ? (pipelineInfluenced / estimatedFee) * 100
        : 0,
  }
}

export function calculateDemoRoi(input: DemoRoiCalculatorInputs): DemoRoiCalculation {
  const estimate = calculateRecoveryRoi(input)

  return {
    ...estimate,
    currentDemos: estimate.currentActions,
    recoveredDemos: estimate.recoveredActions,
    qualifiedBookedDemos: estimate.qualifiedRecoveredActions,
  }
}
