import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  ArrowRight,
  PackageCheck,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { parseVoiceTranscript, VoiceParseResult } from '../../lib/aiService';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onActionFromVoice: (result: VoiceParseResult) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onActionFromVoice,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parseResult, setParseResult] = useState<VoiceParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  // Pre-configured realistic voice commands in Marathi, Hindi, and English for quick testing
  const samplePrompts = [
    {
      label: 'Hindi: 10 किलो पीसीबी बेचना है',
      text: 'मेरे पास 10 किलो पुराना कंप्यूटर पीसीबी है, इसे बेचना है',
    },
    {
      label: 'Marathi: १० किलो केबल विकायची आहे',
      text: 'माझ्याकडे १० किलो तांब्याची केबल आहे, चांगला भाव काय मिळेल?',
    },
    {
      label: 'Hindi: खराब बैटरी कैसे संभालें?',
      text: 'फूली हुई लिथियम बैटरी को सुरक्षित कैसे रखें?',
    },
    {
      label: 'English: Sell 5kg scrap mobile phones',
      text: 'I have 5 kg scrap mobile phones to sell with doorstep pickup in Nashik',
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setTranscript('');
      setParseResult(null);
      setIsListening(false);
    }
  }, [isOpen]);

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the quick sample prompts below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      setIsListening(true);
      setTranscript('Listening...');

      recognition.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        await handleAnalyze(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleAnalyze = async (text: string) => {
    setIsParsing(true);
    const res = await parseVoiceTranscript(text, language);
    setParseResult(res);
    setIsParsing(false);
  };

  const handleApplyAction = () => {
    if (parseResult) {
      onActionFromVoice(parseResult);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary-header text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
              <Mic className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Collector Voice Assistant</h3>
              <p className="text-[11px] text-emerald-200">
                Supports Marathi, Hindi, and English e-waste voice queries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-950 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Big Microphone button & visualizer */}
          <div className="flex flex-col items-center justify-center space-y-3 pt-2">
            <button
              onClick={startSpeechRecognition}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-100'
                  : 'bg-primary-action hover:bg-emerald-800 text-white ring-8 ring-emerald-50'
              }`}
            >
              {isListening ? <Mic className="w-9 h-9 animate-bounce" /> : <Mic className="w-9 h-9" />}
            </button>
            <span className="text-xs font-semibold text-slate-600">
              {isListening ? 'Listening in Marathi / Hindi / English...' : 'Tap to speak your query'}
            </span>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wide text-stone-400 block mb-1">
                Transcript Detected
              </span>
              <p className="text-sm font-semibold text-stone-800 italic">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Parsed Result Card */}
          {parseResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Extracted Details</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                  {parseResult.confidence}% confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-stone-500 block">Material:</span>
                  <span className="font-bold text-stone-800">
                    {parseResult.detectedMaterialName || 'Not specified'}
                  </span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-stone-500 block">Est. Weight:</span>
                  <span className="font-bold text-stone-800">
                    {parseResult.approxWeight ? `${parseResult.approxWeight} kg` : 'To be weighed'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleApplyAction}
                className="w-full bg-primary-action hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer"
              >
                <PackageCheck className="w-4 h-4" />
                <span>
                  {parseResult.intent === 'SELL'
                    ? 'Start Lot Wizard with these Details'
                    : parseResult.intent === 'SAFETY_QUERY'
                    ? 'Open Safety Guide'
                    : 'View Fair Benchmark Price'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Demo Prompts */}
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Or Click a Test Voice Command:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(p.text);
                    handleAnalyze(p.text);
                  }}
                  className="text-left bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 p-2 rounded-lg text-[11px] text-stone-700 transition"
                >
                  <span className="font-bold block text-stone-900">{p.label}</span>
                  <span className="text-[10px] text-stone-500 truncate block">"{p.text}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
