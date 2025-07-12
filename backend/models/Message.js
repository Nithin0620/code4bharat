const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: "ChatSession" },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"] },
      content: String,
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
