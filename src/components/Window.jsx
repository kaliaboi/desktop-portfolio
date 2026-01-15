import { useRef, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";
import { useIsMobile, usePrefersReducedMotion } from "../hooks";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function Window({ id, title, children }) {
  const { state, focusWindow, closeWindow, updatePosition } = useDesktop();
  const windowState = state.windows[id];
  const isActive = state.activeWindowId === id;
  const windowRef = useRef(null);
  const dragControls = useDragControls();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Focus trap for active window
  useEffect(() => {
    if (isActive && windowRef.current) {
      const focusableElements = windowRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isActive]);

  // Escape key closes active window
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
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

  const handleDragEnd = (event, info) => {
    updatePosition(
      id,
      windowState.x + info.offset.x,
      windowState.y + info.offset.y
    );
  };

  const animationVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
      };

  if (!windowState.isOpen) return null;

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
        <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-b-foreground/30">
          <span className="text-sm font-medium text-foreground tracking-tight">
            {title}
          </span>
          <button
            onClick={() => closeWindow(id)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted-foreground/10 transition-colors text-foreground"
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
        "absolute w-[420px] max-w-[calc(100vw-40px)] bg-card rounded-lg border shadow-lg flex flex-col max-h-[70vh]",
        isActive && "ring-2 ring-ring"
      )}
      style={{
        x: windowState.x,
        y: windowState.y,
        zIndex: windowState.z,
      }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      initial={animationVariants.initial}
      animate={animationVariants.animate}
      exit={animationVariants.exit}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Title bar - drag handle */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-b-foreground/30 cursor-grab active:cursor-grabbing select-none bg-muted/50 rounded-t-lg"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <span className="text-sm font-medium tracking-tight text-foreground">
          {title}
        </span>
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

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-5">{children}</div>
    </motion.div>
  );
}
