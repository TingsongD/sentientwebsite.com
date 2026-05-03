import { Route, Routes } from 'react-router-dom'
import { APP_DYNAMIC_ROUTE_PATTERNS, APP_ROUTE_PATHS } from './appRoutePatterns'
import { ConsentManager } from './components/ConsentManager'
import { RouteMeta } from './components/RouteMeta'
import AccessibilityStatementPage from './pages/AccessibilityStatementPage'
import AiDisclosurePage from './pages/AiDisclosurePage'
import AboutPage from './pages/AboutPage'
import BillingTermsPage from './pages/BillingTermsPage'
import CareersPage from './pages/CareersPage'
import ComingSoonPage from './pages/ComingSoonPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import DataRequestPage from './pages/DataRequestPage'
import DoNotSellPage from './pages/DoNotSellPage'
import DmcaPolicyPage from './pages/DmcaPolicyPage'
import HomePage from './pages/HomePage'
import LegalNoticePage from './pages/LegalNoticePage'
import NotFoundPage from './pages/NotFoundPage'
import PricingPage from './pages/PricingPage'
import RevenueLeakCalculatorPage from './pages/RevenueLeakCalculatorPage'
import SolutionIndustryPage from './pages/SolutionIndustryPage'
import TrustSecurityPage from './pages/TrustSecurityPage'
import IntegrationPage from './pages/IntegrationPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import SecurityResponsePage from './pages/SecurityResponsePage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import UnsubscribePage from './pages/UnsubscribePage'
import BlogIndexPage from './pages/BlogIndexPage'
import BlogPostPage from './pages/BlogPostPage'
import StatusPage from './pages/StatusPage'

export default function App({ includeMeta = true }: { includeMeta?: boolean }) {
  return (
    <>
      {includeMeta ? <RouteMeta /> : null}
      <Routes>
        <Route path={APP_ROUTE_PATHS.home} element={<HomePage />} />
        <Route path={APP_ROUTE_PATHS.status} element={<StatusPage />} />
        <Route path={APP_ROUTE_PATHS.blog} element={<BlogIndexPage />} />
        <Route path={APP_DYNAMIC_ROUTE_PATTERNS.blogPost} element={<BlogPostPage />} />
        <Route path={APP_ROUTE_PATHS.privacy} element={<PrivacyPolicyPage />} />
        <Route path={APP_ROUTE_PATHS.terms} element={<TermsOfServicePage />} />
        <Route path={APP_ROUTE_PATHS.cookies} element={<CookiePolicyPage />} />
        <Route path={APP_ROUTE_PATHS.billingTerms} element={<BillingTermsPage />} />
        <Route path={APP_ROUTE_PATHS.aiDisclosure} element={<AiDisclosurePage />} />
        <Route path={APP_ROUTE_PATHS.dataRequest} element={<DataRequestPage />} />
        <Route path={APP_ROUTE_PATHS.doNotSell} element={<DoNotSellPage />} />
        <Route path={APP_ROUTE_PATHS.accessibility} element={<AccessibilityStatementPage />} />
        <Route path={APP_ROUTE_PATHS.dmca} element={<DmcaPolicyPage />} />
        <Route path={APP_ROUTE_PATHS.securityResponse} element={<SecurityResponsePage />} />
        <Route path={APP_ROUTE_PATHS.unsubscribe} element={<UnsubscribePage />} />
        <Route path={APP_ROUTE_PATHS.legal} element={<LegalNoticePage />} />
        <Route path={APP_DYNAMIC_ROUTE_PATTERNS.integration} element={<IntegrationPage />} />
        <Route path={APP_ROUTE_PATHS.pricing} element={<PricingPage />} />
        <Route path={APP_ROUTE_PATHS.pricingProduct} element={<PricingPage />} />
        <Route path={APP_ROUTE_PATHS.pricingService} element={<PricingPage />} />
        <Route path={APP_ROUTE_PATHS.pricingCalculator} element={<PricingPage />} />
        <Route path={APP_ROUTE_PATHS.pricingEnterprise} element={<PricingPage />} />
        <Route path={APP_ROUTE_PATHS.revenueLeakCalculator} element={<RevenueLeakCalculatorPage />} />
        <Route path={APP_DYNAMIC_ROUTE_PATTERNS.solution} element={<SolutionIndustryPage />} />
        <Route path={APP_ROUTE_PATHS.knowledgeBase} element={<ComingSoonPage title="Knowledge base" />} />
        <Route path={APP_ROUTE_PATHS.apisSdks} element={<ComingSoonPage title="APIs & SDKs" />} />
        <Route path={APP_ROUTE_PATHS.documentation} element={<ComingSoonPage title="Documentation" />} />
        <Route path={APP_ROUTE_PATHS.changelog} element={<ComingSoonPage title="Changelog" />} />
        <Route path={APP_ROUTE_PATHS.trust} element={<TrustSecurityPage />} />
        <Route path={APP_ROUTE_PATHS.about} element={<AboutPage />} />
        <Route path={APP_ROUTE_PATHS.careers} element={<CareersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ConsentManager />
    </>
  )
}
