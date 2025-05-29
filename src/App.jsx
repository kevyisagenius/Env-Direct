import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import AIChatbot from './components/AIChatbot';
import { AuthProvider } from './context/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Import Page Components
const HomePage = lazy(() => import('./pages/HomePage'));
const EnvDashboardPage = lazy(() => import('./pages/EnvDashboardPage'));
const PredictionDashboardPage = lazy(() => import('./pages/PredictionDashboardPage'));
// const ClimateExplorerPage = lazy(() => import('./pages/ClimateExplorerPage'));
const ReportDetailPage = lazy(() => import('./pages/ReportDetailPage'));
const ReportsListPage = lazy(() => import('./pages/ReportsListPage'));
const LiveMapPage = lazy(() => import('./pages/LiveMapPage'));
const GreenAtlasMagazinePage = lazy(() => import('./pages/GreenAtlasMagazinePage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const SubmitArticlePage = lazy(() => import('./pages/SubmitArticlePage'));
const TrainingPage = lazy(() => import('./pages/TrainingPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ReportFormPage = lazy(() => import('./pages/ReportFormPage'));

// Auth Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
          <Navbar />
          <main className="flex-grow pt-16">
            <Suspense fallback={<div className='flex justify-center items-center h-screen'><Spinner /></div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<EnvDashboardPage />} />
                <Route path="/predictive-dashboard" element={<PredictionDashboardPage />} />
                {/* <Route path="/climate-explorer" element={<ClimateExplorerPage />} /> */}
                <Route path="/reports/:reportId" element={<ReportDetailPage />} />
                <Route path="/reports" element={<ReportsListPage />} />
                <Route path="/live-map" element={<LiveMapPage />} />
                <Route path="/green-atlas-magazine" element={<GreenAtlasMagazinePage />} />
                <Route path="/magazine/article/:articleId" element={<ArticleDetailPage />} />
                <Route path="/submit-article" element={<SubmitArticlePage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/submit-report" element={<ReportFormPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <AIChatbot />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
