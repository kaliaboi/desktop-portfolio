import { FILE_SYSTEM } from '../types/filesystem';
import { playTapSound } from '../lib/sounds';

interface FolderContentProps {
  folderId: string;
  onFileOpen: (filePath: string) => void;
}

export function FolderContent({ folderId, onFileOpen }: FolderContentProps) {
  const folder = FILE_SYSTEM.find(item => item.id === folderId);

  if (!folder || folder.type !== 'folder' || !folder.children) {
    return <div className="text-sm text-muted-foreground">Folder not found</div>;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground mb-4">
        Contents of {folder.name}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {folder.children.map((file) => {
          const Icon = file.icon;
          return (
            <button
              key={file.id}
              onClick={() => {
                playTapSound();
                if (file.path) {
                  onFileOpen(file.path);
                }
              }}
              className="flex items-center gap-3 p-3 rounded hover:bg-accent transition-colors text-left group"
            >
              <div className="w-8 h-8 bg-card border rounded shadow-sm flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground group-hover:text-accent-foreground truncate">
                  {file.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {file.type === 'mdx' ? 'MDX Document' : 'Folder'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
