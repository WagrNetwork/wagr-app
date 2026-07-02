export interface AnalyticsEvent {
  name: string;
  timestamp: number;
  data: Record<string, any>;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  track(name: string, data: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      name,
      timestamp: Date.now(),
      data,
    };
    this.events.push(event);

    if (this.events.length > 1000) {
      this.events.shift();
    }
  }

  getStats() {
    return {
      totalEvents: this.events.length,
      avgPerSecond: this.events.length / ((Date.now() - this.events[0]?.timestamp) / 1000),
    };
  }

  export() {
    return this.events;
  }

  clear() {
    this.events = [];
  }
}
