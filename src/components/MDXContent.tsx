'use client'

import { lazy, Suspense, ComponentType } from 'react';
import { WindowId } from '../context/DesktopContext';

// Dynamically import MDX files
const mdxFiles: Record<WindowId, () => Promise<{ default: ComponentType }>> = {
  about: () => import('../../public/files/about.mdx'),
  projects: () => import('../../public/files/projects/overview.mdx'),
  contact: () => import('../../public/files/contact.mdx'),
};

interface MDXContentProps {
  fileId: WindowId;
}

export function MDXContent({ fileId }: MDXContentProps) {
  const MDXComponent = lazy(mdxFiles[fileId]);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    }>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <MDXComponent />
      </div>
    </Suspense>
  );
}
