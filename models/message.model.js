import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  sentAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});
const Message = mongoose.model("Message", messageSchema);
export default Message;