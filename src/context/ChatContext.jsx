import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

function loadChats() {
  try {
    return JSON.parse(localStorage.getItem("shetkari_chats") || "{}");
  } catch {
    return {};
  }
}

function saveChats(chats) {
  localStorage.setItem("shetkari_chats", JSON.stringify(chats));
}

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(loadChats);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  // Get all conversations for a user (by email)
  const getConversations = (userEmail) => {
    const convs = [];
    Object.entries(chats).forEach(([key, msgs]) => {
      const [a, b] = key.split("|||");
      if (a === userEmail || b === userEmail) {
        const other = a === userEmail ? b : a;
        const lastMsg = msgs[msgs.length - 1];
        const unread = msgs.filter(
          (m) => m.to === userEmail && !m.read
        ).length;
        convs.push({ key, other, lastMsg, unread, messages: msgs });
      }
    });
    return convs.sort(
      (a, b) =>
        new Date(b.lastMsg?.time || 0) - new Date(a.lastMsg?.time || 0)
    );
  };

  // Get messages between two users
  const getMessages = (emailA, emailB) => {
    const key =
      [emailA, emailB].sort().join("|||");
    return chats[key] || [];
  };

  // Send a message
  const sendMessage = (fromEmail, fromName, toEmail, toName, text) => {
    const key = [fromEmail, toEmail].sort().join("|||");
    const msg = {
      id: Date.now(),
      from: fromEmail,
      fromName,
      to: toEmail,
      toName,
      text,
      time: new Date().toISOString(),
      read: false,
    };
    setChats((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), msg],
    }));
  };

  // Mark all messages as read for a conversation
  const markRead = (userEmail, otherEmail) => {
    const key = [userEmail, otherEmail].sort().join("|||");
    setChats((prev) => ({
      ...prev,
      [key]: (prev[key] || []).map((m) =>
        m.to === userEmail ? { ...m, read: true } : m
      ),
    }));
  };

  // Total unread count
  const getUnreadCount = (userEmail) => {
    let count = 0;
    Object.values(chats).forEach((msgs) => {
      count += msgs.filter((m) => m.to === userEmail && !m.read).length;
    });
    return count;
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        getConversations,
        getMessages,
        sendMessage,
        markRead,
        getUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
