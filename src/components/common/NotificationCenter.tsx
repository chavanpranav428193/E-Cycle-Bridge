import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Truck,
  Wifi,
  X,
  Sparkles,
} from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'payment' | 'offer' | 'sync' | 'safety' | 'recycler';
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Payment Confirmed',
      message: '₹2,125 payment recorded via Direct UPI for Lot EC-2026-000123.',
      time: '10 mins ago',
      read: false,
      type: 'payment',
    },
    {
      id: 'notif-2',
      title: 'Recycler Accepted Offer',
      message: 'GreenCycle Eco-Solutions confirmed your lot pickup request for 01:30 PM.',
      time: '35 mins ago',
      read: false,
      type: 'offer',
    },
    {
      id: 'notif-3',
      title: 'Collections Synced',
      message: 'You are back online. 3 saved offline collections synchronized with Firestore.',
      time: '1 hour ago',
      read: true,
      type: 'sync',
    },
    {
      id: 'notif-4',
      title: 'Safety Warning',
      message: 'Battery detected in Lot EC-2026-000186: Keep away from open heat sources and do not crush.',
      time: '3 hours ago',
      read: true,
      type: 'safety',
    },
    {
      id: 'notif-5',
      title: 'New Recycler Facility',
      message: 'Godavari E-Resource Refiners is now accepting insulated copper cables in Satpur.',
      time: '1 day ago',
      read: true,
      type: 'recycler',
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'offer':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'sync':
        return <Wifi className="w-4 h-4 text-teal-600" />;
      case 'safety':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'recycler':
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Live platform alerts & circular updates</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                n.read
                  ? 'bg-white border-slate-100 text-slate-700'
                  : 'bg-emerald-50/40 border-emerald-200/80 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500">
          Nashik Municipal Corporation & CPCB Corridor Alerts
        </div>
      </div>
    </div>
  );
};
