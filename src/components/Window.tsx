import { useRef, useEffect, useState, ReactNode } from "react";
import { motion, useDragControls } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";
import { useIsMobile, usePrefersReducedMotion } from "../hooks";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { User, Briefcase, Mail, Maximize2, Minimize2 } from "lucide-react";
import { WindowId } from "../context/DesktopContext";

const WINDOW_ICONS = {
  about: User,
  projects: Briefcase,
  contact: Mail,
} as const;

interface WindowProps {
  id: WindowId;
  title: string;
  children: ReactNode;
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export function Window({ id, title, children }: WindowProps) {
  const { state, focusWindow, closeWindow, updatePosition, resizeWindow, toggleMaximize } = useDesktop();
  const windowState = state.windows[id];
  const isActive = state.activeWindowId === id;
  const windowRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const Icon = WINDOW_ICONS[id];
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null);
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    windowX: 0,
    windowY: 0,
  });

  // Focus trap for active window
  useEffect(() => {
    if (isActive && windowRef.current) {
      const focusableElements = windowRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isActive]);

  // Escape key closes active window
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeWindow(id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, closeWindow, id]);

  const handlePointerDown = () => {
    focusWindow(id);
  };

  const handleDragStart = () => {
    focusWindow(id);
  };

  const handleDragEnd = (event: any, info: any) => {
    updatePosition(
      id,
      windowState.x + info.offset.x,
      windowState.y + info.offset.y
    );
  };

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: windowState.width,
      height: windowState.height,
      windowX: windowState.x,
      windowY: windowState.y,
    };
    focusWindow(id);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      let newX = resizeStartRef.current.windowX;
      let newY = resizeStartRef.current.windowY;

      // Handle horizontal resizing
      if (resizeDirection?.includes('e')) {
        // Resize from right edge
        newWidth = Math.max(320, resizeStartRef.current.width + deltaX);
      } else if (resizeDirection?.includes('w')) {
        // Resize from left edge
        const potentialWidth = resizeStartRef.current.width - deltaX;
        if (potentialWidth >= 320) {
          newWidth = potentialWidth;
          newX = resizeStartRef.current.windowX + deltaX;
        } else {
          newWidth = 320;
          newX = resizeStartRef.current.windowX + (resizeStartRef.current.width - 320);
        }
      }

      // Handle vertical resizing
      if (resizeDirection?.includes('s')) {
        // Resize from bottom edge
        newHeight = Math.max(200, resizeStartRef.current.height + deltaY);
      } else if (resizeDirection?.includes('n')) {
        // Resize from top edge
        const potentialHeight = resizeStartRef.current.height - deltaY;
        if (potentialHeight >= 200) {
          newHeight = potentialHeight;
          newY = resizeStartRef.current.windowY + deltaY;
        } else {
          newHeight = 200;
          newY = resizeStartRef.current.windowY + (resizeStartRef.current.height - 200);
        }
      }

      resizeWindow(id, newWidth, newHeight);
      if (newX !== resizeStartRef.current.windowX || newY !== resizeStartRef.current.windowY) {
        updatePosition(id, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, id, resizeWindow, updatePosition]);

  const animationVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
      };

  // Mobile: full-screen panels
  if (isMobile) {
    return (
      <motion.div
        ref={windowRef}
        role="dialog"
        aria-modal={isActive}
        aria-label={title}
        className={`
          fixed inset-0
          bg-background
          flex flex-col
          ${isActive ? "z-50" : "z-40"}
        `}
        style={{ zIndex: windowState.z }}
        onPointerDown={handlePointerDown}
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        exit={animationVariants.exit}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between px-4 h-10 bg-muted border-b border-b-foreground/30">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className="text-xs font-medium text-foreground tracking-tight">
              {title}
            </span>
          </div>
          <button
            onClick={() => closeWindow(id)}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted-foreground/10 transition-colors text-foreground"
            aria-label={`Close ${title}`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 3L11 11M11 3L3 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </motion.div>
    );
  }

  // Desktop: draggable windows
  return (
    <motion.div
      ref={windowRef}
      role="dialog"
      aria-modal={isActive}
      aria-label={title}
      className={cn(
        "fixed bg-card rounded-lg border shadow-lg flex flex-col",
        isActive && "ring-2 ring-ring",
        isResizing && "select-none"
      )}
      style={{
        width: windowState.width,
        height: windowState.height,
        zIndex: windowState.z,
      }}
      drag={!windowState.isMaximized && !isResizing}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      initial={animationVariants.initial}
      animate={{
        x: windowState.x,
        y: windowState.y,
        opacity: 1,
        scale: 1,
      }}
      exit={animationVariants.exit}
      transition={{
        x: { duration: 0 },
        y: { duration: 0 },
        opacity: { duration: 0.15 },
        scale: { duration: 0.15 },
        ease: "easeOut",
      }}
    >
      {/* Title bar - drag handle */}
      <div
        className="flex items-center justify-between px-4 h-10 border-b border-b-foreground/30 cursor-grab active:cursor-grabbing select-none bg-muted/50 rounded-t-lg"
        onPointerDown={(e) => !windowState.isMaximized && dragControls.start(e)}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
          <span className="text-xs font-medium tracking-tight text-foreground">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize(id);
            }}
            aria-label={windowState.isMaximized ? "Restore" : "Maximize"}
          >
            {windowState.isMaximized ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            aria-label={`Close ${title}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2L10 10M10 2L2 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-5">{children}</div>

      {/* Resize handles - only show when not maximized */}
      {!windowState.isMaximized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-4 right-4 h-2 cursor-n-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
        </>
      )}
    </motion.div>
  );
}
