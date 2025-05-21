import React from 'react';
import { motion } from 'framer-motion';
import { useChatQueue } from '../context/QueueContext';

/**
 * ChatInterface provides a tablet-friendly messaging UI with queue management.
 */
export class ChatInterface extends React.Component<{ threadId: string }> {
  static contextType = React.createContext(useChatQueue());
  render() {
    const chatQueue = this.context as ReturnType<typeof useChatQueue>;
    const messages = chatQueue.peek() ? [chatQueue.peek()!] : []; // demo usage

    return (
      <div className="flex h-full">
        <div className="w-1/3 border-r p-2 overflow-y-auto">{/* Thread list stub */}</div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.from === 'ai' ? 'text-right mb-2' : 'text-left mb-2'}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`inline-block p-3 rounded-2xl ${
                    msg.from === 'ai' ? 'bg-blue-100' : 'bg-gray-200'
                  }`}
                >
                  {msg.text}
                </motion.div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex items-center">
            {/* Input & send button stub */}
          </div>
        </div>
      </div>
    );
  }
}
