import Notification from "../models/Notification.js";

// GET /api/v1/notifications — get my notifications
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, total, unread] = await Promise.all([
      Notification.find({ recipientEmail: req.user.email })
        .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments({ recipientEmail: req.user.email }),
      Notification.countDocuments({ recipientEmail: req.user.email, read: false }),
    ]);

    res.json({ notifications, total, unread, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch notifications", error: err.message });
  }
};

// PATCH /api/v1/notifications/read-all — mark all as read
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientEmail: req.user.email, read: false },
      { $set: { read: true } }
    );
    res.json({ msg: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to mark notifications", error: err.message });
  }
};

// PATCH /api/v1/notifications/:id/read — mark one as read
export const markOneRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ msg: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to mark notification", error: err.message });
  }
};

// POST /api/v1/notifications — create notification (internal, called by other controllers)
export const createNotification = async (recipientEmail, type, title, message, metadata = {}, link = "") => {
  try {
    await Notification.create({ recipientEmail, type, title, message, metadata, link });
  } catch (err) {
    console.error("Notification create error:", err.message);
  }
};
