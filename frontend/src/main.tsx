import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import './index.css'
import { AuthProvider } from './components/context/auth-context.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import HomePage from './pages/user/home/index.tsx'
import LoginPage from './pages/auth/login/index.tsx'
import SignupPage from './pages/auth/signup/index.tsx'
import NotFoundPage from './pages/not-found/index.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
