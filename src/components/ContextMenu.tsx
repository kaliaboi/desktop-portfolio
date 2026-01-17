import { useRef, useEffect } from "react";
import { useDesktop } from "../context/DesktopContext";
import { RefreshCw, RotateCcw, Eye, Info, LucideIcon } from "lucide-react";
import { playTapSound } from "../lib/sounds";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  action?: () => void;
  submenu?: boolean;
  separator?: never;
}

interface MenuSeparator {
  separator: true;
  label?: never;
  icon?: never;
  action?: never;
  submenu?: never;
}

type MenuItemType = MenuItem | MenuSeparator;

export function ContextMenu() {
  const { state, hideContextMenu, reorganizeIcons } = useDesktop();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        hideContextMenu();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideContextMenu();
      }
    };

    if (state.contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("contextmenu", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("contextmenu", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [state.contextMenu, hideContextMenu]);

  if (!state.contextMenu) return null;

  const menuItems: MenuItemType[] = [
    {
      label: "Reorganize Icons",
      icon: RefreshCw,
      action: reorganizeIcons,
    },
    {
      label: "Refresh",
      icon: RotateCcw,
      action: () => {
        window.location.reload();
      },
    },
    { separator: true },
    {
      label: "View",
      icon: Eye,
      submenu: true,
    },
    {
      label: "Properties",
      icon: Info,
      action: hideContextMenu,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bg-popover rounded-lg shadow-xl border py-1 min-w-[180px] z-[10000]"
      style={{
        left: state.contextMenu.x,
        top: state.contextMenu.y,
      }}
    >
      {menuItems.map((item, index) => {
        if (item.separator) {
          return (
            <div key={`separator-${index}`} className="h-px bg-border my-1" />
          );
        }

        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => {
              playTapSound();
              if (item.action) {
                item.action();
              }
            }}
            className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent flex items-center gap-3 transition-colors"
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
            {item.submenu && (
              <span className="ml-auto text-muted-foreground">▶</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
