import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import MedicinesPage from './pages/MedicinesPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import EmergencyPage from './pages/EmergencyPage';
import AiAssistantPage from './pages/AiAssistantPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import AiAssistantButton from './components/ai/AiAssistantButton';
import SplashScreen from './components/shared/SplashScreen';

function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="medicines" element={<MedicinesPage />} />
                <Route path="medicines/:id" element={<MedicineDetailPage />} />
                <Route path="emergency" element={<EmergencyPage />} />
                <Route path="ai-assistant" element={<AiAssistantPage />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </AnimatePresence>

          {/* Floating AI Assistant Button visible on all pages except AI Assistant page */}
          {location.pathname !== '/ai-assistant' && <AiAssistantButton />}
        </>
      )}
    </>
  );
}

export default App;