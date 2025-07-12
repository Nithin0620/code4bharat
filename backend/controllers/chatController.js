const ChatSession = require('../models/ChatSessions');
const Message = require('../models/Message');
const axios = require('axios');



exports.chatWithAI = async (req, res) => {
   try {
      const { user_input, sessionId } = req.body;
      const userId = req.user._id;

      if (!user_input) {
         return res.status(400).json({ success: false, message: "user_input is required" });
      }

      let session;
      let messages = [];

      if (sessionId) {
         // 🔁 Existing session
         session = await ChatSession.findOne({ _id: sessionId, user: userId });
         if (!session) {
         return res.status(404).json({ success: false, message: "Session not found" });
         }

         const previousMessages = await ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });
         previousMessages.forEach((doc) => {
         messages = [...messages, ...doc.messages];
         });

      } else {
         // 🆕 New session
         session = await ChatSession.create({
         user: userId,
         title: user_input.substring(0, 30), // Optional title
         });
      }

      // ➕ Append user message
      messages.push({ role: "user", content: user_input });

      // 📡 Send to AI API
      const payload = {
         messages,
         user_input,
      };

      const aiResponse = await axios.post("https://your-ai-api.com/chat", payload);
      const assistantReply = aiResponse.data?.reply || "AI response failed";

      // ➕ Append assistant message
      messages.push({ role: "assistant", content: assistantReply });

      // 💾 Save in DB
      await ChatMessage.create({
         session: session._id,
         messages,
      });

      return res.status(200).json({
         success: true,
         reply: assistantReply,
         messages,
         sessionId: session._id,
      });

   } catch (err) {
      console.error("Chat error:", err.message);
      return res.status(500).json({ success: false, message: "Chat failed" });
   }
};



exports.getUserSessions = async (req, res) => {
  const { userId } = req.user;

  try {
      const sessions = await ChatSession.find({ user: userId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: sessions });
   } 
   catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch sessions' });
   }
};

exports.getMessagesBySession = async (req, res) => {
  const { sessionId } = req.params;

  try {
      const messages = await Message.find({ session: sessionId }).sort({ timestamp: 1 });
      return res.status(200).json({ success: true, data: messages });
   } 
   catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch messages' });
   }   
};
