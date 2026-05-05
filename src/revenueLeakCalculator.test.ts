import { describe, expect, it } from 'vitest'
import { calculateDemoRoi, DEFAULT_DEMO_ROI_INPUTS } from './data/revenueLeakCalculator'

describe('B2B SaaS demo ROI calculator helpers', () => {
  it('matches the default demo recovery estimate', () => {
    const estimate = calculateDemoRoi(DEFAULT_DEMO_ROI_INPUTS)

    expect(estimate.currentDemos).toBe(20)
    expect(estimate.recoveredDemos).toBe(10)
    expect(estimate.qualifiedBookedDemos).toBe(10)
    expect(estimate.pipelineInfluenced).toBe(36000)
    expect(estimate.estimatedFee).toBe(1000)
    expect(estimate.modeledRoi).toBe(3600)
  })

  it('uses the minimum fee when recovered demo volume is low', () => {
    const estimate = calculateDemoRoi({
      ...DEFAULT_DEMO_ROI_INPUTS,
      highIntentVisitors: 200,
      recoveredDemoLiftRate: 1,
    })

    expect(estimate.recoveredDemos).toBe(2)
    expect(estimate.estimatedFee).toBe(500)
    expect(estimate.pipelineInfluenced).toBe(7200)
    expect(estimate.modeledRoi).toBe(1440)
  })
})
