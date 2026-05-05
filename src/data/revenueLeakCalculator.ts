import {
  calculateDemoRecoveryEstimate,
  type DemoRecoveryCalculatorInput,
  type DemoRecoveryEstimate,
} from './pricingStrategy'

export type DemoRoiCalculatorInputs = DemoRecoveryCalculatorInput

export type DemoRoiCalculation = DemoRecoveryEstimate & {
  modeledRoi: number
}

export const DEFAULT_DEMO_ROI_INPUTS: DemoRoiCalculatorInputs = {
  highIntentVisitors: 1000,
  currentDemoConversionRate: 2,
  recoveredDemoLiftRate: 1,
  averageContractValue: 12000,
  demoToOpportunityRate: 30,
}

export function calculateDemoRoi(input: DemoRoiCalculatorInputs): DemoRoiCalculation {
  const estimate = calculateDemoRecoveryEstimate(input)

  return {
    ...estimate,
    modeledRoi:
      estimate.estimatedFee > 0
        ? (estimate.pipelineInfluenced / estimate.estimatedFee) * 100
        : 0,
  }
}
