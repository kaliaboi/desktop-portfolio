import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ThemeToggle";

export function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county;
          const country = data.address?.country_code?.toUpperCase();
          setLocation(
            city && country ? `${city}, ${country}` : city || "Unknown"
          );
        } catch {
          setLocation(null);
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (isMobile) {
    // Mobile: minimal status bar
    return (
      <div className="fixed top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent backdrop-blur-sm z-[9998] flex items-center justify-between px-4">
        <span className="text-xs text-white font-medium drop-shadow">
          {formatTime(currentTime)}
        </span>
        <div className="flex items-center gap-2">
          {!locationLoading && location && (
            <span className="text-xs text-white drop-shadow">
              📍 {location}
            </span>
          )}
          <span className="text-xs text-white drop-shadow">📶</span>
          <span className="text-xs text-white drop-shadow">🔋</span>
        </div>
      </div>
    );
  }

  // Desktop: full status bar
  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-muted/50 border-b border-b-foreground/30 z-[9998] flex items-center justify-between px-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-xs font-semibold">
          Portfolio OS
        </Badge>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs">
            File
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs">
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs">
            View
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {!locationLoading && location && (
          <span className="flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </span>
        )}
        <ThemeToggle />
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle
              cx="6"
              cy="6"
              r="5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M6 3v3l2 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {formatTime(currentTime)}
        </span>
        <span>{formatDate(currentTime)}</span>
      </div>
    </div>
  );
}
