import { Message } from "../models/message.model.js";

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("sender", "name profilePicture email username");

    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserChats = async (req, res) => {
    try {
        const userId = req.body.userId; 
        const chats = await Message.aggregate([
            {
                $match: {
                    type: 'direct',
                    participants: { $in: [new mongoose.Types.ObjectId(userId)] }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$chatId",
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);
        res.status(200).json(chats);

    } catch (error) {
        console.error("Error fetching user chats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
