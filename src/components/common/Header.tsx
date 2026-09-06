import React, { useState, useEffect } from 'react';
import {
  Recycle,
  Wifi,
  WifiOff,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  PackageCheck,
  Building2,
  ShieldCheck,
  Compass,
  Mic,
  MapPin,
  Bell,
} from 'lucide-react';
import { UserRole, AppLanguage } from '../../types';
import { offlineStore } from '../../lib/offlineStore';
import { getTranslation } from '../../i18n/translations';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole?: (role: UserRole) => void;
  onRoleChange?: (role: UserRole) => void;
  language: AppLanguage;
  onSelectLanguage?: (lang: AppLanguage) => void;
  onLanguageChange?: (lang: AppLanguage) => void;
  isOfflineSimulated?: boolean;
  onToggleOffline?: () => void;
  onOpenJuryTour: () => void;
  onResetDemo?: () => void;
  onOpenVoice?: () => void;
  onOpenSell?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  onRoleChange,
  language,
  onSelectLanguage,
  onLanguageChange,
  isOfflineSimulated,
  onToggleOffline,
  onOpenJuryTour,
  onResetDemo,
  onOpenVoice,
  onOpenSell,
}) => {
  const [isOffline, setIsOffline] = useState(offlineStore.isOffline());
  const [isSimulated, setIsSimulated] = useState(offlineStore.isSimulatedOffline());
  const [pendingCount, setPendingCount] = useState(offlineStore.getOfflineQueue().length);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    if (onSelectRole) onSelectRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  const handleLangSelect = (lang: AppLanguage) => {
    if (onSelectLanguage) onSelectLanguage(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  useEffect(() => {
    const handleOfflineChange = () => {
      setIsOffline(offlineStore.isOffline());
      setIsSimulated(offlineStore.isSimulatedOffline());
    };

    const handleQueueChange = (e: any) => {
      setPendingCount(e.detail?.count || 0);
    };

    window.addEventListener('online', handleOfflineChange);
    window.addEventListener('offline', handleOfflineChange);
    window.addEventListener('ecycle:offline-change', handleOfflineChange);
    window.addEventListener('ecycle:queue-changed', handleQueueChange);

    return () => {
      window.removeEventListener('online', handleOfflineChange);
      window.removeEventListener('offline', handleOfflineChange);
      window.removeEventListener('ecycle:offline-change', handleOfflineChange);
      window.removeEventListener('ecycle:queue-changed', handleQueueChange);
    };
  }, []);

  const handleToggleSimulatedOffline = async () => {
    if (onToggleOffline) {
      onToggleOffline();
    } else {
      const next = !isSimulated;
      offlineStore.setSimulatedOffline(next);
      setIsSimulated(next);
      setIsOffline(offlineStore.isOffline());

      if (!next && pendingCount > 0) {
        setSyncNotice('Syncing pending actions to platform...');
        const synced = await offlineStore.syncQueue();
        setSyncNotice(`✓ Successfully synced ${synced} action(s)`);
        setTimeout(() => setSyncNotice(null), 3500);
      }
    }
  };

  const handleReset = () => {
    if (onResetDemo) {
      onResetDemo();
    } else {
      offlineStore.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Offline Status & Sync Alert Banner */}
      {isOffline && (
        <div className="bg-amber-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>
              {isSimulated ? 'Simulated Offline Mode Active' : 'Network Disconnected'} — Actions are safely queued locally
            </span>
            {pendingCount > 0 && (
              <span className="bg-amber-800 text-amber-100 px-2 py-0.5 rounded-full text-[11px]">
                {pendingCount} pending in sync queue
              </span>
            )}
          </div>
          <button
            onClick={handleToggleSimulatedOffline}
            className="underline hover:text-amber-100 text-xs cursor-pointer font-medium"
          >
            {isSimulated ? 'Disable Simulation' : 'Reconnect'}
          </button>
        </div>
      )}

      {syncNotice && (
        <div className="bg-primary-header text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Main Bar with Professional Polish theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div
          onClick={() => handleRoleSelect('landing')}
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-primary-header flex items-center justify-center text-white shadow-xs font-extrabold text-sm tracking-tight text-emerald-300 group-hover:bg-emerald-950 transition">
            EB
          </div>
          <div className="leading-tight">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                E-CYCLE BRIDGE
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase font-mono tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold px-1.5 py-0.5 rounded">
                SIH 229
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              From Collection to Circularity
            </p>
          </div>
        </div>

        {/* Center: Live Status & Location */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Nashik District, MH</span>
            <span className="text-stone-400">•</span>
            <span className="text-emerald-700 font-medium">Operational Hub</span>
          </div>

          <span className="text-xs font-medium text-stone-500 border border-stone-200 bg-white px-2.5 py-1 rounded-full">
            English
          </span>
        </div>

        {/* Role Navigation Switcher Tabs */}
        <nav className="hidden lg:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            id="nav-landing"
            onClick={() => handleRoleSelect('landing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition cursor-pointer ${
              currentRole === 'landing'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>Overview</span>
          </button>
          <button
            id="nav-collector"
            onClick={() => handleRoleSelect('collector')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition cursor-pointer ${
              currentRole === 'collector'
                ? 'bg-[#064E3B] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Collector Portal</span>
          </button>
          <button
            id="nav-recycler"
            onClick={() => handleRoleSelect('recycler')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition cursor-pointer ${
              currentRole === 'recycler'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Recycler Operations</span>
          </button>
          <button
            id="nav-admin"
            onClick={() => handleRoleSelect('admin')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition cursor-pointer ${
              currentRole === 'admin'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Center</span>
          </button>
          <button
            id="nav-passport"
            onClick={() => handleRoleSelect('public')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition cursor-pointer ${
              currentRole === 'public'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Passport</span>
          </button>
        </nav>

        {/* Right Actions: Quick Triggers & Tour */}
        <div className="flex items-center gap-2">
          {/* Real-time Notification Center Bell */}
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notification Center (Alerts, Payments, Sync)"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer border border-slate-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
              2
            </span>
          </button>

          {/* SIH Jury Tour Highlight Button */}
          <button
            id="btn-sih-tour"
            onClick={onOpenJuryTour}
            className="flex items-center space-x-1.5 bg-primary-action hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">SIH Jury Tour</span>
            <span className="sm:hidden">Tour</span>
          </button>

          {/* Offline Simulation Toggle */}
          <button
            id="btn-toggle-offline"
            onClick={handleToggleSimulatedOffline}
            title={isOffline ? 'Simulating Offline' : 'Online'}
            className={`flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              isOffline
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="hidden xl:inline text-[11px]">
              {isOffline ? 'Offline Mode' : 'Online'}
            </span>
          </button>

          {/* Reset Demo Button */}
          <button
            id="btn-reset-demo"
            onClick={handleReset}
            title="Reset to fresh demo state"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer border border-transparent hover:border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher Sub-bar */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-600">
        <button
          onClick={() => handleRoleSelect('landing')}
          className={`px-2.5 py-1 rounded-md ${currentRole === 'landing' ? 'bg-white text-slate-900 shadow-2xs font-bold' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => handleRoleSelect('collector')}
          className={`px-2.5 py-1 rounded-md ${currentRole === 'collector' ? 'bg-[#064E3B] text-white font-bold' : ''}`}
        >
          Collector
        </button>
        <button
          onClick={() => handleRoleSelect('recycler')}
          className={`px-2.5 py-1 rounded-md ${currentRole === 'recycler' ? 'bg-slate-900 text-white font-bold' : ''}`}
        >
          Recycler
        </button>
        <button
          onClick={() => handleRoleSelect('admin')}
          className={`px-2.5 py-1 rounded-md ${currentRole === 'admin' ? 'bg-slate-900 text-white font-bold' : ''}`}
        >
          Admin
        </button>
        <button
          onClick={() => handleRoleSelect('public')}
          className={`px-2.5 py-1 rounded-md ${currentRole === 'public' ? 'bg-slate-900 text-white font-bold' : ''}`}
        >
          Passport
        </button>
      </div>

      {/* Notification Center Drawer */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};
