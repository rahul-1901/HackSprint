import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Send, Hash, MessageSquare, User, Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // Move import to top

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
const socket = io(SOCKET_URL);

const ChatInterface = ({ hackathonId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentChatId, setCurrentChatId] = useState(hackathonId); // Default to hackathon group
    const [activeTab, setActiveTab] = useState("group"); // 'group' or 'direct'
    const [currentUser, setCurrentUser] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            const userId = decoded._id || decoded.id || decoded.userId;
            setCurrentUser({ ...decoded, _id: userId });
        } catch (e) {
            console.error("Error decoding token", e);
        }

    }, []);

    useEffect(() => {
        if (!currentChatId) return;

        // Join room
        socket.emit("join_room", currentChatId);

        // Fetch initial history
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/${currentChatId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();

        // Listen for incoming messages
        socket.on("receive_message", (message) => {
            // Only append if it belongs to current chat
            if (message.chatId === currentChatId) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.emit("leave_room", currentChatId);
            socket.off("receive_message");
        };
    }, [currentChatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        const messageData = {
            chatId: currentChatId,
            content: newMessage,
            senderId: currentUser._id,
            type: activeTab === 'group' ? 'group' : 'direct',
            participants: activeTab === 'group' ? [] : [currentUser._id] // simplistic
        };

        try {
            await socket.emit("send_message", messageData);
            setNewMessage("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="flex h-[600px] bg-gray-900/50 rounded-xl border border-green-500/20 overflow-hidden backdrop-blur-sm">

            <div className="w-64 border-r border-green-500/20 flex flex-col bg-gray-900/30">
                <div className="p-4 border-b border-green-500/20">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                        Discussions
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    <button
                        onClick={() => { setActiveTab("group"); setCurrentChatId(hackathonId); }}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'group' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        <Hash className="w-4 h-4" />
                        <span className="font-medium">General Channel</span>
                    </button>

                    <div className="pt-4 pb-2 px-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Direct Messages</p>
                        <p className="text-xs text-gray-600 mt-2 italic">Coming soon</p>
                    </div>
                </div>

                <div className="p-4 border-t border-green-500/20 bg-gray-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold border border-green-500/30">
                            {currentUser?.name?.[0] || <User className="w-4 h-4" />}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{currentUser?.name || "Guest"}</p>
                            <p className="text-xs text-green-500/70 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-900/20">
                {/* Header */}
                <div className="p-4 border-b border-green-500/20 flex justify-between items-center bg-gray-900/40">
                    <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-green-400" />
                        <h3 className="font-bold text-white">General Discussion</h3>
                    </div>
                    <div className="text-xs text-gray-400">
                        {messages.length} messages
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
                            <MessageSquare className="w-12 h-12 mb-2" />
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <MessageBubble
                                key={msg._id || idx}
                                message={msg}
                                isMe={currentUser && msg.sender && (msg.sender._id === currentUser._id || msg.sender === currentUser._id)}
                            />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-green-500/20 bg-gray-900/40">
                    <form onSubmit={sendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message #${activeTab === 'group' ? 'General' : 'User'}`}
                            className="flex-1 bg-gray-800/50 border border-green-500/20 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-green-600 hover:bg-green-500 text-white rounded-xl px-5 py-3 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-green-900/20"
                        >
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
