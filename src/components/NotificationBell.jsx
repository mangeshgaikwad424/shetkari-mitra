import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const { getForUser, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const notifs = getForUser(user.email);
  const unread = notifs.filter(n => !n.read).length;

  const typeIcon = (type) => {
    if (type === "booking_request") return "🔔";
    if (type === "booking_update") return "📬";
    return "ℹ️";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        title="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unread > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800">Notifications</h3>
              {unread > 0 && (
                <button
                  onClick={() => markAllRead(user.email)}
                  className="text-xs text-green-600 hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {notifs.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  <div className="text-3xl mb-2">🔕</div>
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifs.slice(0, 20).map(n => (
                  <div
                    key={n.id}
                    onClick={() => markRead(user.email, n.id)}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${!n.read ? "bg-green-50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{typeIcon(n.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${!n.read ? "text-green-800" : "text-gray-800"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.time).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                        </p>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
