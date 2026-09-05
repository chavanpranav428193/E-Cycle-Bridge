import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

export interface VoiceButtonProps {
  onResult: (parsed: any) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSamples?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onResult,
  className = '',
  size = 'md',
  showSamples = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [activeLang, setActiveLang] = useState<'hi' | 'mr' | 'en'>('hi');
  const [interimText, setInterimText] = useState('');

  const samplePhrases = [
    { label: 'Hindi', lang: 'hi' as const, text: '१० किलो कंप्यूटर बोर्ड बेचना है' },
    { label: 'Marathi', lang: 'mr' as const, text: '१५ किलो तांब्याची वायर आहे काय भाव मिळेल' },
    { label: 'English', lang: 'en' as const, text: 'I have 5 kg lithium batteries, check price' },
  ];

  const handleToggleListening = async () => {
    if (isListening) {
      setIsListening(false);
      setInterimText('');
      return;
    }

    // Check browser SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = activeLang === 'hi' ? 'hi-IN' : activeLang === 'mr' ? 'mr-IN' : 'en-IN';

        setIsListening(true);
        setInterimText('Listening...');

        recognition.onresult = async (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInterimText(transcript);

          if (event.results[0].isFinal) {
            setIsListening(false);
            const parsed = await apiClient.parseVoice(transcript);
            onResult(parsed);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback to demo trigger
          handleSimulatedVoice(samplePhrases.find((p) => p.lang === activeLang)?.text || samplePhrases[0].text);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition failed, falling back to simulated audio:', e);
      }
    }

    // Fallback simulation
    const phrase = samplePhrases.find((p) => p.lang === activeLang)?.text || samplePhrases[0].text;
    handleSimulatedVoice(phrase);
  };

  const handleSimulatedVoice = async (phraseText: string) => {
    setIsListening(true);
    setInterimText(`"${phraseText}"`);
    setTimeout(async () => {
      setIsListening(false);
      const parsed = await apiClient.parseVoice(phraseText);
      onResult(parsed);
    }, 1200);
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-xs gap-1.5',
    md: 'h-11 px-4 text-sm gap-2',
    lg: 'h-13 px-6 text-base gap-2.5',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleListening}
          className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all select-none shadow-sm ${
            sizeClasses[size]
          } ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500/30 active:scale-95'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Voice search'}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 shrink-0" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 shrink-0" />
              <span>Voice Input (बोलून सांगा)</span>
            </>
          )}
        </button>

        {/* Language selector chips */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1 text-xs">
          {(['hi', 'mr', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeLang === lang ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'hi' ? 'हिंदी' : lang === 'mr' ? 'मराठी' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      {interimText && (
        <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 shrink-0 animate-bounce" />
          <span className="italic">{interimText}</span>
        </div>
      )}

      {showSamples && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
          <span className="text-slate-400">Try saying:</span>
          {samplePhrases.map((sp) => (
            <button
              key={sp.lang}
              type="button"
              onClick={() => handleSimulatedVoice(sp.text)}
              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              {sp.label}: "{sp.text.slice(0, 16)}..."
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
