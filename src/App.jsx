import { DesktopProvider } from './context/DesktopContext';
import { ThemeProvider } from './context/ThemeContext';
import { Desktop } from './components/Desktop';

export default function App() {
  return (
    <ThemeProvider>
      <DesktopProvider>
        <Desktop />
      </DesktopProvider>
    </ThemeProvider>
  );
}
