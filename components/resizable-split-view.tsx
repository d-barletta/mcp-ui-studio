'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

// Tailwind lg breakpoint
const LG_BREAKPOINT = 1024;

interface ResizableSplitViewProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftWidth?: number; // percentage (0-100)
  minWidth?: number; // percentage (0-100)
  storageKey?: string; // localStorage key to persist size
  className?: string;
}

export function ResizableSplitView({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minWidth = 20,
  storageKey,
  className = '',
}: ResizableSplitViewProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < LG_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load saved width from localStorage on mount
  useEffect(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed) && parsed >= minWidth && parsed <= 100 - minWidth) {
            setLeftWidth(parsed);
          }
        }
      } catch (error) {
        // localStorage might be disabled or throw errors in private browsing mode
        console.warn('Failed to load saved width from localStorage:', error);
      }
    }
  }, [storageKey, minWidth]);

  // Save width to localStorage when it changes (debounced)
  useEffect(() => {
    if (storageKey) {
      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounce saves to avoid excessive writes during drag
      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, leftWidth.toString());
        } catch (error) {
          console.warn('Failed to save width to localStorage:', error);
        }
      }, 100);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [leftWidth, storageKey]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      let newWidth: number;
      
      if (isMobile) {
        // Vertical layout - use Y position
        const offsetY = e.clientY - rect.top;
        newWidth = (offsetY / rect.height) * 100;
      } else {
        // Horizontal layout - use X position
        const offsetX = e.clientX - rect.left;
        newWidth = (offsetX / rect.width) * 100;
      }

      // Clamp between min and max
      newWidth = Math.max(minWidth, Math.min(100 - minWidth, newWidth));
      setLeftWidth(newWidth);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      
      let newWidth: number;
      
      if (isMobile) {
        const offsetY = touch.clientY - rect.top;
        newWidth = (offsetY / rect.height) * 100;
      } else {
        const offsetX = touch.clientX - rect.left;
        newWidth = (offsetX / rect.width) * 100;
      }

      newWidth = Math.max(minWidth, Math.min(100 - minWidth, newWidth));
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, minWidth, isMobile]);

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full min-h-0 flex-col lg:flex-row ${className}`}
      style={{ cursor: isDragging ? (isMobile ? 'row-resize' : 'col-resize') : 'default' }}
    >
      {/* Left/Top Panel */}
      <div
        className="h-full overflow-hidden"
        style={{
          flexBasis: `${leftWidth}%`,
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        {leftPanel}
      </div>

      {/* Draggable Handle */}
      <div
        className={`group relative z-10 flex-shrink-0 ${
          isDragging ? 'bg-primary' : 'bg-border hover:bg-primary/50'
        } transition-colors ${isMobile ? 'h-1 w-full cursor-row-resize' : 'h-full w-1 cursor-col-resize'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Invisible wider hit area for easier grabbing */}
        <div
          className={`absolute inset-0 ${
            isMobile
              ? '-top-2 h-4 w-full cursor-row-resize'
              : '-left-2 h-full w-4 cursor-col-resize'
          }`}
        />
        
        {/* Visual indicator on hover */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100 ${
            isDragging ? 'opacity-100' : ''
          } ${isMobile ? 'h-1 w-8' : 'h-8 w-1'}`}
          style={{ pointerEvents: 'none' }}
        />
      </div>

      {/* Right/Bottom Panel */}
      <div className="h-full min-h-0 flex-1 overflow-hidden">{rightPanel}</div>
    </div>
  );
}

