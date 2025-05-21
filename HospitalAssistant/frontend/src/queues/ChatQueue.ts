/**
 * ChatQueue manages a FIFO queue of chat messages for patient conversations.
 */
export interface ChatMessage {
  id: string;
  from: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export class ChatQueue {
  private queue: ChatMessage[] = [];

  enqueue(message: ChatMessage): void {
    this.queue.push(message);
  }

  dequeue(): ChatMessage | undefined {
    return this.queue.shift();
  }

  peek(): ChatMessage | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}
