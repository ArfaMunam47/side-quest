import React, { useState, useEffect } from 'react';
import { RetroWindow } from '../../../components/windows/RetroWindow';
import {
  Droplets,
  Sprout,
  Sun,
  Sparkles,
  Trash2,
  Heart,
  Plus,
  Flower2,
  Check,
} from 'lucide-react';

interface PlantSpecies {
  id: string;
  name: string;
  seedlingIcon: string;
  growingIcon: string;
  bloomIcon: string;
  waterRequired: number;
  funFact: string;
}

const PLANT_TYPES: PlantSpecies[] = [
  {
    id: 'daisy',
    name: 'Sun Daisy',
    seedlingIcon: '🌱',
    growingIcon: '🌿',
    bloomIcon: '🌼',
    waterRequired: 3,
    funFact: 'Daisies close their petals at twilight to sleep.',
  },
  {
    id: 'fern',
    name: 'Cozy Fern',
    seedlingIcon: '🌱',
    growingIcon: '🌿',
    bloomIcon: '🪴',
    waterRequired: 4,
    funFact: 'Ferns have been living on Earth for over 360 million years.',
  },
  {
    id: 'succulent',
    name: 'Star Jade',
    seedlingIcon: '🌱',
    growingIcon: '🌵',
    bloomIcon: '🪷',
    waterRequired: 2,
    funFact: 'Succulents store water in their fleshy geometric leaves.',
  },
  {
    id: 'sunflower',
    name: 'Pocket Sunflower',
    seedlingIcon: '🌱',
    growingIcon: '🌿',
    bloomIcon: '🌻',
    waterRequired: 3,
    funFact: 'Young sunflowers track the sun across the sky all day.',
  },
  {
    id: 'mushroom',
    name: 'Spotted Morel',
    seedlingIcon: '🍄',
    growingIcon: '🍄',
    bloomIcon: '🍄✨',
    waterRequired: 2,
    funFact: 'Fungal mycelium acts like an underground forest internet.',
  },
  {
    id: 'tulip',
    name: 'Cosmic Tulip',
    seedlingIcon: '🌱',
    growingIcon: '🌷',
    bloomIcon: '🪻',
    waterRequired: 3,
    funFact: 'Tulips are famous for representing playful creative rebirth.',
  },
];

interface GardenSlot {
  slotId: number;
  plantId: string | null;
  waterCount: number;
  stage: 'seed' | 'growing' | 'bloom';
  plantedAt?: string;
}

const STORAGE_KEY = 'sq_tiny_garden_state_v1';

const INITIAL_SLOTS: GardenSlot[] = [
  { slotId: 0, plantId: 'daisy', waterCount: 3, stage: 'bloom', plantedAt: 'Initial' },
  { slotId: 1, plantId: 'fern', waterCount: 2, stage: 'growing', plantedAt: 'Initial' },
  { slotId: 2, plantId: null, waterCount: 0, stage: 'seed' },
  { slotId: 3, plantId: 'succulent', waterCount: 1, stage: 'seed', plantedAt: 'Initial' },
  { slotId: 4, plantId: null, waterCount: 0, stage: 'seed' },
  { slotId: 5, plantId: null, waterCount: 0, stage: 'seed' },
];

interface TinyGardenGameProps {
  onComplete: () => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => void;
}

export const TinyGardenGame: React.FC<TinyGardenGameProps> = ({
  onComplete,
  onSoundTrigger,
}) => {
  const [slots, setSlots] = useState<GardenSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_SLOTS;
  });

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [activeWaterAnimation, setActiveWaterAnimation] = useState<number | null>(null);
  const [sunShineEffect, setSunShineEffect] = useState(false);

  // Save changes locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
    } catch {
      // ignore
    }
  }, [slots]);

  // Water a plant
  const handleWaterSlot = (slotId: number) => {
    const slot = slots.find((s) => s.slotId === slotId);
    if (!slot || !slot.plantId) return;

    onSoundTrigger?.('pop');
    setActiveWaterAnimation(slotId);
    setTimeout(() => setActiveWaterAnimation(null), 600);

    const plantDef = PLANT_TYPES.find((p) => p.id === slot.plantId);
    if (!plantDef) return;

    const nextWater = slot.waterCount + 1;
    let nextStage: 'seed' | 'growing' | 'bloom' = slot.stage;

    if (nextWater >= plantDef.waterRequired) {
      nextStage = 'bloom';
      onSoundTrigger?.('chime');
    } else if (nextWater >= Math.ceil(plantDef.waterRequired / 2)) {
      nextStage = 'growing';
    }

    setSlots((prev) =>
      prev.map((s) =>
        s.slotId === slotId ? { ...s, waterCount: nextWater, stage: nextStage } : s
      )
    );

    // Check completion condition: at least 3 plants blooming
    const bloomingCount = slots.filter((s) => s.stage === 'bloom').length + (nextStage === 'bloom' && slot.stage !== 'bloom' ? 1 : 0);
    if (bloomingCount >= 3) {
      onSoundTrigger?.('fanfare');
      onComplete();
    }
  };

  // Plant a new seed
  const handlePlantSeed = (plantId: string) => {
    if (selectedSlot === null) return;
    onSoundTrigger?.('click');

    setSlots((prev) =>
      prev.map((s) =>
        s.slotId === selectedSlot
          ? {
              slotId: selectedSlot,
              plantId,
              waterCount: 0,
              stage: 'seed',
              plantedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : s
      )
    );
    setSelectedSlot(null);
  };

  // Clear slot
  const handleRemovePlant = (slotId: number) => {
    onSoundTrigger?.('boop');
    setSlots((prev) =>
      prev.map((s) =>
        s.slotId === slotId
          ? { slotId, plantId: null, waterCount: 0, stage: 'seed' }
          : s
      )
    );
    if (selectedSlot === slotId) setSelectedSlot(null);
  };

  const handleSunShine = () => {
    onSoundTrigger?.('chime');
    setSunShineEffect(true);
    setTimeout(() => setSunShineEffect(false), 800);
  };

  const bloomingTotal = slots.filter((s) => s.stage === 'bloom').length;

  return (
    <div className="space-y-6">
      {/* Greenhouse Control Header */}
      <div className="p-4 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-interface">
          <div className="flex items-center gap-1.5 font-bold text-[#211D29]">
            <Sprout className="w-4 h-4 text-[#A8E8C2]" />
            <span>TINY GREENHOUSE</span>
          </div>
          <span className="text-[#211D29]/30">|</span>
          <div className="font-mono text-[#77717D]">
            BLOOMS: <strong className="text-[#211D29] font-bold">{bloomingTotal}/6</strong>
          </div>
          <span className="text-[#211D29]/30">|</span>
          <div className="text-[11px] font-mono text-[#588157]">
            NO DEATH MECHANICS · NEVER WILTS
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSunShine}
            className="px-3 py-1.5 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro-sm flex items-center gap-1.5"
            title="Shine warm sunlight over all pots"
          >
            <Sun className={`w-3.5 h-3.5 ${sunShineEffect ? 'animate-spin' : ''}`} />
            <span>Sunlight</span>
          </button>
        </div>
      </div>

      {/* Main Greenhouse Bench */}
      <div
        className={`p-6 md:p-8 border-2 border-[#211D29] bg-[#39264F] shadow-retro-lg transition-all ${
          sunShineEffect ? 'brightness-110' : ''
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {slots.map((slot) => {
            const plantDef = PLANT_TYPES.find((p) => p.id === slot.plantId);
            const isSelected = selectedSlot === slot.slotId;
            const isWatering = activeWaterAnimation === slot.slotId;

            return (
              <div
                key={slot.slotId}
                className={`relative flex flex-col justify-between p-4 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro transition-all ${
                  isSelected ? 'ring-2 ring-[#F0449B] scale-102' : ''
                }`}
              >
                {/* Pot Header */}
                <div className="flex items-center justify-between text-xs font-interface text-[#77717D] mb-2">
                  <span className="font-mono text-[10px] font-bold">POT #{slot.slotId + 1}</span>
                  {plantDef && (
                    <button
                      type="button"
                      onClick={() => handleRemovePlant(slot.slotId)}
                      className="text-[#77717D] hover:text-[#F0449B]"
                      title="Clear this pot"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Plant Center Display */}
                <div className="h-28 flex flex-col items-center justify-center relative select-none">
                  {plantDef ? (
                    <>
                      <div className="text-4xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)] transition-transform hover:scale-110">
                        {slot.stage === 'seed'
                          ? plantDef.seedlingIcon
                          : slot.stage === 'growing'
                          ? plantDef.growingIcon
                          : plantDef.bloomIcon}
                      </div>

                      <span className="font-interface font-bold text-xs text-[#211D29] mt-2">
                        {plantDef.name}
                      </span>

                      <span className="text-[10px] text-[#77717D] font-mono capitalize">
                        {slot.stage}
                      </span>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onSoundTrigger?.('click');
                        setSelectedSlot(slot.slotId);
                      }}
                      className="w-full h-full border-2 border-dashed border-[#211D29]/30 hover:border-[#211D29] bg-white/40 flex flex-col items-center justify-center text-[#77717D] hover:text-[#211D29] transition-colors p-2"
                    >
                      <Plus className="w-6 h-6 mb-1 text-[#A8E8C2]" />
                      <span className="text-[10px] font-interface font-bold">Empty Pot</span>
                      <span className="text-[9px] text-[#77717D]">Tap to plant</span>
                    </button>
                  )}

                  {/* Water Droplets Animation */}
                  {isWatering && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Droplets className="w-10 h-10 text-[#83C9F5] animate-bounce" />
                    </div>
                  )}
                </div>

                {/* Pot Bottom / Water Interaction */}
                {plantDef && (
                  <div className="mt-3 pt-2 border-t border-[#211D29]/15 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#77717D]">
                      <Droplets className="w-3 h-3 text-[#83C9F5]" />
                      <span>{slot.waterCount}/{plantDef.waterRequired}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleWaterSlot(slot.slotId)}
                      className="px-2 py-1 border border-[#211D29] bg-[#83C9F5] hover:bg-[#FFE17B] text-[#211D29] text-xs font-interface font-bold btn-retro shadow-[1px_1px_0px_#211D29] flex items-center gap-1"
                    >
                      <span>Water</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Seed Selection Drawer (when an empty pot is clicked) */}
      {selectedSlot !== null && (
        <div className="p-5 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro">
          <div className="flex items-center justify-between mb-3 border-b border-[#211D29]/15 pb-2">
            <div>
              <h3 className="font-interface font-bold text-sm text-[#211D29]">
                Choose a Seed for Pot #{selectedSlot + 1}
              </h3>
              <p className="text-xs text-[#77717D]">
                Select any botanical variety. Water it to watch it grow.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSlot(null)}
              className="px-2 py-1 border border-[#211D29] text-xs font-bold hover:bg-[#FFE17B]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {PLANT_TYPES.map((plant) => (
              <button
                key={plant.id}
                type="button"
                onClick={() => handlePlantSeed(plant.id)}
                className="p-3 border-2 border-[#211D29] bg-white hover:bg-[#FFE17B] text-center btn-retro shadow-retro-sm flex flex-col items-center justify-between h-32"
              >
                <div className="text-3xl mb-1">{plant.bloomIcon}</div>
                <div>
                  <span className="font-interface font-bold text-xs text-[#211D29] block">
                    {plant.name}
                  </span>
                  <span className="text-[10px] text-[#77717D] font-mono">
                    {plant.waterRequired} sips of water
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
