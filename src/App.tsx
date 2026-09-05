import React, { useState, useEffect } from 'react';
import { UserRole, AppLanguage } from './types';
import { Header } from './components/common/Header';
import { JuryDemoModal } from './components/common/JuryDemoModal';
import { LandingPage } from './components/landing/LandingPage';
import { CollectorDashboard } from './components/collector/CollectorDashboard';
import { RecyclerDashboard } from './components/recycler/RecyclerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PublicPassportView } from './components/public/PublicPassportView';
import { offlineStore } from './lib/offlineStore';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('landing');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [showJuryTour, setShowJuryTour] = useState<boolean>(false);
  const [selectedPassportLot, setSelectedPassportLot] = useState<string>('EC-2026-000123');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Check initial simulated offline state
    setIsOfflineSimulated(offlineStore.getIsOfflineSimulated());

    const handleDataUpdate = () => {
      // Refresh component updates
    };
    window.addEventListener('ecycle:data-updated', handleDataUpdate);
    return () => window.removeEventListener('ecycle:data-updated', handleDataUpdate);
  }, []);

  const handleToggleOffline = () => {
    const nextState = !isOfflineSimulated;
    offlineStore.setIsOfflineSimulated(nextState);
    setIsOfflineSimulated(nextState);

    if (nextState) {
      setNotification('Simulated Offline Mode Active: Actions will queue in localStorage and auto-sync when back online.');
    } else {
      setNotification('Online Reconnected: Pending action queue synchronized with Firestore.');
    }

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleVerifyLot = (lotNumber: string) => {
    setSelectedPassportLot(lotNumber);
    setCurrentRole('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Platform Navigation Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        language={language}
        onSelectLanguage={setLanguage}
        isOfflineSimulated={isOfflineSimulated}
        onToggleOffline={handleToggleOffline}
        onOpenJuryTour={() => setShowJuryTour(true)}
      />

      {/* Global Notification Banner */}
      {notification && (
        <div className="bg-primary-header text-white text-xs py-2 px-4 text-center font-medium shadow-xs transition animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6">
        {currentRole === 'landing' && (
          <LandingPage
            onSelectRole={setCurrentRole}
            onOpenJuryTour={() => setShowJuryTour(true)}
            onVerifyLot={handleVerifyLot}
          />
        )}

        {currentRole === 'collector' && (
          <CollectorDashboard
            language={language}
            onVerifyLot={handleVerifyLot}
          />
        )}

        {currentRole === 'recycler' && (
          <RecyclerDashboard
            language={language}
            onVerifyLot={handleVerifyLot}
          />
        )}

        {currentRole === 'admin' && (
          <AdminDashboard
            onVerifyLot={handleVerifyLot}
          />
        )}

        {currentRole === 'public' && (
          <PublicPassportView
            initialLotNumber={selectedPassportLot}
            onSelectLot={setSelectedPassportLot}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            E-CYCLE BRIDGE — From Collection to Circularity (SIH 229 Prototype)
          </p>
          <p className="text-[11px] text-slate-400">
            Built for Smart India Hackathon 2024 / 2026. Empowering informal e-waste collectors with vernacular AI identification, fair pricing, and verifiable formal recycling in Nashik, Maharashtra.
          </p>
        </div>
      </footer>

      {/* SIH Jury Tour Modal */}
      <JuryDemoModal
        isOpen={showJuryTour}
        onClose={() => setShowJuryTour(false)}
        onJumpToRole={(role) => {
          setCurrentRole(role);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
