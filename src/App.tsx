import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'
import SolutionIndustryPage from './pages/SolutionIndustryPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/solutions/:slug" element={<SolutionIndustryPage />} />
    </Routes>
  )
}
