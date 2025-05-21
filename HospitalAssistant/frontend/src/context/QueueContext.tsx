import React, { createContext, useContext, ReactNode } from 'react';
import { NotificationQueue } from '../queues/NotificationQueue';
import { ChatQueue } from '../queues/ChatQueue';

/**
 * Provides global queues for notifications and chat.
 */
interface QueueContextProps {
  notificationQueue: NotificationQueue;
  chatQueue: ChatQueue;
}

const notificationQueue = new NotificationQueue();
const chatQueue = new ChatQueue();

const QueueContext = createContext<QueueContextProps>({
  notificationQueue,
  chatQueue
});

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <QueueContext.Provider value={{ notificationQueue, chatQueue }}>
    {children}
  </QueueContext.Provider>
);

export const useNotificationQueue = (): NotificationQueue =>
  useContext(QueueContext).notificationQueue;

export const useChatQueue = (): ChatQueue =>
  useContext(QueueContext).chatQueue;
