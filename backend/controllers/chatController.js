const ChatSession = require('../models/ChatSessions');
const ChatMessage = require('../models/Message');
const axios = require('axios');


exports.chatWithAI = async (req, res) => {
   try {
      const { user_input, sessionId, class_num, subject, chapter } = req.body;
      const userId = req.user.userId;

      if (!user_input || !class_num || !subject || !chapter) {
         return res.status(400).json({
         success: false,
         message: "Required fields: user_input, class_num, subject, chapter",
         });
      }

      let session;
      let messages = [];

      if (sessionId) {
         // 🔁 Existing session
         session = await ChatSession.findOne({ _id: sessionId, user: userId });
         if (!session) {
         return res.status(404).json({ success: false, message: "Session not found" });
         }

         // 🗃️ Get previous messages from DB
         const previousMessages = await ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });

         previousMessages.forEach((doc) => {
         messages.push(...doc.messages); // flatten all previous messages
         });

      } else {
         // 🆕 New session
         session = await ChatSession.create({
         user: userId,
         title: user_input.substring(0, 30),
         class_num,
         subject,
         chapter,
         });
      }

      // ➕ Add user's current message
      messages.push({ role: "user", content: user_input });

      // 📡 Call Code4Bharat AI API
      const payload = {
         messages,
         user_input,
         class_num,
         subject,
         chapter,
      };

      const response = await axios.post(
         "https://InsaneJSK-Code4Bharat-API.hf.space/chat-ncert",
         payload
      );

      const assistantReply = response.data?.response || "Sorry, no response from AI.";

      // ➕ Add assistant response
      messages.push({ role: "assistant", content: assistantReply });

      // 💾 Save message pair to DB
      await ChatMessage.create({
         session: session._id,
         messages: [
         { role: "user", content: user_input },
         { role: "assistant", content: assistantReply },
         ],
      });

      return res.status(200).json({
         success: true,
         reply: assistantReply,
         messages,
         sessionId: session._id,
      });

   } catch (err) {
      console.error("Chat error:", err);
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
      const chatDocs = await ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });

      const allMessages = chatDocs.reduce((acc, doc) => {
         return acc.concat(doc.messages);
      }, []);

      return res.status(200).json({ success: true, messages: allMessages });
   } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
   }
};
