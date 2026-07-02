import { useEffect, useCallback } from 'react';

export interface RealtimeConfig {
  interval: number;
  onUpdate: () => void;
}

export function useRealtimeUpdates(config: RealtimeConfig) {
  useEffect(() => {
    const timer = setInterval(config.onUpdate, config.interval);
    return () => clearInterval(timer);
  }, [config]);
}

export function useEventListener(eventType: string, handler: (e: any) => void) {
  useEffect(() => {
    window.addEventListener(eventType, handler);
    return () => window.removeEventListener(eventType, handler);
  }, [eventType, handler]);
}
