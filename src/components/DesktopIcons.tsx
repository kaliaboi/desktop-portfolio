import { useDesktop } from '../context/DesktopContext';
import { useIsMobile } from '../hooks';
import { DesktopIcon, ICON_DATA } from './DesktopIcon';

export function DesktopIcons() {
  const { deselectIcon, showContextMenu, hideContextMenu } = useDesktop();
  const isMobile = useIsMobile();

  const handleDesktopClick = () => {
    if (!isMobile) {
      deselectIcon();
      hideContextMenu();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      e.stopPropagation();
      showContextMenu(e.clientX, e.clientY);
    }
  };

  if (isMobile) {
    // iPhone home screen grid layout
    return (
      <div className="fixed inset-0 pt-24 pb-8 px-6">
        <div className="grid grid-cols-4 gap-4 content-start">
          {ICON_DATA.map((icon) => (
            <DesktopIcon key={icon.id} {...icon} />
          ))}
        </div>
      </div>
    );
  }

  // Desktop: absolutely positioned draggable icons
  return (
    <div
      className="fixed inset-0"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {ICON_DATA.map((icon) => (
        <DesktopIcon key={icon.id} {...icon} />
      ))}
    </div>
  );
}
