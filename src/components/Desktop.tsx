'use client'

import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useIsMobile } from '../hooks';
import { useDesktop } from '../context/DesktopContext';
import { StatusBar } from './StatusBar';
import { DesktopIcons } from './DesktopIcons';
import { Window } from './Window';
import { MDXContent } from './MDXContent';
import { FolderContent } from './FolderContent';
import { DynamicMDXContent } from './DynamicMDXContent';
import { ContextMenu } from './ContextMenu';
import { FILE_SYSTEM } from '../types/filesystem';

export function Desktop() {
  const isMobile = useIsMobile();
  const { state, openWindow, closeWindow } = useDesktop();
  const router = useRouter();
  const pathname = usePathname();

  // Sync URL with open windows
  useEffect(() => {
    const path = pathname;

    // Map routes to window IDs
    if (path === '/about') {
      if (!state.windows.about.isOpen) openWindow('about');
    } else if (path === '/projects') {
      if (!state.windows.projects.isOpen) openWindow('projects');
    } else if (path === '/contact') {
      if (!state.windows.contact.isOpen) openWindow('contact');
    } else if (path.startsWith('/projects/')) {
      // Handle project file routes
      if (!state.windows.projects.isOpen) openWindow('projects');
    } else if (path === '/') {
      // Home - close all windows
      Object.keys(state.windows).forEach(id => {
        if (state.windows[id as keyof typeof state.windows].isOpen) {
          closeWindow(id as any);
        }
      });
    }
  }, [pathname]);

  const handleFileOpen = (path: string) => {
    // Navigate to the file route
    router.push(path.replace('/files', ''));
  };

  const handleAboutClose = () => {
    closeWindow('about');
    router.push('/');
  };

  const handleProjectsClose = () => {
    closeWindow('projects');
    router.push('/');
  };

  const handleContactClose = () => {
    closeWindow('contact');
    router.push('/');
  };

  const getFileSystemItem = (id: string) => {
    return FILE_SYSTEM.find(item => item.id === id);
  };

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
      <AnimatePresence mode="sync">
        {state.windows.about.isOpen && (
          <Window key="about" id="about" title="about.mdx" onClose={handleAboutClose}>
            <MDXContent fileId="about" />
          </Window>
        )}
        {state.windows.projects.isOpen && (() => {
          const item = getFileSystemItem('projects');
          const path = pathname;

          // Show project file if route matches
          if (path.startsWith('/projects/')) {
            const fileName = path.split('/').pop();
            const fullPath = `/files${path}`;
            return (
              <Window key={`project-${fileName}`} id={`project-${fileName}` as any} title={fileName || ''} onClose={handleProjectsClose}>
                <DynamicMDXContent filePath={fullPath} />
              </Window>
            );
          }

          // Otherwise show folder view
          if (item?.type === 'folder') {
            return (
              <Window key="projects" id="projects" title={item.name} onClose={handleProjectsClose}>
                <FolderContent folderId="projects" onFileOpen={handleFileOpen} />
              </Window>
            );
          }
          return null;
        })()}
        {state.windows.contact.isOpen && (
          <Window key="contact" id="contact" title="contact.mdx" onClose={handleContactClose}>
            <MDXContent fileId="contact" />
          </Window>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      {!isMobile && <ContextMenu />}
    </div>
  );
}
