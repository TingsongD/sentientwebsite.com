import { describe, expect, it } from 'vitest'
import {
  calculateProductEstimate,
  calculateServiceEstimate,
  PRICING_ROUTE_PATHS,
  TRACKS,
} from './data/pricingStrategy'

describe('pricing strategy helpers', () => {
  it('calculates product recovery estimates from the pricing strategy formula', () => {
    const estimate = calculateProductEstimate({
      visitors: 10000,
      averageOrderValue: 100,
      abandonmentRate: 70,
    })

    expect(estimate.recoveries).toBe(1050)
    expect(estimate.recoveredRevenue).toBe(52500)
    expect(estimate.fee).toBe(11000)
    expect(estimate.clientKeeps).toBe(41500)
  })

  it('calculates service recovery estimates from the pricing strategy formula', () => {
    const estimate = calculateServiceEstimate({
      visitors: 5000,
      averageTicket: 500,
      bookingRate: 3,
    })

    expect(estimate.bookings).toBe(150)
    expect(estimate.recoveredRevenue).toBe(75000)
    expect(estimate.fee).toBe(5500)
    expect(estimate.clientKeeps).toBe(69500)
  })

  it('exports the pricing deep links and both pricing tracks', () => {
    expect(PRICING_ROUTE_PATHS).toEqual([
      '/pricing/product',
      '/pricing/service',
      '/pricing/calculator',
      '/pricing/enterprise',
    ])
    expect(Object.keys(TRACKS)).toEqual(['product', 'service'])
  })
})
