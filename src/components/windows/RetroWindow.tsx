import React, { ReactNode } from 'react';

interface RetroWindowProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  headerColor?: 'purple' | 'pink' | 'yellow' | 'mint' | 'sky' | 'cream' | 'ink';
  className?: string;
  shadowSize?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  actionButtons?: ReactNode;
  footerContent?: ReactNode;
  statusBadge?: string;
}

const HEADER_BG_MAP = {
  purple: 'bg-[#A98BEF] text-[#211D29]',
  pink: 'bg-[#F0449B] text-white',
  yellow: 'bg-[#FFE17B] text-[#211D29]',
  mint: 'bg-[#A8E8C2] text-[#211D29]',
  sky: 'bg-[#83C9F5] text-[#211D29]',
  cream: 'bg-[#FFF9EA] text-[#211D29]',
  ink: 'bg-[#211D29] text-[#FFF9EA]',
};

const SHADOW_MAP = {
  sm: 'shadow-retro-sm',
  md: 'shadow-retro',
  lg: 'shadow-retro-lg',
  xl: 'shadow-retro-xl',
};

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  icon,
  children,
  headerColor = 'purple',
  className = '',
  shadowSize = 'lg',
  onClose,
  onMinimize,
  onMaximize,
  actionButtons,
  footerContent,
  statusBadge,
}) => {
  return (
    <div
      className={`border-2 border-[#211D29] bg-[#FFF9EA] ${SHADOW_MAP[shadowSize]} flex flex-col relative transition-shadow duration-150 ${className}`}
    >
      {/* Title Bar with Retro OS Horizontal Grip Ridges */}
      <div
        className={`relative flex items-center justify-between px-3 py-2 border-b-2 border-[#211D29] select-none ${HEADER_BG_MAP[headerColor]}`}
      >
        {/* Left: Window Icon + Title Lockup */}
        <div className="flex items-center gap-2 min-w-0 pr-3 z-10 bg-inherit shrink-0">
          {icon ? (
            <span className="w-5 h-5 border border-[#211D29] bg-[#FFF9EA] text-[#211D29] flex items-center justify-center text-xs shrink-0 shadow-[1px_1px_0px_#211D29]">
              {icon}
            </span>
          ) : (
            <span className="w-2.5 h-2.5 border border-[#211D29] bg-[#FFF9EA] inline-block shrink-0 shadow-[1px_1px_0px_#211D29]" />
          )}
          <span className="font-interface font-bold text-xs uppercase tracking-wider truncate">
            {title}
          </span>
          {statusBadge && (
            <span className="font-mono text-[9px] px-1.5 py-0.2 border border-[#211D29] bg-[#FFE17B] text-[#211D29] font-bold">
              {statusBadge}
            </span>
          )}
        </div>

        {/* Center: Classic Retro Window Grip Ridges Pattern */}
        <div className="hidden sm:block flex-1 h-3 titlebar-stripes mx-2 opacity-60" aria-hidden="true" />

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1.5 shrink-0 z-10 bg-inherit pl-2">
          {actionButtons}
          {onMinimize && (
            <button
              type="button"
              onClick={onMinimize}
              className="w-5 h-5 flex items-center justify-center border border-[#211D29] bg-[#FFF9EA] text-[#211D29] text-xs font-bold hover:bg-[#FFE17B] btn-retro shadow-[1px_1px_0px_#211D29]"
              aria-label="Minimize window"
              title="Minimize"
            >
              _
            </button>
          )}
          {onMaximize && (
            <button
              type="button"
              onClick={onMaximize}
              className="w-5 h-5 flex items-center justify-center border border-[#211D29] bg-[#FFF9EA] text-[#211D29] text-[10px] font-bold hover:bg-[#A8E8C2] btn-retro shadow-[1px_1px_0px_#211D29]"
              aria-label="Maximize window"
              title="Maximize"
            >
              □
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-5 h-5 flex items-center justify-center border border-[#211D29] bg-[#FFF9EA] text-[#211D29] text-xs font-bold hover:bg-[#F0449B] hover:text-white btn-retro shadow-[1px_1px_0px_#211D29]"
              aria-label="Close window"
              title="Close window"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Content Surface */}
      <div className="flex-1 bg-[#FFF9EA] overflow-hidden">{children}</div>

      {/* Window Status Bar Footer with Classic Resizer Corner Grip */}
      {(footerContent !== undefined || true) && (
        <div className="px-3 py-1.5 border-t-2 border-[#211D29] bg-[#FFF9EA] text-[11px] font-interface text-[#77717D] flex items-center justify-between select-none">
          <div className="truncate pr-2">
            {footerContent || <span>SIDE QUEST OS · READY</span>}
          </div>
          {/* Classic 3-line diagonal window resize corner grip */}
          <div className="w-3.5 h-3.5 resize-grip shrink-0 opacity-40" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};
