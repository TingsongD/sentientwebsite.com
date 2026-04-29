import { describe, expect, it } from 'vitest'
import {
  calculateRevenueLeaks,
  DEFAULT_REVENUE_LEAK_INPUTS,
} from './data/revenueLeakCalculator'

describe('revenue leak calculator helpers', () => {
  it('matches the workflow default funnel totals', () => {
    const estimate = calculateRevenueLeaks(DEFAULT_REVENUE_LEAK_INPUTS)

    expect(Math.round(estimate.awareness.subtotal)).toBe(4230)
    expect(Math.round(estimate.engagement.subtotal)).toBe(39710)
    expect(Math.round(estimate.conversion.subtotal)).toBe(3550)
    expect(Math.round(estimate.totalMonthlyLeak)).toBe(47490)
    expect(Math.round(estimate.annualLeak)).toBe(569880)
  })

  it('prevents benchmark-based leaks from going negative', () => {
    const estimate = calculateRevenueLeaks({
      ...DEFAULT_REVENUE_LEAK_INPUTS,
      visitorLeadConversionRate: 8,
      inSessionConversionRate: 25,
      cartRecoveryRate: 30,
      checkoutRecoveryRate: 40,
      currentShowRate: 90,
    })

    expect(estimate.engagement.visitorsNotCaptured.monthlyLoss).toBe(0)
    expect(estimate.engagement.visitorsNotConvinced.monthlyLoss).toBe(0)
    expect(estimate.conversion.carts.monthlyLoss).toBe(0)
    expect(estimate.conversion.checkouts.monthlyLoss).toBe(0)
    expect(estimate.conversion.demoNoShows.monthlyLoss).toBe(0)
  })
})
