import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { offlineStore } from '../../lib/offlineStore';

export interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const [isOffline, setIsOffline] = useState(offlineStore.isOffline());
  const [queueCount, setQueueCount] = useState(offlineStore.getQueueCount());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = offlineStore.subscribe(() => {
      setIsOffline(offlineStore.isOffline());
      setQueueCount(offlineStore.getQueueCount());
    });
    return unsubscribe;
  }, []);

  const handleToggleOffline = () => {
    offlineStore.setSimulatedOffline(!isOffline);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    await offlineStore.syncQueue();
    setIsSyncing(false);
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
        isOffline
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      } ${className}`}
    >
      <button
        onClick={handleToggleOffline}
        title={isOffline ? 'Click to switch Online' : 'Click to simulate Offline mode'}
        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
      >
        {isOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Offline Mode</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Online</span>
          </>
        )}
      </button>

      {queueCount > 0 && (
        <span className="bg-amber-500/30 px-1.5 py-0.2 rounded-full text-[10px] text-amber-200">
          {queueCount} pending
        </span>
      )}

      {isOffline ? (
        <button
          onClick={handleToggleOffline}
          className="text-[10px] underline ml-1 text-amber-200 hover:text-white"
        >
          Go Online
        </button>
      ) : (
        queueCount > 0 && (
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="text-[10px] flex items-center gap-1 text-emerald-300 hover:text-white ml-1"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync
          </button>
        )
      )}
    </div>
  );
};
