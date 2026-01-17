import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export const WINDOW_IDS = ['about', 'projects', 'contact'];

// ============================================================================
// CONTEXT
// ============================================================================

const DesktopContext = createContext(null);

// ============================================================================
// INITIAL STATE
// ============================================================================

// Calculate centered position for a window with 16:9 aspect ratio
const getCenteredPosition = () => {
  const windowWidth = 640; // 16:9 ratio
  const windowHeight = 360;
  return {
    x: Math.max(20, (window.innerWidth - windowWidth) / 2),
    y: Math.max(60, (window.innerHeight - windowHeight) / 2),
  };
};

const centeredPos = getCenteredPosition();

const initialState = {
  topZ: 100,
  windows: {
    about: {
      id: 'about',
      isOpen: false,
      x: centeredPos.x,
      y: centeredPos.y,
      z: 100,
      width: 640,
      height: 360,
      isMaximized: false
    },
    projects: {
      id: 'projects',
      isOpen: false,
      x: 120,
      y: 100,
      z: 99,
      width: 640,
      height: 360,
      isMaximized: false
    },
    contact: {
      id: 'contact',
      isOpen: false,
      x: 180,
      y: 160,
      z: 98,
      width: 640,
      height: 360,
      isMaximized: false
    },
  },
  icons: {
    about: { id: 'about', x: 20, y: 60 },
    projects: { id: 'projects', x: 20, y: 150 },
    contact: { id: 'contact', x: 20, y: 240 },
  },
  activeWindowId: null,
  selectedIconId: null,
  contextMenu: null,
};

// ============================================================================
// REDUCER
// ============================================================================

function desktopReducer(state, action) {
  switch (action.type) {
    case 'FOCUS_WINDOW': {
      const { id } = action.payload;
      if (!state.windows[id]?.isOpen) return state;
      if (state.windows[id].z === state.topZ) {
        return { ...state, activeWindowId: id };
      }
      const newTopZ = state.topZ + 1;
      return {
        ...state,
        topZ: newTopZ,
        activeWindowId: id,
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], z: newTopZ },
        },
      };
    }

    case 'OPEN_WINDOW': {
      const { id } = action.payload;
      const newTopZ = state.topZ + 1;
      return {
        ...state,
        topZ: newTopZ,
        activeWindowId: id,
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], isOpen: true, z: newTopZ },
        },
      };
    }

    case 'CLOSE_WINDOW': {
      const { id } = action.payload;
      const openWindows = Object.values(state.windows).filter(
        (w) => w.isOpen && w.id !== id
      );
      const nextActive = openWindows.length
        ? openWindows.reduce((a, b) => (a.z > b.z ? a : b)).id
        : null;
      return {
        ...state,
        activeWindowId: nextActive,
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], isOpen: false },
        },
      };
    }

    case 'UPDATE_POSITION': {
      const { id, x, y } = action.payload;
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], x, y },
        },
      };
    }

    case 'SELECT_ICON': {
      const { id } = action.payload;
      return {
        ...state,
        selectedIconId: id,
      };
    }

    case 'DESELECT_ICON': {
      return {
        ...state,
        selectedIconId: null,
      };
    }

    case 'UPDATE_ICON_POSITION': {
      const { id, x, y } = action.payload;
      return {
        ...state,
        icons: {
          ...state.icons,
          [id]: { ...state.icons[id], x, y },
        },
      };
    }

    case 'SHOW_CONTEXT_MENU': {
      const { x, y } = action.payload;
      return {
        ...state,
        contextMenu: { x, y },
      };
    }

    case 'HIDE_CONTEXT_MENU': {
      return {
        ...state,
        contextMenu: null,
      };
    }

    case 'REORGANIZE_ICONS': {
      const iconIds = Object.keys(state.icons);
      const newIcons = {};
      iconIds.forEach((id, index) => {
        newIcons[id] = {
          ...state.icons[id],
          x: 20,
          y: 50 + (index * 90),
        };
      });
      return {
        ...state,
        icons: newIcons,
        contextMenu: null,
      };
    }

    case 'RESIZE_WINDOW': {
      const { id, width, height } = action.payload;
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], width, height },
        },
      };
    }

    case 'TOGGLE_MAXIMIZE': {
      const { id, viewportWidth, viewportHeight } = action.payload;
      const win = state.windows[id];
      if (win.isMaximized) {
        // Restore to previous size
        return {
          ...state,
          windows: {
            ...state.windows,
            [id]: {
              ...win,
              isMaximized: false,
              x: win.prevX,
              y: win.prevY,
              width: win.prevWidth,
              height: win.prevHeight,
            },
          },
        };
      } else {
        // Maximize (with some padding)
        const padding = 20;
        const taskbarHeight = 40;
        return {
          ...state,
          windows: {
            ...state.windows,
            [id]: {
              ...win,
              isMaximized: true,
              prevX: win.x,
              prevY: win.y,
              prevWidth: win.width,
              prevHeight: win.height,
              x: padding,
              y: padding + taskbarHeight,
              width: viewportWidth - padding * 2,
              height: viewportHeight - padding * 2 - taskbarHeight,
            },
          },
        };
      }
    }

    default:
      return state;
  }
}

// ============================================================================
// PROVIDER
// ============================================================================

export function DesktopProvider({ children }) {
  const [state, dispatch] = useReducer(desktopReducer, initialState);

  // Open About window after a slight delay on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'OPEN_WINDOW', payload: { id: 'about' } });
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, []);

  const focusWindow = useCallback((id) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: { id } });
  }, []);

  const openWindow = useCallback((id) => {
    dispatch({ type: 'OPEN_WINDOW', payload: { id } });
  }, []);

  const closeWindow = useCallback((id) => {
    dispatch({ type: 'CLOSE_WINDOW', payload: { id } });
  }, []);

  const updatePosition = useCallback((id, x, y) => {
    dispatch({ type: 'UPDATE_POSITION', payload: { id, x, y } });
  }, []);

  const selectIcon = useCallback((id) => {
    dispatch({ type: 'SELECT_ICON', payload: { id } });
  }, []);

  const deselectIcon = useCallback(() => {
    dispatch({ type: 'DESELECT_ICON' });
  }, []);

  const updateIconPosition = useCallback((id, x, y) => {
    dispatch({ type: 'UPDATE_ICON_POSITION', payload: { id, x, y } });
  }, []);

  const showContextMenu = useCallback((x, y) => {
    dispatch({ type: 'SHOW_CONTEXT_MENU', payload: { x, y } });
  }, []);

  const hideContextMenu = useCallback(() => {
    dispatch({ type: 'HIDE_CONTEXT_MENU' });
  }, []);

  const reorganizeIcons = useCallback(() => {
    dispatch({ type: 'REORGANIZE_ICONS' });
  }, []);

  const resizeWindow = useCallback((id, width, height) => {
    dispatch({ type: 'RESIZE_WINDOW', payload: { id, width, height } });
  }, []);

  const toggleMaximize = useCallback((id) => {
    dispatch({
      type: 'TOGGLE_MAXIMIZE',
      payload: {
        id,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      },
    });
  }, []);

  return (
    <DesktopContext.Provider
      value={{
        state,
        focusWindow,
        openWindow,
        closeWindow,
        updatePosition,
        selectIcon,
        deselectIcon,
        updateIconPosition,
        showContextMenu,
        hideContextMenu,
        reorganizeIcons,
        resizeWindow,
        toggleMaximize,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) throw new Error('useDesktop must be used within DesktopProvider');
  return context;
}
