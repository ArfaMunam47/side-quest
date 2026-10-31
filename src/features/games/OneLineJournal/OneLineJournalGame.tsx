import React, { useState, useEffect } from 'react';
import { RetroWindow } from '../../../components/windows/RetroWindow';
import {
  PenTool,
  Sparkles,
  RefreshCw,
  Save,
  Trash2,
  Calendar,
  Lock,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface JournalEntry {
  id: string;
  prompt: string;
  text: string;
  createdAt: string;
}

const PROMPTS_POOL = [
  'What is one physical texture you touched today that felt pleasant?',
  'What was one sound you heard earlier that you normally ignore?',
  'What is something you drank or ate today that was surprisingly good?',
  'Look at the room you are in. Name one object with a story.',
  'What is a thought or idea that made you smile recently?',
  'If your mood today were a vintage weather forecast, what would it be?',
  'What is something you are glad you didn’t do today?',
  'Name one tiny thing you can see outside a window right now.',
  'What is a song, sound, or melody stuck in your mind today?',
];

const STORAGE_KEY = 'sq_one_line_journal_entries_v1';

interface OneLineJournalGameProps {
  onComplete: () => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => void;
}

export const OneLineJournalGame: React.FC<OneLineJournalGameProps> = ({
  onComplete,
  onSoundTrigger,
}) => {
  const [promptIndex, setPromptIndex] = useState(0);
  const [entryText, setEntryText] = useState('');
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'entry-seed-1',
        prompt: 'What was one sound you heard earlier that you normally ignore?',
        text: 'The distant humming of the afternoon refrigerator and light wind on the window pane.',
        createdAt: 'Yesterday, 4:15 PM',
      },
    ];
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEntries));
    } catch {
      // ignore
    }
  }, [savedEntries]);

  const currentPrompt = PROMPTS_POOL[promptIndex];

  const handleSkipPrompt = () => {
    onSoundTrigger?.('boop');
    setPromptIndex((prev) => (prev + 1) % PROMPTS_POOL.length);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryText.trim()) return;

    onSoundTrigger?.('fanfare');

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      prompt: currentPrompt,
      text: entryText.trim(),
      createdAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setSavedEntries([newEntry, ...savedEntries]);
    setEntryText('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onComplete();
  };

  const handleDeleteEntry = (id: string) => {
    onSoundTrigger?.('pop');
    setSavedEntries(savedEntries.filter((e) => e.id !== id));
  };

  const handleExportJournal = () => {
    onSoundTrigger?.('chime');
    const content = savedEntries
      .map((e) => `[${e.createdAt}]\nPROMPT: ${e.prompt}\nENTRY: ${e.text}\n---\n`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sidequest_journal_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Bar */}
      <div className="p-3 border-2 border-[#211D29] bg-[#A8E8C2] text-[#211D29] shadow-retro-sm flex items-center justify-between text-xs font-interface">
        <div className="flex items-center gap-2 font-bold">
          <Lock className="w-4 h-4 text-[#211D29]" />
          <span>100% Client-Side Privacy: Words never leave your device.</span>
        </div>
        <button
          type="button"
          onClick={handleExportJournal}
          className="text-xs font-bold hover:underline flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export .txt</span>
        </button>
      </div>

      {/* Writing Box Window */}
      <RetroWindow
        title="ONE_LINE_JOURNAL.TXT"
        headerColor="purple"
        shadowSize="lg"
      >
        <div className="p-6 md:p-8 bg-retro-grid space-y-5">
          {/* Prompt sticky note */}
          <div className="p-4 border-2 border-[#211D29] bg-[#FFE17B] shadow-retro flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#77717D] font-bold">
                REFLECTIVE PROMPT
              </span>
              <p className="font-interface font-bold text-base text-[#211D29]">
                "{currentPrompt}"
              </p>
            </div>

            <button
              type="button"
              onClick={handleSkipPrompt}
              className="px-3 py-1.5 border border-[#211D29] bg-white hover:bg-[#A8E8C2] text-xs font-interface font-bold btn-retro shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Skip Prompt</span>
            </button>
          </div>

          {/* Form Text Input */}
          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div>
              <label htmlFor="journal-input" className="block text-xs font-interface font-bold text-[#211D29] mb-1.5">
                Your Single-Sentence Reflection:
              </label>
              <textarea
                id="journal-input"
                rows={3}
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="Type one unhurried thought here..."
                maxLength={280}
                className="w-full p-3 border-2 border-[#211D29] bg-white text-sm font-body text-[#211D29] placeholder:text-[#77717D] focus:outline-none focus:ring-0 shadow-retro-sm leading-relaxed"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#77717D] mt-1">
                <span>No pressure for length or poetic eloquence.</span>
                <span>{entryText.length}/280 chars</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={!entryText.trim()}
                className={`px-6 py-2.5 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro flex items-center gap-2 ${
                  !entryText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-105'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save Entry to Local Vault</span>
              </button>
            </div>
          </form>

          {savedSuccess && (
            <div className="p-3 border-2 border-[#211D29] bg-[#A8E8C2] text-[#211D29] text-xs font-interface font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thought recorded in your local archive! ✦</span>
            </div>
          )}
        </div>
      </RetroWindow>

      {/* Saved Entries History Archive */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-interface font-bold text-base text-[#FFF9EA]">
            SAVED JOURNAL VAULT ({savedEntries.length})
          </h3>
          <span className="text-xs text-[#FFF9EA]/60 font-mono">
            Stored in browser LocalStorage
          </span>
        </div>

        {savedEntries.length > 0 ? (
          <div className="space-y-3">
            {savedEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro flex items-start justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#77717D]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{entry.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="italic truncate">{entry.prompt}</span>
                  </div>
                  <p className="font-body text-sm text-[#211D29] leading-relaxed">
                    "{entry.text}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-1.5 border border-[#211D29] bg-white hover:bg-[#F0449B] hover:text-white text-[#77717D] btn-retro"
                  title="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 border-2 border-[#211D29] bg-[#FFF9EA] text-center shadow-retro">
            <p className="font-interface font-bold text-xs text-[#211D29]">
              Your journal vault is empty. Write your first thought above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
