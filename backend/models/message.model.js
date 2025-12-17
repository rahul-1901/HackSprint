import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true, 
  },
  type: {
    type: String,
    enum: ['group', 'direct'],
    default: 'group'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],  
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
