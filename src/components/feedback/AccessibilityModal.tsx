import React, { useState, useEffect } from 'react';
import { RetroWindow } from '../windows/RetroWindow';
import { AccessibilitySettings } from '../../types/quest';
import { SlidersHorizontal, Volume2, Eye, Trash2, CheckCircle2 } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (updates: Partial<AccessibilitySettings>) => void;
  onClearData: () => void;
  onSoundTrigger?: (type?: 'click' | 'chime') => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearData,
  onSoundTrigger,
}) => {
  const [clearedNotice, setClearedNotice] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClear = () => {
    onClearData();
    setClearedNotice(true);
    onSoundTrigger?.('chime');
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211D29]/70 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div className="w-full max-w-lg">
        <RetroWindow
          title="Preferences & Accessibility"
          icon={<SlidersHorizontal className="w-4 h-4" />}
          headerColor="yellow"
          shadowSize="xl"
          onClose={onClose}
          footerContent={
            <span>Side Quest OS · Guest Settings stored in your browser</span>
          }
        >
          <div className="p-5 space-y-6 text-[#211D29]">
            {/* Font Sizing */}
            <div>
              <div className="flex items-center gap-2 mb-2 font-interface font-bold text-sm">
                <Eye className="w-4 h-4 text-[#F0449B]" />
                <h3 id="accessibility-title">Text Size</h3>
              </div>
              <p className="text-xs text-[#57525E] mb-3">
                Adjust interface legibility across all quests.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      onUpdateSettings({ fontSize: size });
                    }}
                    className={`py-2 px-3 border-2 border-[#211D29] font-interface font-semibold text-xs capitalize transition-all ${
                      settings.fontSize === size
                        ? 'bg-[#F0449B] text-white shadow-retro'
                        : 'bg-[#FFF9EA] text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {size === 'normal' && 'Normal (100%)'}
                    {size === 'large' && 'Large (115%)'}
                    {size === 'xlarge' && 'Extra Large (130%)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Motion & Animation */}
            <div className="pt-4 border-t border-[#211D29]/15">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-interface font-bold text-sm">
                    Reduced Motion
                  </div>
                  <p className="text-xs text-[#57525E]">
                    Disable celebratory shakes and playful hover transforms.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('click');
                    onUpdateSettings({ reducedMotion: !settings.reducedMotion });
                  }}
                  className={`px-3 py-1.5 border-2 border-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro-sm ${
                    settings.reducedMotion
                      ? 'bg-[#A8E8C2] text-[#211D29]'
                      : 'bg-[#FFF9EA] text-[#57525E]'
                  }`}
                >
                  {settings.reducedMotion ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Sound FX */}
            <div className="pt-4 border-t border-[#211D29]/15">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-[#83C9F5] mt-0.5" />
                  <div>
                    <div className="font-interface font-bold text-sm">
                      Synthesized Audio Effects
                    </div>
                    <p className="text-xs text-[#57525E]">
                      Play subtle 8-bit chimes and clicks on interaction.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('click');
                    onUpdateSettings({ soundEnabled: !settings.soundEnabled });
                  }}
                  className={`px-3 py-1.5 border-2 border-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro-sm ${
                    settings.soundEnabled
                      ? 'bg-[#83C9F5] text-[#211D29]'
                      : 'bg-[#FFF9EA] text-[#57525E]'
                  }`}
                >
                  {settings.soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Privacy & Clear Data */}
            <div className="pt-4 border-t border-[#211D29]/15">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-interface font-bold text-sm text-[#211D29]">
                    Local Storage & Privacy
                  </div>
                  <p className="text-xs text-[#57525E]">
                    All favorites and history live solely inside your browser.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#F0449B] hover:text-white text-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro-sm transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
              </div>

              {clearedNotice && (
                <div className="mt-3 flex items-center gap-2 p-2 border-2 border-[#211D29] bg-[#A8E8C2] text-[#211D29] text-xs font-interface font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#211D29]" />
                  <span>Local data successfully cleared!</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro hover:brightness-105"
              >
                Close Settings
              </button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  );
};
