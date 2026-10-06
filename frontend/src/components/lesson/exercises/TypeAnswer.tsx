'use client';

import React, { useRef } from 'react';
import { SanitizedExercise } from '@/types/api';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import { SpeakerIcon } from '@/components/icons';
import { speakText } from '@/lib/tts';

export interface TypeAnswerProps {
  exercise: SanitizedExercise;
  draftAnswer: any;
  onAnswerChange: (answer: any) => void;
  disabled?: boolean;
}

const SPANISH_SPECIAL_CHARS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡', 'ü'];

export function TypeAnswer({
  exercise,
  draftAnswer,
  onAnswerChange,
  disabled = false,
}: TypeAnswerProps) {
  const textValue: string = draftAnswer?.text || '';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCharInsert = (char: string) => {
    if (disabled) return;
    const current = textValue + char;
    onAnswerChange({ text: current });
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Speech bubble prompt */}
      <div className="flex items-center gap-4 mb-8 w-full max-w-lg">
        <OwlMascot expression="thinking" className="w-20 h-20 shrink-0" />
        <div className="relative bg-white border-2 border-swan p-4 rounded-2xl shadow-sm flex items-center gap-3 w-full">
          {exercise.audio_text && (
            <button
              onClick={() => speakText(exercise.audio_text!)}
              className="p-2 bg-macaw text-white rounded-xl hover:brightness-105 active:scale-95 transition-all"
            >
              <SpeakerIcon className="w-5 h-5" />
            </button>
          )}
          <span className="text-lg font-black text-eel">{exercise.prompt_text}</span>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-b-2 border-swan rotate-45" />
        </div>
      </div>

      {/* Input Textarea */}
      <div className="w-full max-w-lg mb-4">
        <textarea
          ref={textareaRef}
          value={textValue}
          disabled={disabled}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Type in Spanish..."
          rows={3}
          onChange={(e) => onAnswerChange({ text: e.target.value })}
          className="w-full p-4 rounded-2xl border-2 border-swan focus:border-macaw focus:ring-2 focus:ring-sky font-bold text-eel text-lg resize-none outline-none transition-all"
        />
      </div>

      {/* Spanish special characters keypad */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-lg">
        {SPANISH_SPECIAL_CHARS.map((char) => (
          <button
            key={char}
            disabled={disabled}
            onClick={() => handleCharInsert(char)}
            className="w-9 h-9 flex items-center justify-center font-black text-sm bg-polar border border-swan rounded-xl text-eel hover:bg-swan/60 active:scale-95 transition-all select-none"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}
