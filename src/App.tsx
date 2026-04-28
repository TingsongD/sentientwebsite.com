import { Route, Routes } from 'react-router-dom'
import { RouteMeta } from './components/RouteMeta'
import AboutPage from './pages/AboutPage'
import CareersPage from './pages/CareersPage'
import ComingSoonPage from './pages/ComingSoonPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PricingPage from './pages/PricingPage'
import SolutionIndustryPage from './pages/SolutionIndustryPage'
import TrustSecurityPage from './pages/TrustSecurityPage'
import IntegrationPage from './pages/IntegrationPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import BlogIndexPage from './pages/BlogIndexPage'
import BlogPostPage from './pages/BlogPostPage'
import StatusPage from './pages/StatusPage'

export default function App({ includeMeta = true }: { includeMeta?: boolean }) {
  return (
    <>
      {includeMeta ? <RouteMeta /> : null}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/integrations/:slug" element={<IntegrationPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/pricing/product" element={<PricingPage />} />
        <Route path="/pricing/service" element={<PricingPage />} />
        <Route path="/pricing/calculator" element={<PricingPage />} />
        <Route path="/pricing/enterprise" element={<PricingPage />} />
        <Route path="/solutions/:slug" element={<SolutionIndustryPage />} />
        <Route path="/knowledge-base" element={<ComingSoonPage title="Knowledge base" />} />
        <Route path="/apis-sdks" element={<ComingSoonPage title="APIs & SDKs" />} />
        <Route path="/documentation" element={<ComingSoonPage title="Documentation" />} />
        <Route path="/changelog" element={<ComingSoonPage title="Changelog" />} />
        <Route path="/trust" element={<TrustSecurityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
