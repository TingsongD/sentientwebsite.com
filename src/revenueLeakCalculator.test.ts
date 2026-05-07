import { describe, expect, it } from 'vitest'
import {
  calculateDemoRoi,
  calculateRecoveryRoi,
  DEFAULT_DEMO_ROI_INPUTS,
  getRecoveryUseCaseConfig,
  RECOVERY_USE_CASES,
} from './data/revenueLeakCalculator'

describe('revenue recovery ROI calculator helpers', () => {
  it('matches the default demo recovery estimate', () => {
    const estimate = calculateDemoRoi(DEFAULT_DEMO_ROI_INPUTS)

    expect(estimate.currentDemos).toBe(20)
    expect(estimate.recoveredDemos).toBe(10)
    expect(estimate.qualifiedBookedDemos).toBe(10)
    expect(estimate.pipelineInfluenced).toBe(36000)
    expect(estimate.estimatedFee).toBe(1000)
    expect(estimate.modeledRoi).toBe(3600)
  })

  it('uses the minimum fee when recovered action volume is low', () => {
    const estimate = calculateRecoveryRoi({
      ...DEFAULT_DEMO_ROI_INPUTS,
      monthlyMoments: 200,
      recoveredLiftRate: 1,
    })

    expect(estimate.recoveredActions).toBe(2)
    expect(estimate.estimatedFee).toBe(500)
    expect(estimate.pipelineInfluenced).toBe(7200)
    expect(estimate.modeledRoi).toBe(1440)
  })

  it('ships calculator presets for all four revenue recovery use cases', () => {
    expect(RECOVERY_USE_CASES.map((useCase) => useCase.key)).toEqual([
      'demo-recovery',
      'failed-payment-recovery',
      'no-show-recovery',
      'buyer-insights',
    ])

    for (const useCase of RECOVERY_USE_CASES) {
      const estimate = calculateRecoveryRoi(useCase.defaults)

      expect(estimate.recoveredActions, useCase.key).toBeGreaterThan(0)
      expect(estimate.pipelineInfluenced, useCase.key).toBeGreaterThan(0)
      expect(useCase.stages, useCase.key).toHaveLength(5)
      expect(useCase.inputLabels.monthlyMoments, useCase.key).toBeTruthy()
      expect(useCase.resultLabels.recoveredActions, useCase.key).toBeTruthy()
    }
  })

  it('calculates payment, no-show, and insight presets with use-case-specific assumptions', () => {
    const payment = calculateRecoveryRoi(getRecoveryUseCaseConfig('failed-payment-recovery').defaults)
    expect(payment.recoveredActions).toBe(24)
    expect(payment.pipelineInfluenced).toBe(5184)
    expect(payment.estimatedFee).toBe(840)

    const noShow = calculateRecoveryRoi(getRecoveryUseCaseConfig('no-show-recovery').defaults)
    expect(noShow.recoveredActions).toBe(9.6)
    expect(noShow.pipelineInfluenced).toBe(28800)
    expect(noShow.estimatedFee).toBe(720)

    const insights = calculateRecoveryRoi(getRecoveryUseCaseConfig('buyer-insights').defaults)
    expect(insights.recoveredActions).toBe(10)
    expect(insights.pipelineInfluenced).toBe(16000)
    expect(insights.estimatedFee).toBe(1000)
  })
})
