import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RetroWindow } from '../../../components/windows/RetroWindow';
import {
  Paintbrush,
  Eraser,
  Pipette,
  Undo2,
  Trash2,
  Download,
  Grid,
  Check,
  Sparkles,
} from 'lucide-react';

interface PixelStudioGameProps {
  onComplete: () => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => void;
}

const PALETTE = [
  '#211D29', // Ink
  '#FFFFFF', // White
  '#F0449B', // Action Pink
  '#A98BEF', // Brand Purple
  '#FFE17B', // Butter Yellow
  '#A8E8C2', // Mint Green
  '#83C9F5', // Sky Blue
  '#E07A5F', // Terra Cotta
  '#39264F', // Deep Plum
  '#588157', // Forest
  '#F4A261', // Peach Orange
  '#E63946', // Cherry
  '#457B9D', // Steel Blue
  '#DDA15E', // Sand
];

const STORAGE_KEY = 'sq_pixel_studio_draft_v1';

export const PixelStudioGame: React.FC<PixelStudioGameProps> = ({
  onComplete,
  onSoundTrigger,
}) => {
  const [gridSize, setGridSize] = useState<16 | 24>(16);
  const [currentColor, setCurrentColor] = useState<string>('#F0449B');
  const [activeTool, setActiveTool] = useState<'pencil' | 'eraser' | 'dropper'>('pencil');
  const [pixels, setPixels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 16 * 16) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return Array(16 * 16).fill('');
  });

  const [history, setHistory] = useState<string[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [exportedNotice, setExportedNotice] = useState(false);

  // Auto-save draft
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pixels));
    } catch {
      // ignore
    }
  }, [pixels]);

  // Handle grid size change
  const handleGridSizeChange = (newSize: 16 | 24) => {
    onSoundTrigger?.('click');
    setGridSize(newSize);
    setHistory([]);
    setPixels(Array(newSize * newSize).fill(''));
  };

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-15), [...pixels]]);
  }, [pixels]);

  const handlePixelAction = (index: number) => {
    if (activeTool === 'dropper') {
      const picked = pixels[index];
      if (picked) {
        setCurrentColor(picked);
        setActiveTool('pencil');
        onSoundTrigger?.('pop');
      }
      return;
    }

    const targetColor = activeTool === 'eraser' ? '' : currentColor;
    if (pixels[index] === targetColor) return;

    saveHistory();
    const next = [...pixels];
    next[index] = targetColor;
    setPixels(next);
    onSoundTrigger?.('click');
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    onSoundTrigger?.('pop');
    const prev = history[history.length - 1];
    setPixels(prev);
    setHistory((h) => h.slice(0, -1));
  };

  const handleClear = () => {
    saveHistory();
    setPixels(Array(gridSize * gridSize).fill(''));
    setShowClearConfirm(false);
    onSoundTrigger?.('boop');
  };

  // Export artwork directly to downloadable PNG
  const handleExportPNG = () => {
    onSoundTrigger?.('fanfare');
    const scale = 20; // 20px per pixel for crisp high-res
    const canvas = document.createElement('canvas');
    canvas.width = gridSize * scale;
    canvas.height = gridSize * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FFF9EA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pixels
    pixels.forEach((color, idx) => {
      if (color) {
        const x = (idx % gridSize) * scale;
        const y = Math.floor(idx / gridSize) * scale;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, scale, scale);
      }
    });

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `sidequest_pixel_${Date.now()}.png`;
    link.href = url;
    link.click();

    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 3000);
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Tool Palette & Controls */}
      <div className="p-4 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro flex flex-wrap items-center justify-between gap-4 select-none">
        {/* Tools (Pencil, Eraser, Dropper, Undo) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              setActiveTool('pencil');
            }}
            className={`px-3 py-1.5 border-2 border-[#211D29] text-xs font-interface font-bold btn-retro flex items-center gap-1.5 ${
              activeTool === 'pencil'
                ? 'bg-[#F0449B] text-white shadow-retro-sm'
                : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Pencil</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              setActiveTool('eraser');
            }}
            className={`px-3 py-1.5 border-2 border-[#211D29] text-xs font-interface font-bold btn-retro flex items-center gap-1.5 ${
              activeTool === 'eraser'
                ? 'bg-[#F0449B] text-white shadow-retro-sm'
                : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              setActiveTool('dropper');
            }}
            className={`px-3 py-1.5 border-2 border-[#211D29] text-xs font-interface font-bold btn-retro flex items-center gap-1.5 ${
              activeTool === 'dropper'
                ? 'bg-[#F0449B] text-white shadow-retro-sm'
                : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
            }`}
          >
            <Pipette className="w-3.5 h-3.5" />
            <span>Eyedropper</span>
          </button>

          <button
            type="button"
            disabled={history.length === 0}
            onClick={handleUndo}
            className={`px-2.5 py-1.5 border-2 border-[#211D29] bg-white text-xs font-interface font-bold btn-retro flex items-center gap-1 ${
              history.length === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#FFE17B]'
            }`}
            title="Undo stroke"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo ({history.length})</span>
          </button>
        </div>

        {/* Grid Size & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-interface mr-2">
            <span className="font-bold text-[#77717D]">Grid:</span>
            {[16, 24].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleGridSizeChange(size as 16 | 24)}
                className={`px-2 py-0.5 border border-[#211D29] text-xs font-mono font-bold ${
                  gridSize === size
                    ? 'bg-[#211D29] text-white'
                    : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                }`}
              >
                {size}x{size}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="p-1.5 border-2 border-[#211D29] bg-white hover:bg-[#F0449B] hover:text-white text-[#211D29] btn-retro shadow-retro-sm"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportPNG}
            className="px-3.5 py-1.5 border-2 border-[#211D29] bg-[#A8E8C2] hover:bg-[#83C9F5] text-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clear */}
      {showClearConfirm && (
        <div className="p-4 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] shadow-retro flex items-center justify-between gap-4">
          <span className="font-interface font-bold text-xs">
            Clear all pixels on this canvas? You can still undo afterward.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro"
            >
              Yes, Clear
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1 border border-[#211D29] bg-white text-[#211D29] font-interface text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success banner on Export */}
      {exportedNotice && (
        <div className="p-3 border-2 border-[#211D29] bg-[#A8E8C2] text-[#211D29] text-xs font-interface font-bold shadow-retro flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>PNG exported and saved to your downloads folder! ✦</span>
        </div>
      )}

      {/* Main Studio Canvas Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Drawing Board */}
        <div className="md:col-span-9 flex flex-col items-center justify-center p-4 md:p-6 border-2 border-[#211D29] bg-[#39264F] shadow-retro-lg overflow-x-auto">
          <div
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onTouchStart={() => setIsDrawing(true)}
            onTouchEnd={() => setIsDrawing(false)}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              width: gridSize === 16 ? 'min(440px, 85vw)' : 'min(500px, 90vw)',
              height: gridSize === 16 ? 'min(440px, 85vw)' : 'min(500px, 90vw)',
            }}
            className="border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro select-none cursor-crosshair touch-none"
          >
            {pixels.map((color, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Pixel ${idx + 1}, ${color ? `color ${color}` : 'empty'}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePixelAction(idx);
                  }
                }}
                onMouseDown={() => handlePixelAction(idx)}
                onMouseEnter={() => isDrawing && handlePixelAction(idx)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  if (element && element.hasAttribute('data-pixel-idx')) {
                    const touchedIdx = parseInt(element.getAttribute('data-pixel-idx') || '-1', 10);
                    if (touchedIdx >= 0) handlePixelAction(touchedIdx);
                  }
                }}
                data-pixel-idx={idx}
                className="border-[0.5px] border-[#211D29]/15 transition-colors focus-visible:outline-2 focus-visible:outline-[#F0449B] focus-visible:z-10 p-0 m-0 cursor-crosshair"
                style={{
                  backgroundColor: color || 'transparent',
                }}
              />
            ))}
          </div>

          <span className="text-[10px] font-mono text-[#FFF9EA]/70 mt-3">
            Click or drag across pixels to paint · Changes auto-save locally
          </span>
        </div>

        {/* Color Palette Sidebar */}
        <div className="md:col-span-3 space-y-4">
          <div className="p-4 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro">
            <div className="flex items-center justify-between mb-3">
              <span className="font-interface font-bold text-xs uppercase text-[#211D29]">
                Y2K Swatches
              </span>
              <div
                className="w-5 h-5 border-2 border-[#211D29] shadow-retro-sm"
                style={{ backgroundColor: currentColor }}
                title="Current active color"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PALETTE.map((color) => {
                const isActive = currentColor === color && activeTool !== 'eraser';
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setCurrentColor(color);
                      if (activeTool === 'eraser') setActiveTool('pencil');
                    }}
                    style={{ backgroundColor: color }}
                    className={`aspect-square border-2 border-[#211D29] transition-transform ${
                      isActive ? 'scale-110 shadow-retro-sm ring-2 ring-[#211D29]' : 'hover:scale-105'
                    }`}
                    title={color}
                  />
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#211D29]/15">
              <span className="text-[10px] font-mono text-[#77717D] block mb-1">
                HEX COLOR:
              </span>
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-full px-2 py-1 border border-[#211D29] font-mono text-xs uppercase bg-white text-[#211D29]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
