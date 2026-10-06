'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { speakText } from '@/lib/tts';
import { sfx } from '@/lib/sfx';
import { CrossIcon, SpeakerIcon, BookIcon, StarIcon } from '../icons';
import { OwlMascot } from '../mascot/OwlMascot';
import { Button } from '../ui/Button';

export interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId?: number;
  unitNumber: number;
  sectionNumber?: number;
  title: string;
  description?: string | null;
  themeColor?: string;
  themeShadowColor?: string;
  markdown?: string | null;
}

interface PhraseItem {
  spanish: string;
  english: string;
  phonetic?: string;
}

interface GrammarTip {
  title: string;
  explanation: string;
  examples: { label: string; translation: string; note?: string }[];
}

// Rich unit-specific curated guidebook contents
const UNIT_PRESETS: Record<number, { phrases: PhraseItem[]; grammarTips: GrammarTip[]; vocab: string[] }> = {
  1: {
    phrases: [
      { spanish: '¡Hola!', english: 'Hello!', phonetic: 'OH-lah' },
      { spanish: 'Buenos días', english: 'Good morning', phonetic: 'BWAY-nos DEE-ahs' },
      { spanish: 'Buenas noches', english: 'Good evening / Good night', phonetic: 'BWAY-nahs NO-chays' },
      { spanish: 'Mucho gusto', english: 'Nice to meet you', phonetic: 'MOO-cho GOO-stoh' },
      { spanish: 'Por favor', english: 'Please', phonetic: 'por fah-VOR' },
      { spanish: 'Muchas gracias', english: 'Thank you very much', phonetic: 'MOO-chas GRAH-syahs' },
      { spanish: 'Adiós, ¡hasta luego!', english: 'Goodbye, see you later!', phonetic: 'ah-DYOS, AH-stah LWAY-goh' },
    ],
    grammarTips: [
      {
        title: 'Gender in Spanish Nouns',
        explanation: 'All nouns in Spanish are either masculine or feminine. Words ending in -o are typically masculine, while words ending in -a are usually feminine.',
        examples: [
          { label: 'el niño', translation: 'the boy', note: 'Masculine (el / un)' },
          { label: 'la niña', translation: 'the girl', note: 'Feminine (la / una)' },
          { label: 'un hombre', translation: 'a man', note: 'Masculine' },
          { label: 'una mujer', translation: 'a woman', note: 'Feminine' },
        ],
      },
      {
        title: 'Inverted Punctuation (¡ and ¿)',
        explanation: 'In Spanish, questions and exclamations open with an inverted mark so you know the intonation before reading the sentence!',
        examples: [
          { label: '¿Cómo estás?', translation: 'How are you?' },
          { label: '¡Mucho gusto!', translation: 'Nice to meet you!' },
        ],
      },
    ],
    vocab: ['¡Hola!', 'Buenos días', 'Buenas noches', 'Gracias', 'Por favor', 'Mucho gusto', 'Adiós', 'Sí', 'No', 'Hombre', 'Mujer', 'Niño', 'Niña', 'Pan', 'Agua'],
  },
  2: {
    phrases: [
      { spanish: '¿Cómo te llamas?', english: 'What is your name?', phonetic: 'KOH-mo tay YAH-mas' },
      { spanish: 'Me llamo Carlos', english: 'My name is Carlos', phonetic: 'may YAH-mo KAR-los' },
      { spanish: '¿De dónde eres?', english: 'Where are you from?', phonetic: 'day DON-day EH-res' },
      { spanish: 'Soy de España', english: 'I am from Spain', phonetic: 'soy day es-PAH-nyah' },
      { spanish: '¿Cómo estás?', english: 'How are you?', phonetic: 'KOH-mo es-TAS' },
      { spanish: 'Estoy muy bien, gracias', english: 'I am doing great, thank you', phonetic: 'es-TOY moo-ee bee-EN' },
    ],
    grammarTips: [
      {
        title: 'Ser vs. Estar (To Be)',
        explanation: 'Spanish has two verbs for "to be". Use "ser" (soy, eres, es) for permanent identity and origin. Use "estar" (estoy, estás, está) for feelings and locations.',
        examples: [
          { label: 'Soy de México', translation: 'I am from Mexico (Origin / Ser)' },
          { label: 'Estoy feliz', translation: 'I am happy (Emotion / Estar)' },
        ],
      },
    ],
    vocab: ['Llamarse', 'Nombre', 'Dónde', 'De dónde', 'Bien', 'Muy', 'España', 'México', 'Amigo', 'Amiga', 'Feliz', 'Cansado'],
  },
  3: {
    phrases: [
      { spanish: 'Una mesa para dos, por favor', english: 'A table for two, please', phonetic: 'OO-nah MAY-sah PAH-rah dos' },
      { spanish: 'La cuenta, por favor', english: 'The check, please', phonetic: 'lah KWEN-tah por fah-VOR' },
      { spanish: '¿Dónde está el baño?', english: 'Where is the restroom?', phonetic: 'DON-day es-TAH el BAH-nyo' },
      { spanish: 'Quisiera un café con leche', english: 'I would like coffee with milk', phonetic: 'kee-SYEH-rah oon kah-FAY' },
      { spanish: '¿Aceptan tarjeta?', english: 'Do you accept card?', phonetic: 'ah-SEP-tan tar-HEH-tah' },
    ],
    grammarTips: [
      {
        title: 'Ordering Politely in Spanish',
        explanation: 'Use "quisiera" (I would like) or "por favor" (please) to order food and make polite requests at restaurants and stores.',
        examples: [
          { label: 'Quisiera agua, por favor', translation: 'I would like water, please' },
          { label: 'Un café, por favor', translation: 'A coffee, please' },
        ],
      },
    ],
    vocab: ['Restaurante', 'Mesa', 'Café', 'Cuenta', 'Baño', 'Agua', 'Leche', 'Tarjeta', 'Efectivo', 'Menú'],
  },
};

export function GuidebookModal({
  isOpen,
  onClose,
  unitId,
  unitNumber,
  sectionNumber = 1,
  title,
  description,
  themeColor = '#58CC02',
  themeShadowColor = '#58A700',
  markdown,
}: GuidebookModalProps) {
  const [speakingPhrase, setSpeakingPhrase] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'phrases' | 'grammar' | 'vocab'>('phrases');

  // Fetch backend guidebook markdown if unitId is provided
  useQuery({
    queryKey: ['guidebook', unitId],
    queryFn: () => (unitId ? api.getGuidebook(unitId) : null),
    enabled: Boolean(isOpen && unitId),
  });

  // Key phrase audio trigger
  const handlePlayAudio = (phrase: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sfx.play('tap');
    setSpeakingPhrase(phrase);
    speakText(phrase, { lang: 'es-ES' });
    setTimeout(() => {
      setSpeakingPhrase((prev) => (prev === phrase ? null : prev));
    }, 1400);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Preset or fallback data
  const preset = UNIT_PRESETS[unitNumber] || UNIT_PRESETS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Darkened backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Guidebook Dialog Window */}
      <div className="relative z-10 w-full max-w-2xl bg-[#131F24] border-2 border-[#37464F] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-left select-none">
        {/* 1. Header Banner styled with Unit Theme Color */}
        <div
          className="p-6 text-white relative flex flex-col justify-between overflow-hidden shadow-md shrink-0"
          style={{
            backgroundColor: themeColor,
            borderBottom: `4px solid ${themeShadowColor}`,
          }}
        >
          {/* Close button in top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-black/20 hover:bg-black/35 active:scale-95 flex items-center justify-center text-white transition-all z-20"
            aria-label="Close guidebook"
          >
            <CrossIcon className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-white/90">
            <BookIcon className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              SECTION {sectionNumber} • UNIT {unitNumber} GUIDEBOOK
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white mb-1.5">
            {title}
          </h2>

          <p className="text-xs sm:text-sm font-bold text-white/90 max-w-lg leading-relaxed">
            {description || 'Master essential greetings, conversational phrases, and grammar patterns for this unit.'}
          </p>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex border-b-2 border-[#37464F] bg-[#131F24] px-4 pt-2 gap-2 shrink-0">
          <button
            onClick={() => {
              sfx.play('tap');
              setActiveTab('phrases');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
              activeTab === 'phrases'
                ? 'text-[#1CB0F6] border-[#1CB0F6] bg-[#202F36]'
                : 'text-[#829BA8] border-transparent hover:text-[#F1F7FB]'
            }`}
          >
            <SpeakerIcon className="w-4 h-4" />
            Key Phrases ({preset.phrases.length})
          </button>

          <button
            onClick={() => {
              sfx.play('tap');
              setActiveTab('grammar');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
              activeTab === 'grammar'
                ? 'text-[#58CC02] border-[#58CC02] bg-[#202F36]'
                : 'text-[#829BA8] border-transparent hover:text-[#F1F7FB]'
            }`}
          >
            <StarIcon className="w-4 h-4" />
            Grammar Tips
          </button>

          <button
            onClick={() => {
              sfx.play('tap');
              setActiveTab('vocab');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
              activeTab === 'vocab'
                ? 'text-[#CE82FF] border-[#CE82FF] bg-[#202F36]'
                : 'text-[#829BA8] border-transparent hover:text-[#F1F7FB]'
            }`}
          >
            <span className="text-sm">📖</span>
            Word Bank
          </button>
        </div>

        {/* 3. Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: KEY PHRASES */}
          {activeTab === 'phrases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#829BA8]">
                <span>Tap any phrase or speaker button to hear pronunciation</span>
                <span className="text-[#58CC02] font-black">🔊 AUDIO ENABLED</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {preset.phrases.map((phrase, idx) => {
                  const isSpeaking = speakingPhrase === phrase.spanish;

                  return (
                    <div
                      key={idx}
                      onClick={() => handlePlayAudio(phrase.spanish)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSpeaking
                          ? 'bg-[#202F36] border-[#58CC02] shadow-md scale-[1.01]'
                          : 'bg-[#131F24] hover:bg-[#202F36] border-[#37464F]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1">
                        {/* 3D Round Speaker Button */}
                        <button
                          onClick={(e) => handlePlayAudio(phrase.spanish, e)}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all border-2 border-b-4 active:border-b-2 active:translate-y-0.5 ${
                            isSpeaking
                              ? 'bg-[#58CC02] border-[#46A302] text-white animate-pulse'
                              : 'bg-[#1CB0F6] hover:bg-[#1899D6] border-[#1899D6] text-white shadow-sm'
                          }`}
                        >
                          <SpeakerIcon className="w-6 h-6 text-white" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-base text-[#F1F7FB]">
                              {phrase.spanish}
                            </span>
                            {phrase.phonetic && (
                              <span className="text-[11px] font-bold text-[#829BA8] bg-[#202F36] px-2 py-0.5 rounded-md border border-[#37464F]">
                                /{phrase.phonetic}/
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#829BA8] block mt-0.5">
                            {phrase.english}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-black text-[#58CC02] opacity-0 hover:opacity-100 transition-opacity">
                        PLAY ▶
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GRAMMAR TIPS */}
          {activeTab === 'grammar' && (
            <div className="space-y-6">
              {preset.grammarTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl border-2 border-[#37464F] bg-[#131F24] space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#58CC02]/20 border-2 border-[#58CC02]/40 flex items-center justify-center shrink-0">
                      <OwlMascot expression="happy" className="w-9 h-9" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#58CC02] tracking-wider block">
                        GRAMMAR RULE {idx + 1}
                      </span>
                      <h3 className="font-black text-lg text-[#F1F7FB] mt-0.5">
                        {tip.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-[#829BA8] leading-relaxed">
                    {tip.explanation}
                  </p>

                  {/* Examples Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {tip.examples.map((ex, eIdx) => (
                      <div
                        key={eIdx}
                        onClick={() => handlePlayAudio(ex.label)}
                        className="p-3 rounded-2xl bg-[#202F36] border-2 border-[#37464F] hover:border-[#1CB0F6] cursor-pointer transition-all flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-black text-sm text-[#F1F7FB]">
                            {ex.label}
                          </div>
                          <div className="text-xs font-bold text-[#829BA8]">
                            {ex.translation}
                          </div>
                          {ex.note && (
                            <div className="text-[10px] font-extrabold text-[#1CB0F6] mt-0.5">
                              {ex.note}
                            </div>
                          )}
                        </div>
                        <SpeakerIcon className="w-5 h-5 text-[#829BA8] hover:text-[#1CB0F6] shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: WORD BANK */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#829BA8]">
                <span>Tap any word to listen to its pronunciation</span>
                <span className="text-[#CE82FF] font-black">{preset.vocab.length} Words</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {preset.vocab.map((word, wIdx) => (
                  <button
                    key={wIdx}
                    onClick={() => handlePlayAudio(word)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#202F36] hover:bg-[#2B3B44] active:scale-95 border-2 border-[#37464F] hover:border-[#CE82FF] transition-all text-sm font-black text-[#F1F7FB]"
                  >
                    <span>{word}</span>
                    <SpeakerIcon className="w-4 h-4 text-[#829BA8]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Bottom Actions Footer */}
        <div className="p-4 sm:p-5 border-t-2 border-[#37464F] bg-[#131F24] flex items-center justify-between gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#829BA8]">
            <span>💡 Keep reviewing key phrases before starting lessons!</span>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto px-8"
            onClick={() => {
              sfx.play('tap');
              onClose();
            }}
          >
            GOT IT
          </Button>
        </div>
      </div>
    </div>
  );
}
