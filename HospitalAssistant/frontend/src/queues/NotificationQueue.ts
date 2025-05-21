/**
 * NotificationQueue manages a FIFO queue of notifications for mobile alerts.
 */
export interface Notification {
  id: string;
  message: string;
  severity: 'critical' | 'info';
  timestamp: number;
}

export class NotificationQueue {
  private queue: Notification[] = [];

  enqueue(notification: Notification): void {
    this.queue.push(notification);
  }

  dequeue(): Notification | undefined {
    return this.queue.shift();
  }

  peek(): Notification | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}
