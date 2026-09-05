import React, { useState } from 'react';
import {
  ShieldAlert,
  BatteryWarning,
  Flame,
  Tv,
  CheckCircle2,
  XCircle,
  Volume2,
  AlertTriangle,
  FileText,
  PhoneCall,
} from 'lucide-react';
import { AppLanguage, SafetyGuide } from '../../types';
import { INITIAL_SAFETY_GUIDES } from '../../data/seedData';
import { getTranslation } from '../../i18n/translations';

interface SafetyGuideViewProps {
  language: AppLanguage;
  onBack: () => void;
}

export const SafetyGuideView: React.FC<SafetyGuideViewProps> = ({ language, onBack }) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(INITIAL_SAFETY_GUIDES[0].id);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const selectedGuide =
    INITIAL_SAFETY_GUIDES.find((g) => g.id === selectedGuideId) || INITIAL_SAFETY_GUIDES[0];

  const handleSpeakGuidance = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Audio speech is not supported in this browser.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>Collector Safety & Health Center</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Zero open burning, zero acid washing, zero toxic exposure
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Extreme Hazard Swollen Battery Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-stone-900 text-white rounded-2xl p-5 border border-rose-700 shadow-md space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 text-rose-300 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
            <span>High Risk: Swollen / Damaged Lithium Batteries</span>
          </div>
          <button
            onClick={() =>
              handleSpeakGuidance(
                language === 'mr'
                  ? 'धोका: बॅटरी फुगली असेल किंवा धूर निघत असेल तर लगेच कोरडी वाळू टाका आणि दूर राहा.'
                  : language === 'hi'
                  ? 'चेतावनी: यदि बैटरी फूली हुई या गर्म है, तो तुरंत उस पर सूखी रेत या मिट्टी डालें और दूर रहें।'
                  : 'Warning: If battery is swollen or warm, do not touch. Cover immediately with dry sand.'
              )
            }
            className="flex items-center space-x-1.5 bg-rose-800/80 hover:bg-rose-700 text-white text-xs px-2.5 py-1 rounded-lg transition"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen Alert</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-rose-100 leading-relaxed font-medium">
          {language === 'mr'
            ? 'धोका: बॅटरी फुगली असेल, गरम झाली असेल किंवा तिच्यातून दुर्गंधी येत असेल तर तिला उघड्या हाताने स्पर्श करू नका. त्यावर लगेच कोरडी वाळू किंवा माती टाका. कधीही कचऱ्यात फेकू नका किंवा जाळू नका.'
            : language === 'hi'
            ? 'चेतावनी: यदि बैटरी फूली हुई है, अत्यधिक गर्म है या गंध आ रही है, तो नंगे हाथों से न छुएं। तुरंत सूखी रेत या मिट्टी से ढकें और 10 मीटर की दूरी बनाए रखें। इसे कभी आग या कचरे में न डालें।'
            : 'CRITICAL ALERT: If a lithium cell is swollen, hot, or leaking, DO NOT touch with bare hands. Isolate in a dry sand bucket immediately. Puncturing or crushing creates violent thermal runaway flames.'}
        </p>
      </div>

      {/* Guide Category Selection Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {INITIAL_SAFETY_GUIDES.map((guide) => {
          const isSelected = guide.id === selectedGuideId;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`p-3 rounded-xl border text-left transition ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">
                  {guide.title[language] || guide.title.en}
                </span>
                <span
                  className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                    guide.dangerLevel === 'extreme'
                      ? 'bg-rose-500/20 text-rose-200'
                      : 'bg-amber-500/20 text-amber-200'
                  }`}
                >
                  {guide.dangerLevel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Card for Selected Guide */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {selectedGuide.title[language] || selectedGuide.title.en}
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              Hazard Protocol: {selectedGuide.dangerLevel.toUpperCase()} LEVEL
            </span>
          </div>

          <button
            onClick={() => {
              const textToRead = `${selectedGuide.title[language]}. ${selectedGuide.doList
                .map((d) => d[language] || d.en)
                .join('. ')}. ${selectedGuide.dontList.map((d) => d[language] || d.en).join('. ')}`;
              handleSpeakGuidance(textToRead);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isPlayingAudio
                ? 'bg-rose-100 text-rose-800 animate-pulse'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>{isPlayingAudio ? 'Speaking...' : 'Read Aloud'}</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Do List */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Safe Actions (Do's)</span>
            </h4>
            <ul className="space-y-2">
              {selectedGuide.doList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-stone-800">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{item[language] || item.en}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don't List */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center space-x-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Strictly Prohibited Actions (Don'ts)</span>
            </h4>
            <ul className="space-y-2">
              {selectedGuide.dontList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-stone-800">
                  <span className="text-rose-700 font-bold">✕</span>
                  <span>{item[language] || item.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Damage Protocol */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
            If Material is Damaged or Compromised:
          </span>
          <p className="text-xs sm:text-sm text-amber-950 font-medium">
            {selectedGuide.ifDamagedWarning[language] || selectedGuide.ifDamagedWarning.en}
          </p>
        </div>
      </div>
    </div>
  );
};
