import Message from "../models/Message.js";

// GET /api/v1/messages/conversations — list all conversations for current user
export const getConversations = async (req, res) => {
  try {
    const userEmail = req.user.email;
    // Get latest message from each conversation involving this user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ fromEmail: userEmail }, { toEmail: userEmail }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationKey",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$toEmail", userEmail] }, { $eq: ["$read", false] }] }, 1, 0],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch conversations", error: err.message });
  }
};

// GET /api/v1/messages/:otherEmail — get messages with a specific user
export const getMessages = async (req, res) => {
  try {
    const { otherEmail } = req.params;
    const userEmail = req.user.email;
    const convKey = [userEmail, otherEmail].sort().join("|||");

    const messages = await Message.find({ conversationKey: convKey })
      .sort({ createdAt: 1 })
      .limit(100);

    // Mark as read
    await Message.updateMany(
      { conversationKey: convKey, toEmail: userEmail, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch messages", error: err.message });
  }
};

// POST /api/v1/messages — send a message
export const sendMessage = async (req, res) => {
  try {
    const { toEmail, toName, text } = req.body;
    if (!toEmail || !text) return res.status(400).json({ msg: "toEmail and text are required" });

    const convKey = [req.user.email, toEmail].sort().join("|||");
    const msg = await Message.create({
      fromEmail: req.user.email,
      fromName: req.user.name,
      toEmail,
      toName,
      text,
      conversationKey: convKey,
    });

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ msg: "Failed to send message", error: err.message });
  }
};

// GET /api/v1/messages/unread-count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      toEmail: req.user.email,
      read: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch unread count", error: err.message });
  }
};
