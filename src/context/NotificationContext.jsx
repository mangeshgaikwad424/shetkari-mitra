import { createContext, useContext, useState, useCallback } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  // notifications stored by userId (email)
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("shetkari_notifications");
    return stored ? JSON.parse(stored) : {};
  });

  const addNotification = useCallback((toUserId, notification) => {
    setNotifications(prev => {
      const updated = {
        ...prev,
        [toUserId]: [
          { ...notification, id: Date.now(), read: false, time: new Date().toISOString() },
          ...(prev[toUserId] || []),
        ],
      };
      localStorage.setItem("shetkari_notifications", JSON.stringify(updated));
      return updated;
    }); 
  }, []);

  const markRead = useCallback((userId, notifId) => {
    setNotifications(prev => {
      const updated = {
        ...prev,
        [userId]: (prev[userId] || []).map(n => n.id === notifId ? { ...n, read: true } : n),
      };
      localStorage.setItem("shetkari_notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllRead = useCallback((userId) => {
    setNotifications(prev => {
      const updated = {
        ...prev,
        [userId]: (prev[userId] || []).map(n => ({ ...n, read: true })),
      };
      localStorage.setItem("shetkari_notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getForUser = useCallback((userId) => {
    return notifications[userId] || [];
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ addNotification, markRead, markAllRead, getForUser, notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
