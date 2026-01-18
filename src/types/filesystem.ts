import { LucideIcon, FileText, Folder } from 'lucide-react';

export type FileType = 'mdx' | 'folder';

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  icon: LucideIcon;
  path?: string; // For files
  children?: FileSystemItem[]; // For folders
}

// File system structure
export const FILE_SYSTEM: FileSystemItem[] = [
  {
    id: 'about',
    name: 'about.mdx',
    type: 'mdx',
    icon: FileText,
    path: '/files/about.mdx',
  },
  {
    id: 'projects',
    name: 'projects',
    type: 'folder',
    icon: Folder,
    children: [
      {
        id: 'projects-overview',
        name: 'overview.mdx',
        type: 'mdx',
        icon: FileText,
        path: '/files/projects/overview.mdx',
      },
      {
        id: 'projects-project1',
        name: 'project-1.mdx',
        type: 'mdx',
        icon: FileText,
        path: '/files/projects/project-1.mdx',
      },
      {
        id: 'projects-project2',
        name: 'project-2.mdx',
        type: 'mdx',
        icon: FileText,
        path: '/files/projects/project-2.mdx',
      },
    ],
  },
  {
    id: 'contact',
    name: 'contact.mdx',
    type: 'mdx',
    icon: FileText,
    path: '/files/contact.mdx',
  },
];
