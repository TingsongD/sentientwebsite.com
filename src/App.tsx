import { Route, Routes } from 'react-router-dom'
import AboutPage from './pages/AboutPage'
import ComingSoonPage from './pages/ComingSoonPage'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'
import SolutionIndustryPage from './pages/SolutionIndustryPage'
import TrustSecurityPage from './pages/TrustSecurityPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/solutions/:slug" element={<SolutionIndustryPage />} />
      <Route path="/knowledge-base" element={<ComingSoonPage title="Knowledge base" />} />
      <Route path="/apis-sdks" element={<ComingSoonPage title="APIs & SDKs" />} />
      <Route path="/documentation" element={<ComingSoonPage title="Documentation" />} />
      <Route path="/changelog" element={<ComingSoonPage title="Changelog" />} />
      <Route path="/trust" element={<TrustSecurityPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}
