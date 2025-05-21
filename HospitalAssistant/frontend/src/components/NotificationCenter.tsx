import React from 'react';
import { motion } from 'framer-motion';
import { useNotificationQueue } from '../context/QueueContext';

/**
 * NotificationCenter displays mobile notifications from the queue.
 */
export class NotificationCenter extends React.Component {
  static contextType = React.createContext(useNotificationQueue());
  render() {
    const notificationQueue = this.context as ReturnType<typeof useNotificationQueue>;
    const notifications = notificationQueue.peek() ? [notificationQueue.peek()!] : []; // demo

    return (
      <div className="p-4 space-y-3">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-3 rounded-2xl shadow ${
              n.severity === 'critical' ? 'border-red-500' : 'border-gray-200'
            } border-l-4`}
          >
            <div className="flex justify-between items-center">
              <p className="font-medium">{n.message}</p>
              <button
                className="text-sm text-blue-600"
                onClick={() => notificationQueue.dequeue()}
              >
                OK
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(n.timestamp).toLocaleTimeString()}
            </p>
          </motion.div>
        ))}
      </div>
    );
  }
}
