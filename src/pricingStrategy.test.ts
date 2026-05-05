import { describe, expect, it } from 'vitest'
import {
  calculateDemoRecoveryEstimate,
  PRICING_ROUTE_PATHS,
  TRACKS,
} from './data/pricingStrategy'

describe('pricing strategy helpers', () => {
  it('calculates demo recovery estimates from the pricing strategy formula', () => {
    const estimate = calculateDemoRecoveryEstimate({
      highIntentVisitors: 1000,
      currentDemoConversionRate: 2,
      recoveredDemoLiftRate: 1,
      averageContractValue: 12000,
      demoToOpportunityRate: 30,
    })

    expect(estimate.currentDemos).toBe(20)
    expect(estimate.recoveredDemos).toBe(10)
    expect(estimate.qualifiedBookedDemos).toBe(10)
    expect(estimate.pipelineInfluenced).toBe(36000)
    expect(estimate.estimatedFee).toBe(1000)
  })

  it('sanitizes calculator inputs before estimating pricing outcomes', () => {
    const estimate = calculateDemoRecoveryEstimate({
      highIntentVisitors: -1000,
      currentDemoConversionRate: Number.NaN,
      recoveredDemoLiftRate: -5,
      averageContractValue: Number.POSITIVE_INFINITY,
      demoToOpportunityRate: -30,
    })

    expect(estimate.currentDemos).toBe(0)
    expect(estimate.recoveredDemos).toBe(0)
    expect(estimate.qualifiedBookedDemos).toBe(0)
    expect(estimate.pipelineInfluenced).toBe(0)
    expect(estimate.estimatedFee).toBe(500)
  })

  it('caps percentage inputs at 100 percent', () => {
    const estimate = calculateDemoRecoveryEstimate({
      highIntentVisitors: 100,
      currentDemoConversionRate: 250,
      recoveredDemoLiftRate: 125,
      averageContractValue: 1000,
      demoToOpportunityRate: 200,
    })

    expect(estimate.currentDemos).toBe(100)
    expect(estimate.recoveredDemos).toBe(100)
    expect(estimate.qualifiedBookedDemos).toBe(100)
    expect(estimate.pipelineInfluenced).toBe(100000)
    expect(estimate.estimatedFee).toBe(10000)
  })

  it('exports the legacy pricing deep links and demo recovery plans', () => {
    expect(PRICING_ROUTE_PATHS).toEqual([
      '/pricing/product',
      '/pricing/service',
      '/pricing/calculator',
      '/pricing/enterprise',
    ])
    expect(Object.keys(TRACKS)).toEqual(['pilot', 'starter', 'growth', 'scale'])
  })
})
