import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router"
import AuthPage from "@/features/auth/auth-page"
import DashboardLayout from "@/features/dashboard/dashboard-layout"
import FilesPage from "@/features/files/files-page"
import LandingPage from "@/features/landing/landing-page"
import PrivacyPage from "@/features/privacy/privacy-page"
import SearchPage from "@/features/search/search-page"

// Opens each page at the top. Without it the browser keeps the previous page's scroll position.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="search" replace />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="files" element={<FilesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
