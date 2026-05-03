import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { LanguageContext } from "../context/LanguageContext";
import Navbar from "../components/Navbar";

// Demo contacts for seeding initial conversations
const DEMO_CONTACTS = [
  { email: "ramesh@farmer.com", name: "Ramesh Patil", role: "farmer", icon: "🌾" },
  { email: "suresh@tractor.com", name: "Suresh Jadhav", role: "tractor", icon: "🚜" },
  { email: "mohan@labour.com", name: "Mohan Shinde", role: "labour", icon: "👷" },
  { email: "admin@gov.com", name: "Govt Officer", role: "government", icon: "🏛️" },
];

const ROLE_COLORS = {
  farmer: { bg: "#dcfce7", text: "#15803d" },
  tractor: { bg: "#fef9c3", text: "#92400e" },
  labour: { bg: "#ffedd5", text: "#9a3412" },
  government: { bg: "#dbeafe", text: "#1d4ed8" },
};

export default function Messages() {
  const { user } = useAuth();
  const { getConversations, getMessages, sendMessage, markRead, getUnreadCount } = useChat();
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const mr = lang === "mr";

  const getRoleLabel = (role) => {
    if (role === "tractor") return mr ? "ट्रॅक्टर मालक" : "Tractor Owner";
    if (role === "labour") return mr ? "मजूर पुरवठादार" : "Labour Provider";
    if (role === "government") return mr ? "शासकीय अधिकारी" : "Government Officer";
    return mr ? "शेतकरी" : "Farmer";
  };

  const [selectedContact, setSelectedContact] = useState(null);
  const [text, setText] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const messagesEndRef = useRef(null);

  const conversations = getConversations(user?.email || "");
  const messages = selectedContact
    ? getMessages(user?.email, selectedContact.email)
    : [];

  useEffect(() => {
    if (selectedContact) {
      markRead(user?.email, selectedContact.email);
    }
  }, [selectedContact, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedContact) return;
    sendMessage(
      user?.email,
      user?.name,
      selectedContact.email,
      selectedContact.name,
      text.trim()
    );
    setText("");
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    markRead(user?.email, contact.email);
  };

  // Build contact list from conversations + demo contacts (filtered by search)
  const allContacts = [
    ...DEMO_CONTACTS.filter((c) => c.email !== user?.email),
    ...conversations
      .map((c) => ({
        email: c.other,
        name: c.lastMsg?.fromName || c.lastMsg?.toName || c.other,
        role: "farmer",
        icon: "👤",
      }))
      .filter(
        (c) =>
          !DEMO_CONTACTS.find((d) => d.email === c.email) &&
          c.email !== user?.email
      ),
  ].filter(
    (c) =>
      !searchQ ||
      c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQ.toLowerCase())
  );

  const getContactConv = (email) =>
    conversations.find((c) => c.other === email);

  const totalUnread = getUnreadCount(user?.email || "");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>
              💬 {mr ? "संदेश" : "Messages"}
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
              {mr ? "इतर वापरकर्त्यांशी संवाद साधा" : "Connect and chat with other users"}
            </p>
          </div>
          {totalUnread > 0 && (
            <div style={{
              background: "#ef4444", color: "#fff", borderRadius: 20, padding: "4px 16px",
              fontSize: 13, fontWeight: 700,
            }}>
              {totalUnread} {mr ? "न वाचलेले" : "Unread"}
            </div>
          )}
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "300px 1fr", gap: 16,
          height: "calc(100vh - 200px)", minHeight: 500,
        }}>
          {/* Contacts list */}
          <div style={{
            background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* Search */}
            <div style={{ padding: "14px 14px 0" }}>
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder={mr ? "संपर्क शोधा..." : "Search contacts..."}
                style={{
                  width: "100%", border: "1px solid #e5e7eb", borderRadius: 10,
                  padding: "9px 12px", fontSize: 13, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
              {allContacts.map((c, i) => {
                const conv = getContactConv(c.email);
                const unread = conv
                  ? conv.messages.filter((m) => m.to === user?.email && !m.read).length
                  : 0;
                const roleCol = ROLE_COLORS[c.role] || { bg: "#f3f4f6", text: "#374151" };
                const isSelected = selectedContact?.email === c.email;

                return (
                  <button
                    key={i}
                    onClick={() => selectContact(c)}
                    style={{
                      width: "100%", textAlign: "left", display: "flex", alignItems: "center",
                      gap: 10, padding: "11px 10px", borderRadius: 10, marginBottom: 2,
                      background: isSelected ? "#f0fdf4" : "transparent",
                      border: isSelected ? "1px solid #bbf7d0" : "1px solid transparent",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "linear-gradient(135deg,#14532d,#16a34a)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0,
                    }}>
                      {c.icon || c.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 700, fontSize: 13, color: "#111827",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {c.name}
                        </span>
                        {unread > 0 && (
                          <span style={{
                            background: "#ef4444", color: "#fff", borderRadius: "50%",
                            width: 18, height: 18, display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0,
                          }}>{unread}</span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20,
                          background: roleCol.bg, color: roleCol.text,
                        }}>{getRoleLabel(c.role)}</span>
                        {conv?.lastMsg && (
                          <span style={{
                            fontSize: 11, color: "#9ca3af",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {conv.lastMsg.text?.slice(0, 20)}{conv.lastMsg.text?.length > 20 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {allContacts.length === 0 && (
                <div style={{ textAlign: "center", padding: 32, color: "#9ca3af", fontSize: 13 }}>
                  {mr ? "कोणताही संपर्क सापडला नाही" : "No contacts found"}
                </div>
              )}
            </div>
          </div>

          {/* Chat window */}
          <div style={{
            background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {selectedContact ? (
              <>
                {/* Chat header */}
                <div style={{
                  padding: "14px 20px", borderBottom: "1px solid #f3f4f6",
                  display: "flex", alignItems: "center", gap: 12,
                  background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg,#14532d,#16a34a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: 18,
                  }}>
                    {selectedContact.icon || selectedContact.name?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>
                      {selectedContact.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {selectedContact.email} · {getRoleLabel(selectedContact.role)}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: "center", color: "#9ca3af", padding: 48 }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                      <p style={{ fontSize: 14 }}>
                        {mr ? "संभाषण सुरू करा!" : "Start the conversation!"}
                      </p>
                    </div>
                  )}
                  {messages.map((m, i) => {
                    const isMine = m.from === user?.email;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                        }}
                      >
                        <div style={{
                          maxWidth: "70%",
                          background: isMine ? "linear-gradient(135deg,#16a34a,#15803d)" : "#f3f4f6",
                          color: isMine ? "#fff" : "#111827",
                          padding: "10px 14px", borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          fontSize: 13, lineHeight: 1.5,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}>
                          <div>{m.text}</div>
                          <div style={{
                            fontSize: 10, marginTop: 4, opacity: 0.7, textAlign: "right",
                          }}>
                            {new Date(m.time).toLocaleTimeString("en-IN", {
                              hour: "2-digit", minute: "2-digit",
                            })}
                            {isMine && <span style={{ marginLeft: 4 }}>{m.read ? "✓✓" : "✓"}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSend}
                  style={{
                    padding: "12px 16px", borderTop: "1px solid #f3f4f6",
                    display: "flex", gap: 10, alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={mr ? "संदेश टाइप करा..." : "Type a message..."}
                    style={{
                      flex: 1, border: "1px solid #e5e7eb", borderRadius: 24,
                      padding: "10px 16px", fontSize: 14, outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    style={{
                      background: text.trim() ? "linear-gradient(135deg,#16a34a,#15803d)" : "#e5e7eb",
                      color: text.trim() ? "#fff" : "#9ca3af",
                      border: "none", borderRadius: "50%", width: 44, height: 44,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: text.trim() ? "pointer" : "not-allowed", fontSize: 20,
                      transition: "all 0.2s",
                    }}
                  >
                    ➤
                  </button>
                </form>
              </>
            ) : (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", color: "#9ca3af",
              }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>💬</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                  {mr ? "संदेश सुरू करा" : "Select a conversation"}
                </h3>
                <p style={{ fontSize: 14, textAlign: "center", maxWidth: 300 }}>
                  {mr
                    ? "डावीकडून संपर्क निवडा आणि संभाषण सुरू करा"
                    : "Select a contact from the left to start chatting"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
