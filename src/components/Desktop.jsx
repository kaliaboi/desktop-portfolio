import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks';
import { StatusBar } from './StatusBar';
import { DesktopIcons } from './DesktopIcons';
import { Window } from './Window';
import { AboutContent, ProjectsContent, ContactContent } from './WindowContent';
import { ContextMenu } from './ContextMenu';

export function Desktop() {
  const isMobile = useIsMobile();

  return (
    <div className={`fixed inset-0 overflow-hidden ${isMobile ? 'bg-gradient-to-br from-blue-400 to-purple-500' : 'bg-muted'}`}>
      {/* Status Bar */}
      <StatusBar />

      {/* Subtle grid pattern (desktop only) */}
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(163 163 163 / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(163 163 163 / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Desktop Icons */}
      <DesktopIcons />

      {/* Windows */}
      <AnimatePresence>
        <Window id="about" title="About">
          <AboutContent />
        </Window>
        <Window id="projects" title="Projects">
          <ProjectsContent />
        </Window>
        <Window id="contact" title="Contact">
          <ContactContent />
        </Window>
      </AnimatePresence>

      {/* Context Menu */}
      {!isMobile && <ContextMenu />}
    </div>
  );
}
