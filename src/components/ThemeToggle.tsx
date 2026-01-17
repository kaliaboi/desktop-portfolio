import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { playTapSound } from "../lib/sounds";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 border border-foreground/30 rounded-md p-0.5 bg-background">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        className="h-6 w-6"
        onClick={() => {
          playTapSound();
          setTheme("light");
        }}
        aria-label="Light theme"
      >
        <Sun className="h-3 w-3" />
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        className="h-6 w-6"
        onClick={() => {
          playTapSound();
          setTheme("dark");
        }}
        aria-label="Dark theme"
      >
        <Moon className="h-3 w-3" />
      </Button>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        className="h-6 w-6"
        onClick={() => {
          playTapSound();
          setTheme("system");
        }}
        aria-label="System theme"
      >
        <Monitor className="h-3 w-3" />
      </Button>
    </div>
  );
}
