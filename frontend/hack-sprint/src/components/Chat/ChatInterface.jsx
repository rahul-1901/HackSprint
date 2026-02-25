import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
let socket = null;

// ✅ Helper function to get date separator text
const getDateSeparatorText = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDateOnly = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const yesterdayDateOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

  if (messageDateOnly.getTime() === todayDateOnly.getTime()) {
    return "Today";
  } else if (messageDateOnly.getTime() === yesterdayDateOnly.getTime()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString([], {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
};

// ✅ Helper function to check if date changed
const shouldShowDateSeparator = (currentMsg, prevMsg) => {
  if (!prevMsg) return true;
  const currentDate = new Date(currentMsg.createdAt);
  const prevDate = new Date(prevMsg.createdAt);

  return (
    currentDate.getFullYear() !== prevDate.getFullYear() ||
    currentDate.getMonth() !== prevDate.getMonth() ||
    currentDate.getDate() !== prevDate.getDate()
  );
};

// ✅ Date separator component
const DateSeparator = ({ date }) => (
  <div className="flex items-center justify-center my-4 px-4">
    <div className="bg-gray-800/50 border border-green-500/10 rounded-full px-3 py-1 text-xs text-gray-400 whitespace-nowrap">
      {getDateSeparatorText(date)}
    </div>
  </div>
);

const ChatInterface = ({ hackathonId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState(hackathonId);
  const [activeTab, setActiveTab] = useState("group");
  const [currentUser, setCurrentUser] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });
      

      socket.on("connect", () => {
        // console.log("Socket connected:", socket.id);
        setSocketConnected(true);
      });

      socket.on("disconnect", () => {
        // console.log("Socket disconnected");
        setSocketConnected(false);
      });

      socket.on("connect_error", (error) => {
        // console.error("Socket connection error:", error);
        setSocketConnected(false);
      });
    }

    return () => {
      // Don't disconnect socket on unmount, just clean up listeners
      // socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("adminToken");
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
    if (!currentChatId || !socket || !socketConnected) return;

    // Join room
    socket.emit("join_room", currentChatId);

    // Fetch initial history
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/${currentChatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    const handleReceiveMessage = (message) => {
      // Only append if it belongs to current chat
      if (message.chatId === currentChatId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.emit("leave_room", currentChatId);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [currentChatId, socketConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // Scroll only within the messages container, not the entire page
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }, 0);
    }
  };

  // const sendMessage = async (e) => {
  //   e.preventDefault();
  //   if (!newMessage.trim() || !currentUser) return;

  //   const messageData = {
  //     chatId: currentChatId,
  //     content: newMessage,
  //     senderId: currentUser._id,
  //     type: activeTab === "group" ? "group" : "direct",
  //     participants: activeTab === "group" ? [] : [currentUser._id], // simplistic
  //   };

  //   try {
  //     await socket.emit("send_message", messageData);
  //     setNewMessage("");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to send message");
  //   }
  // };

  const sendMessage = async (e) => {
    e.preventDefault();

    // ❌ Not logged in
    if (!currentUser) {
      toast.error("Please login to join the discussion");
      return;
    }

    // ❌ Empty message
    if (!newMessage.trim()) {
      return;
    }

    const messageData = {
      chatId: currentChatId,
      content: newMessage,
      senderId: currentUser._id,
      type: activeTab === "group" ? "group" : "direct",
      participants: activeTab === "group" ? [] : [currentUser._id],
    };

    try {
      socket.emit("send_message", messageData);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  const customScrollbarStyles = `
        .discussions-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .discussions-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .discussions-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(34, 197, 94, 0.3);
            border-radius: 3px;
        }
        .discussions-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(34, 197, 94, 0.5);
        }
    `;

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[600px] bg-gray-900/50 rounded-xl border border-green-500/20 overflow-hidden backdrop-blur-sm flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-green-500/20 flex justify-between items-center bg-gray-900/40">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-white">Discussions</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-400">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </div>
              <div
                className={`flex items-center gap-1.5 text-xs ${
                  socketConnected ? "text-green-400" : "text-red-400"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    socketConnected
                      ? "bg-green-400 animate-pulse"
                      : "bg-red-400"
                  }`}
                ></span>
                {socketConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 discussions-scrollbar"
          >
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
                <React.Fragment key={msg._id || idx}>
                  {/* Show date separator if date changed */}
                  {shouldShowDateSeparator(msg, messages[idx - 1]) && (
                    <DateSeparator date={msg.createdAt} />
                  )}
                  {/* Message bubble */}
                  <MessageBubble
                    message={msg}
                    isMe={
                      currentUser &&
                      msg.sender &&
                      (msg.sender._id === currentUser._id ||
                        msg.sender === currentUser._id)
                    }
                  />
                </React.Fragment>
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
                placeholder="Share your thoughts..."
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
    </>
  );
};

export default ChatInterface;
