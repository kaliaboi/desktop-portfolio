import { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useDesktop } from '../context/DesktopContext';
import { useIsMobile } from '../hooks';
import { User, Briefcase, Mail, LucideIcon } from 'lucide-react';
import { WindowId } from '../context/DesktopContext';
import { playTapSound, playSelectSound } from '../lib/sounds';

interface IconData {
  id: WindowId;
  title: string;
  icon: LucideIcon;
}

export const ICON_DATA: IconData[] = [
  { id: 'about', title: 'About', icon: User },
  { id: 'projects', title: 'Projects', icon: Briefcase },
  { id: 'contact', title: 'Contact', icon: Mail },
];

interface DesktopIconProps {
  id: WindowId;
  title: string;
  icon: LucideIcon;
}

export function DesktopIcon({ id, title, icon: Icon }: DesktopIconProps) {
  const { state, openWindow, selectIcon, deselectIcon, updateIconPosition } = useDesktop();
  const isSelected = state.selectedIconId === id;
  const isMobile = useIsMobile();
  const lastClickTime = useRef(0);
  const dragControls = useDragControls();
  const iconState = state.icons[id];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isMobile) {
      // Mobile: single tap to open
      playTapSound();
      openWindow(id);
    } else {
      // Desktop: single click to select, double click to open
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime.current;

      if (timeSinceLastClick < 300) {
        // Double click - open window
        playTapSound();
        openWindow(id);
        deselectIcon();
      } else {
        // Single click - select icon
        playSelectSound();
        selectIcon(id);
      }

      lastClickTime.current = now;
    }
  };

  const handleDragEnd = (event: any, info: any) => {
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
