export type RevenueLeakInputs = {
  monthlySocialComments: number
  unansweredCommentRate: number
  commenterLeadRate: number
  socialCommentCustomerValue: number
  repliedSocialComments: number
  secondTouchRate: number
  secondTouchLeadRate: number
  socialFollowupCustomerValue: number
  monthlyReviews: number
  unansweredReviewRate: number
  averageStarRating: number
  reviewVisitors: number
  reviewCustomerValue: number
  monthlyChats: number
  chatNoResponseRate: number
  chatResponseTimeMinutes: number
  chatLeadRate: number
  chatCustomerValue: number
  monthlyEmails: number
  unansweredEmailRate: number
  salesQualifiedEmailRate: number
  emailCustomerValue: number
  monthlyFormSubmissions: number
  noOneHourFollowupRate: number
  neverFollowedUpRate: number
  averageFollowupTouches: number
  formCustomerValue: number
  monthlyWebsiteVisitors: number
  visitorLeadConversionRate: number
  visitorCustomerValue: number
  monthlyIntentVisitors: number
  inSessionConversionRate: number
  intentCustomerValue: number
  monthlyAddToCartEvents: number
  monthlyCompletedPurchases: number
  averageCartValue: number
  cartRecoveryRate: number
  monthlyCheckoutStarts: number
  monthlyCompletedCheckouts: number
  averageOrderValue: number
  checkoutRecoveryRate: number
  monthlyMeetingsBooked: number
  currentShowRate: number
  noShowRescheduleRate: number
  meetingCloseRate: number
  averageDealValue: number
}

export type LeakCalculation = {
  lostUnits: number
  monthlyLoss: number
}

export type RevenueLeakCalculation = {
  awareness: {
    socialComments: LeakCalculation
    socialFollowup: LeakCalculation
    reviews: LeakCalculation
    subtotal: number
  }
  engagement: {
    chats: LeakCalculation & {
      slowResponseRate: number
    }
    emails: LeakCalculation
    forms: LeakCalculation
    visitorsNotCaptured: LeakCalculation
    visitorsNotConvinced: LeakCalculation
    subtotal: number
  }
  conversion: {
    carts: LeakCalculation & {
      abandonmentRate: number
    }
    checkouts: LeakCalculation & {
      abandonmentRate: number
    }
    demoNoShows: LeakCalculation
    subtotal: number
  }
  totalMonthlyLeak: number
  annualLeak: number
  roiLow: number
  roiHigh: number
}

export const DEFAULT_REVENUE_LEAK_INPUTS: RevenueLeakInputs = {
  monthlySocialComments: 50,
  unansweredCommentRate: 60,
  commenterLeadRate: 10,
  socialCommentCustomerValue: 500,
  repliedSocialComments: 20,
  secondTouchRate: 10,
  secondTouchLeadRate: 25,
  socialFollowupCustomerValue: 500,
  monthlyReviews: 15,
  unansweredReviewRate: 50,
  averageStarRating: 3.8,
  reviewVisitors: 200,
  reviewCustomerValue: 500,
  monthlyChats: 80,
  chatNoResponseRate: 35,
  chatResponseTimeMinutes: 45,
  chatLeadRate: 20,
  chatCustomerValue: 500,
  monthlyEmails: 60,
  unansweredEmailRate: 40,
  salesQualifiedEmailRate: 30,
  emailCustomerValue: 500,
  monthlyFormSubmissions: 40,
  noOneHourFollowupRate: 50,
  neverFollowedUpRate: 25,
  averageFollowupTouches: 1.2,
  formCustomerValue: 500,
  monthlyWebsiteVisitors: 5000,
  visitorLeadConversionRate: 2,
  visitorCustomerValue: 500,
  monthlyIntentVisitors: 500,
  inSessionConversionRate: 8,
  intentCustomerValue: 500,
  monthlyAddToCartEvents: 300,
  monthlyCompletedPurchases: 90,
  averageCartValue: 85,
  cartRecoveryRate: 5,
  monthlyCheckoutStarts: 150,
  monthlyCompletedCheckouts: 90,
  averageOrderValue: 85,
  checkoutRecoveryRate: 10,
  monthlyMeetingsBooked: 20,
  currentShowRate: 50,
  noShowRescheduleRate: 40,
  meetingCloseRate: 25,
  averageDealValue: 2000,
}

const REVIEW_CONVERSION_IMPACT = 0.12
const REVIEW_BENCHMARK_HIGH = 0.08
const REVIEW_BENCHMARK_MID = 0.04
const REVIEW_BENCHMARK_LOW = 0.02
const LEAD_TO_CUSTOMER_RATE = 0.15
const OPTIMAL_FOLLOWUP_TOUCHES = 5
const VISITOR_LEAD_BENCHMARK = 0.05
const ACTIVE_ENGAGEMENT_BENCHMARK = 0.15
const CART_RECOVERY_BENCHMARK = 0.15
const CHECKOUT_RECOVERY_BENCHMARK = 0.25
const REMINDER_SHOW_RATE = 0.75
const SENTIENTWEB_COST_LOW = 500
const SENTIENTWEB_COST_HIGH = 2500

function rate(value: number) {
  return Math.max(0, value) / 100
}

function nonNegative(value: number) {
  return Math.max(0, value)
}

function reviewConversionRate(starRating: number) {
  if (starRating >= 4) return REVIEW_BENCHMARK_HIGH
  if (starRating >= 3) return REVIEW_BENCHMARK_MID
  return REVIEW_BENCHMARK_LOW
}

export function calculateRevenueLeaks(input: RevenueLeakInputs): RevenueLeakCalculation {
  const unansweredComments = input.monthlySocialComments * rate(input.unansweredCommentRate)
  const lostCommentLeads = unansweredComments * rate(input.commenterLeadRate)
  const socialComments = {
    lostUnits: lostCommentLeads,
    monthlyLoss: lostCommentLeads * input.socialCommentCustomerValue,
  }

  const missedSecondTouches = input.repliedSocialComments * (1 - rate(input.secondTouchRate))
  const lostSecondTouchLeads = missedSecondTouches * rate(input.secondTouchLeadRate)
  const socialFollowup = {
    lostUnits: lostSecondTouchLeads,
    monthlyLoss: lostSecondTouchLeads * input.socialFollowupCustomerValue,
  }

  const reviewVisitorsLost = input.reviewVisitors * REVIEW_CONVERSION_IMPACT
  const reviews = {
    lostUnits: reviewVisitorsLost * reviewConversionRate(input.averageStarRating),
    monthlyLoss:
      reviewVisitorsLost * reviewConversionRate(input.averageStarRating) * input.reviewCustomerValue,
  }

  const slowResponseRate =
    input.chatResponseTimeMinutes <= 5
      ? 0
      : Math.min(100, (input.chatResponseTimeMinutes / 75) * 100)
  const unansweredChats = input.monthlyChats * rate(input.chatNoResponseRate)
  const slowResponseEquivalentLost = input.monthlyChats * rate(slowResponseRate) * 0.5
  const lostChatLeads = (unansweredChats + slowResponseEquivalentLost) * rate(input.chatLeadRate)
  const chats = {
    lostUnits: lostChatLeads,
    monthlyLoss: lostChatLeads * input.chatCustomerValue,
    slowResponseRate,
  }

  const salesQualifiedUnansweredEmails =
    input.monthlyEmails * rate(input.unansweredEmailRate) * rate(input.salesQualifiedEmailRate)
  const emails = {
    lostUnits: salesQualifiedUnansweredEmails,
    monthlyLoss: salesQualifiedUnansweredEmails * input.emailCustomerValue,
  }

  const noQuickFollowup =
    input.monthlyFormSubmissions * rate(input.noOneHourFollowupRate)
  const neverFollowedUp = input.monthlyFormSubmissions * rate(input.neverFollowedUpRate)
  const followupTouchesRatio = Math.min(input.averageFollowupTouches, OPTIMAL_FOLLOWUP_TOUCHES) /
    OPTIMAL_FOLLOWUP_TOUCHES
  const insufficientFollowup =
    input.monthlyFormSubmissions *
    (1 - rate(input.neverFollowedUpRate)) *
    (1 - followupTouchesRatio)
  const insufficientFollowupWeighted = Math.round(insufficientFollowup * 0.3 * 10) / 10
  const lostFormLeads = neverFollowedUp + noQuickFollowup * 0.6 + insufficientFollowupWeighted
  const forms = {
    lostUnits: lostFormLeads * LEAD_TO_CUSTOMER_RATE,
    monthlyLoss: lostFormLeads * LEAD_TO_CUSTOMER_RATE * input.formCustomerValue,
  }

  const currentVisitorLeads =
    input.monthlyWebsiteVisitors * rate(input.visitorLeadConversionRate)
  const benchmarkVisitorLeads = input.monthlyWebsiteVisitors * VISITOR_LEAD_BENCHMARK
  const visitorsNotCapturedLeads = nonNegative(benchmarkVisitorLeads - currentVisitorLeads)
  const visitorsNotCaptured = {
    lostUnits: visitorsNotCapturedLeads * LEAD_TO_CUSTOMER_RATE,
    monthlyLoss:
      visitorsNotCapturedLeads * LEAD_TO_CUSTOMER_RATE * input.visitorCustomerValue,
  }

  const currentIntentConversions =
    input.monthlyIntentVisitors * rate(input.inSessionConversionRate)
  const benchmarkIntentConversions =
    input.monthlyIntentVisitors * ACTIVE_ENGAGEMENT_BENCHMARK
  const missedIntentConversions = nonNegative(
    benchmarkIntentConversions - currentIntentConversions,
  )
  const visitorsNotConvinced = {
    lostUnits: missedIntentConversions,
    monthlyLoss: missedIntentConversions * input.intentCustomerValue,
  }

  const abandonedCarts = nonNegative(
    input.monthlyAddToCartEvents - input.monthlyCompletedPurchases,
  )
  const missedCartRecoveries = nonNegative(
    abandonedCarts * CART_RECOVERY_BENCHMARK -
      abandonedCarts * rate(input.cartRecoveryRate),
  )
  const carts = {
    lostUnits: missedCartRecoveries,
    monthlyLoss: missedCartRecoveries * input.averageCartValue,
    abandonmentRate:
      input.monthlyAddToCartEvents > 0
        ? (abandonedCarts / input.monthlyAddToCartEvents) * 100
        : 0,
  }

  const abandonedCheckouts = nonNegative(
    input.monthlyCheckoutStarts - input.monthlyCompletedCheckouts,
  )
  const missedCheckoutRecoveries = nonNegative(
    abandonedCheckouts * CHECKOUT_RECOVERY_BENCHMARK -
      abandonedCheckouts * rate(input.checkoutRecoveryRate),
  )
  const checkouts = {
    lostUnits: missedCheckoutRecoveries,
    monthlyLoss: missedCheckoutRecoveries * input.averageOrderValue,
    abandonmentRate:
      input.monthlyCheckoutStarts > 0
        ? (abandonedCheckouts / input.monthlyCheckoutStarts) * 100
        : 0,
  }

  const currentNoShows =
    input.monthlyMeetingsBooked * (1 - rate(input.currentShowRate))
  const reminderNoShows = input.monthlyMeetingsBooked * (1 - REMINDER_SHOW_RATE)
  const preventedNoShows = nonNegative(currentNoShows - reminderNoShows)
  const rescheduledMeetings = preventedNoShows * rate(input.noShowRescheduleRate)
  const additionalClosedDeals = rescheduledMeetings * rate(input.meetingCloseRate)
  const demoNoShows = {
    lostUnits: additionalClosedDeals,
    monthlyLoss: additionalClosedDeals * input.averageDealValue,
  }

  const awarenessSubtotal =
    socialComments.monthlyLoss + socialFollowup.monthlyLoss + reviews.monthlyLoss
  const engagementSubtotal =
    chats.monthlyLoss +
    emails.monthlyLoss +
    forms.monthlyLoss +
    visitorsNotCaptured.monthlyLoss +
    visitorsNotConvinced.monthlyLoss
  const conversionSubtotal =
    carts.monthlyLoss + checkouts.monthlyLoss + demoNoShows.monthlyLoss
  const totalMonthlyLeak = awarenessSubtotal + engagementSubtotal + conversionSubtotal

  return {
    awareness: {
      socialComments,
      socialFollowup,
      reviews,
      subtotal: awarenessSubtotal,
    },
    engagement: {
      chats,
      emails,
      forms,
      visitorsNotCaptured,
      visitorsNotConvinced,
      subtotal: engagementSubtotal,
    },
    conversion: {
      carts,
      checkouts,
      demoNoShows,
      subtotal: conversionSubtotal,
    },
    totalMonthlyLeak,
    annualLeak: totalMonthlyLeak * 12,
    roiLow: (totalMonthlyLeak / SENTIENTWEB_COST_HIGH) * 100,
    roiHigh: (totalMonthlyLeak / SENTIENTWEB_COST_LOW) * 100,
  }
}
