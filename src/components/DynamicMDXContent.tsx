'use client'

import { lazy, Suspense, ComponentType } from 'react';

// Map file paths to their imports
const fileImports: Record<string, () => Promise<{ default: ComponentType }>> = {
  '/files/projects/overview.mdx': () => import('../../public/files/projects/overview.mdx'),
  '/files/projects/project-1.mdx': () => import('../../public/files/projects/project-1.mdx'),
  '/files/projects/project-2.mdx': () => import('../../public/files/projects/project-2.mdx'),
};

interface DynamicMDXContentProps {
  filePath: string;
}

export function DynamicMDXContent({ filePath }: DynamicMDXContentProps) {
  const importFn = fileImports[filePath];

  if (!importFn) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-destructive">
          <div>File not found: {filePath}</div>
          <div className="mt-2 text-xs">Available files:</div>
          <ul className="text-xs mt-1">
            {Object.keys(fileImports).map(key => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const MDXComponent = lazy(importFn);

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
