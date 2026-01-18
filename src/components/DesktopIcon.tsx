'use client'

import { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDesktop } from '../context/DesktopContext';
import { useIsMobile } from '../hooks';
import { LucideIcon } from 'lucide-react';
import { WindowId } from '../context/DesktopContext';
import { playTapSound, playSelectSound } from '../lib/sounds';
import { FILE_SYSTEM } from '../types/filesystem';

interface IconData {
  id: WindowId;
  title: string;
  icon: LucideIcon;
}

export const ICON_DATA: IconData[] = FILE_SYSTEM.map(item => ({
  id: item.id as WindowId,
  title: item.name,
  icon: item.icon,
}));

interface DesktopIconProps {
  id: WindowId;
  title: string;
  icon: LucideIcon;
}

export function DesktopIcon({ id, title, icon: Icon }: DesktopIconProps) {
  const { state, selectIcon, deselectIcon, updateIconPosition } = useDesktop();
  const router = useRouter();
  const isSelected = state.selectedIconId === id;
  const isMobile = useIsMobile();
  const lastClickTime = useRef(0);
  const dragControls = useDragControls();
  const iconState = state.icons[id];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isMobile) {
      // Mobile: single tap to navigate
      playTapSound();
      router.push(`/${id}`);
    } else {
      // Desktop: single click to select, double click to navigate
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime.current;

      if (timeSinceLastClick < 300) {
        // Double click - navigate to route
        playTapSound();
        router.push(`/${id}`);
        deselectIcon();
      } else {
        // Single click - select icon
        playSelectSound();
        selectIcon(id);
      }

      lastClickTime.current = now;
    }
  };

  const handleDragEnd = (_event: any, info: any) => {
    updateIconPosition(id, iconState.x + info.offset.x, iconState.y + info.offset.y);
  };

  if (isMobile) {
    // iPhone-style icon
    return (
      <button
        onClick={handleClick}
        className="flex flex-col items-center gap-2 p-3 rounded-2xl active:bg-white/20 transition-colors"
      >
        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
          <Icon className="w-8 h-8 text-foreground" />
        </div>
        <span className="text-xs text-white font-medium drop-shadow-md text-center">
          {title}
        </span>
      </button>
    );
  }

  // Desktop icon - draggable and positioned absolutely
  return (
    <motion.button
      onClick={handleClick}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      initial={{
        x: iconState.x,
        y: iconState.y,
      }}
      animate={{
        x: iconState.x,
        y: iconState.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`
        absolute flex flex-col items-center gap-1 p-2 rounded
        transition-colors select-none cursor-pointer w-20
        ${isSelected ? 'bg-accent backdrop-blur-sm' : ''}
      `}
    >
      <div className="w-10 h-10 bg-card border rounded shadow-sm flex items-center justify-center pointer-events-none">
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <span className={`text-[10px] font-medium text-center leading-tight pointer-events-none ${isSelected ? 'text-primary-foreground bg-primary px-1 rounded' : 'text-foreground drop-shadow-sm'}`}>
        {title}
      </span>
    </motion.button>
  );
}
