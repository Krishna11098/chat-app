"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { ref, push, onValue, off, query, orderByChild, limitToLast, remove, update } from "firebase/database";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  timestamp: number;
  edited?: boolean;
  editedAt?: number;
}

function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = ref(db, "messages");
    const messagesQuery = query(messagesRef, orderByChild("timestamp"), limitToLast(100));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList: Message[] = Object.entries(data).map(([id, msg]: [string, any]) => ({
          id,
          text: msg.text,
          userId: msg.userId,
          userName: msg.userName,
          userPhoto: msg.userPhoto,
          timestamp: msg.timestamp,
          edited: msg.edited,
          editedAt: msg.editedAt,
        }));
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => off(messagesRef);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const messagesRef = ref(db, "messages");
      await push(messagesRef, {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "Anonymous",
        userPhoto: user.photoURL || "",
        timestamp: Date.now(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const messageRef = ref(db, `messages/${messageId}`);
      await remove(messageRef);
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    }
  };

  const handleStartEdit = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const handleUpdateMessage = async (messageId: string) => {
    if (!editText.trim()) {
      alert("Message cannot be empty");
      return;
    }

    try {
      const messageRef = ref(db, `messages/${messageId}`);
      await update(messageRef, {
        text: editText,
        edited: true,
        editedAt: Date.now(),
      });
      setEditingMessageId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating message:", error);
      alert("Failed to update message");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💬</div>
            <div>
              <h1 className="text-2xl font-bold">Firebase Chat</h1>
              <p className="text-sm text-blue-100">Real-time messaging</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              )}
              <div className="hidden sm:block">
                <p className="font-semibold">{user?.displayName || user?.email}</p>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl">No messages yet</p>
              <p className="text-sm">Be the first to start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.userId === user?.uid;
              const isEditing = editingMessageId === message.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                    {!isCurrentUser && message.userPhoto ? (
                      <img
                        src={message.userPhoto}
                        alt={message.userName}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                    ) : !isCurrentUser ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {message.userName[0].toUpperCase()}
                      </div>
                    ) : null}
                    <div className="w-full">
                      {!isCurrentUser && (
                        <p className="text-xs text-gray-600 mb-1 px-2">{message.userName}</p>
                      )}
                      
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full rounded-lg px-4 py-2 border-2 border-blue-500 focus:outline-none focus:border-purple-500 text-gray-900"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateMessage(message.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-semibold transition"
                            >
                              ✓ Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-lg text-sm font-semibold transition"
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isCurrentUser
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : "bg-white text-gray-800 shadow"
                          }`}
                        >
                          <p className="break-words">{message.text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {message.edited && " (edited)"}
                            </p>
                          </div>
                          
                          {isCurrentUser && (
                            <div className="flex gap-2 mt-2 pt-2 border-t border-white/20">
                              <button
                                onClick={() => handleStartEdit(message.id, message.text)}
                                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
                                title="Edit message"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="text-xs bg-red-500/80 hover:bg-red-600 px-3 py-1 rounded transition"
                                title="Delete message"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChatPageWithAuth() {
  return (
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  );
}
