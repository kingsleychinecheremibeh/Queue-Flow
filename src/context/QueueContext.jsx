'use client';

import { createContext, useContext, useState, useEffect } from "react";

const QueueContext = createContext(undefined);

export function QueueProvider({ children }) {
  const [queues, setQueues] = useState(() => {
    // Try to load from localStorage first
    if (typeof window !== "undefined") {
      const savedQueues = localStorage.getItem("app_queues");
      if (savedQueues) {
        try {
          return JSON.parse(savedQueues);
        } catch (e) {
          console.error("Failed to load queues from localStorage:", e);
        }
      }
    }

    // Default initial queues if nothing in localStorage
    const now = Date.now();
    return [
      {
        id: "q1",
        businessId: "b1",
        businessName: "City Hospital",
        category: "Healthcare",
        currentQueueLength: 8,
        averageServiceTime: 15,
        isOpen: true,
        items: [
          {
            id: "qi1",
            userId: "u1",
            userName: "Kingsley Ibeh",
            joinedAt: now - 20 * 60000,
            estimatedWaitTime: 10,
            status: "waiting",
            position: 1,
          },
          {
            id: "qi2",
            userId: "u2",
            userName: "Micheal Olawoye",
            joinedAt: now - 15 * 60000,
            estimatedWaitTime: 25,
            status: "waiting",
            position: 2,
          },
          {
            id: "qi3",
            userId: "u3",
            userName: "Mike Johnson",
            joinedAt: now - 10 * 60000,
            estimatedWaitTime: 40,
            status: "waiting",
            position: 3,
          },
        ],
      },
      {
        id: "q2",
        businessId: "b2",
        businessName: "DMV Center",
        category: "Government",
        currentQueueLength: 12,
        averageServiceTime: 20,
        isOpen: true,
        items: [],
      },
      {
        id: "q3",
        businessId: "b3",
        businessName: "Popular Restaurant",
        category: "Restaurant",
        currentQueueLength: 5,
        averageServiceTime: 30,
        isOpen: true,
        items: [],
      },
    ];
  });

  // Persist queues to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app_queues", JSON.stringify(queues));
    }
  }, [queues]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueues((prevQueues) =>
        prevQueues.map((queue) => ({
          ...queue,
          items: queue.items.map((item, index) => ({
            ...item,
            position: index + 1,
            estimatedWaitTime: (index + 1) * queue.averageServiceTime,
          })),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addQueue = (queueData) => {
    const newQueue = {
      ...queueData,
      id: Math.random().toString(36).substr(2, 9),
      items: [],
      currentQueueLength: 0,
    };
    setQueues((prev) => [...prev, newQueue]);
  };

  const joinQueue = (queueId, userName, userId) => {
    setQueues((prevQueues) =>
      prevQueues.map((queue) => {
        if (queue.id === queueId) {
          // Prevent duplicate join
          if (queue.items.some((i) => i.userId === userId)) return queue;

          const newItem = {
            id: crypto.randomUUID().slice(0, 8),
            userId,
            userName,
            joinedAt: Date.now(), // Use timestamp instead of Date object
            estimatedWaitTime: (queue.items.length + 1) * queue.averageServiceTime,
            status: "waiting",
            position: queue.items.length + 1,
          };
          return {
            ...queue,
            items: [...queue.items, newItem],
            currentQueueLength: queue.items.length + 1,
          };
        }
        return queue;
      })
    );
  };

  const leaveQueue = (queueId, userId) => {
    setQueues((prevQueues) =>
      prevQueues.map((queue) => {
        if (queue.id === queueId) {
          // Remove the user from the queue
          const updatedItems = queue.items.filter((item) => item.userId !== userId);
          // Recalculate positions and estimated wait times
          const recalculatedItems = updatedItems.map((item, index) => ({
            ...item,
            position: index + 1,
            estimatedWaitTime: (index + 1) * queue.averageServiceTime,
          }));
          return {
            ...queue,
            items: recalculatedItems,
            currentQueueLength: recalculatedItems.length,
          };
        }
        return queue;
      })
    );
  };

  const callNext = (queueId) => {
    setQueues((prevQueues) =>
      prevQueues.map((queue) => {
        if (queue.id === queueId && queue.items.length > 0) {
          const updatedItems = [...queue.items];
          if (updatedItems[0]) {
            updatedItems[0] = { ...updatedItems[0], status: "called" };
          }
          return { ...queue, items: updatedItems };
        }
        return queue;
      })
    );
  };

  const completeService = (queueId, itemId) => {
    setQueues((prevQueues) =>
      prevQueues.map((queue) => {
        if (queue.id === queueId) {
          const updatedItems = queue.items.filter((item) => item.id !== itemId);
          return {
            ...queue,
            items: updatedItems,
            currentQueueLength: updatedItems.length,
          };
        }
        return queue;
      })
    );
  };

  const getQueueById = (queueId) => queues.find((q) => q.id === queueId);

  const getBusinessQueues = (businessId) => {
    return queues.filter((q) => q.businessId === businessId);
  };

  const createQueue = (businessId, businessName, queueName, category, averageServiceTime) => {
    const newQueue = {
      id: `q_${Math.random().toString(36).substr(2, 9)}`,
      businessId,
      businessName,
      queueName,
      category,
      currentQueueLength: 0,
      averageServiceTime,
      isOpen: true,
      items: [],
    };
    setQueues((prev) => [...prev, newQueue]);
    return newQueue;
  };

  const toggleQueueStatus = (queueId) => {
    setQueues((prevQueues) =>
      prevQueues.map((queue) =>
        queue.id === queueId ? { ...queue, isOpen: !queue.isOpen } : queue
      )
    );
  };

  const getUserPosition = (queueId, userId) => {
    const queue = queues.find((q) => q.id === queueId);
    if (!queue) return null;
    const item = queue.items.find((i) => i.userId === userId);
    return item ? item.position : null;
  };

  return (
    <QueueContext.Provider
      value={{
        queues,
        addQueue,
        joinQueue,
        leaveQueue,
        callNext,
        completeService,
        getQueueById,
        getBusinessQueues,
        createQueue,
        toggleQueueStatus,
        getUserPosition,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
}
