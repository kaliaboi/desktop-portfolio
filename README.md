# Desktop Portfolio

A minimal, engineered desktop-style portfolio with draggable windows.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
desktop-portfolio/
├── index.html          # Entry HTML
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── src/
    ├── main.jsx        # React entry point
    ├── index.css       # Global styles + Tailwind
    └── App.jsx         # All components
```

## Architecture

### State Management
- Single `DesktopContext` with useReducer
- `topZ` counter increments monotonically (no array sorting)
- Window state: `{ id, isOpen, x, y, z }`

### Components
- `DesktopProvider` - Global state container
- `Desktop` - Renders windows and taskbar
- `Window` - Reusable, receives props only
- `Taskbar` - Open/focus windows

### Behaviors
- Click window → brings to front
- Drag title bar → moves window + focuses
- Escape key → closes active window
- Mobile → full-screen stacked panels

## Customization

### Add a new window

1. Add ID to `WINDOW_IDS` array
2. Add initial state to `initialState.windows`
3. Create content component
4. Add `<Window>` in `Desktop`

### Change colors

Edit Tailwind classes. The design uses `neutral` scale throughout.

### Modify animations

Edit `animationVariants` in `Window` component.
