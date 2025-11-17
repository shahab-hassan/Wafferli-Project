"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAdDetailsForChat,
  GetUsersForSidebar,
  GetChatRoomMessages,
  MarkAsRead,
  GetOrCreateChatRoom,
} from "@/features/slicer/ChatSlice";
import io from "socket.io-client";
import { cn } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import { ChatHeader } from "@/components/chat/chat-header";
import { ProductSuggestion } from "@/components/chat/product-suggestion";
import { MessageBubble } from "@/components/chat/message-bubble";
import { MessageInput } from "@/components/chat/message-input";
import { Sidebar } from "@/components/chat/sidebar";
export default function EnhancedChatPage() {
  const { id }: any = useParams();
  const adId = id || null;
  const dispatch: any = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { chatUsers } = useSelector((state: any) => state.chat);
  const router = useRouter();

  const [socket, setSocket] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [adDetails, setAdDetails] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showProductSuggestion, setShowProductSuggestion] = useState(true);
  const [highlightedMessage, setHighlightedMessage] = useState<string | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Enhanced scroll to bottom - only scrolls chat container
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Scroll to specific message (for reply feature)
  const scrollToMessage = useCallback((messageId: string) => {
    const messageElement = messageRefs.current.get(messageId);
    if (messageElement && messagesContainerRef.current) {
      // Highlight the message
      setHighlightedMessage(messageId);

      // Scroll to the message
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedMessage(null);
      }, 3000);
    }
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  //  Fixed Socket Connection
  useEffect(() => {
    if (!user) return;

    console.log("🔄 Initializing socket connection for user:", user._id);

    const socketInstance = io("http://localhost:5000", {
      query: { userId: user._id },
    });

    socketInstance.on("connect", () => {
      console.log(" Connected to server");
      setConnectionStatus("connected");
      setSocket(socketInstance);
      toast.success("Connected to chat");
    });

    socketInstance.on("disconnect", () => {
      console.log(" Disconnected from server");
      setConnectionStatus("disconnected");
      toast.error("Disconnected from chat");
    });

    socketInstance.on("connection_success", (data) => {
      console.log(" Socket authenticated:", data);
    });

    // Handle incoming messages
    socketInstance.on("new_message", (message) => {
      console.log("📨 New message received:", message);

      setMessages((prev) => {
        const exists = prev.find((m) => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });

      // Show notification if not viewing this chat
      const isViewingThisChat = selectedChat?.chatRoomId === message.chatRoomId;
      if (!isViewingThisChat) {
        toast.success(
          `💬 ${message.user.fullName}: ${message.message || "Sent a message"}`,
          {
            duration: 4000,
            position: "top-right",
          }
        );
      }
    });

    // Handle message sent confirmation
    socketInstance.on("message_sent", (message) => {
      console.log(" Message sent successfully:", message);
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
      toast.success("Message sent");
    });

    // Handle message delivered
    socketInstance.on("message_delivered", (data) => {
      console.log(" Message delivered:", data);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, deliveredAt: new Date() } : msg
        )
      );
    });

    // Handle message edited
    socketInstance.on("message_edited", (data) => {
      console.log(" Message edited:", data);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, message: data.message, isEdited: true }
            : msg
        )
      );
      toast.success("Message updated");
    });

    // Handle message deleted with animation
    socketInstance.on("message_deleted", (data) => {
      console.log("🗑️ Message deleted:", data);
      setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
      toast.success("Message deleted");
    });

    // Handle chat room updates
    socketInstance.on("chat_room_updated", (chatRoom) => {
      console.log("🔄 Chat room updated");
      dispatch(GetUsersForSidebar());
    });

    // Handle online users
    socketInstance.on("online_users_updated", (users) => {
      console.log("👥 Online users updated:", users.length);
      setOnlineUsers(users);
    });

    // Handle typing indicators
    socketInstance.on("user_typing", (data) => {
      console.log("⌨️ Typing:", data);
      setIsTyping(data.isTyping);
      setTypingUser(data.userId);
    });

    // Handle messages read
    socketInstance.on("messages_read", (data) => {
      console.log("📖 Messages read:", data);
      dispatch(GetUsersForSidebar());
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error(error.message || "Socket error occurred");
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up socket connection");
      socketInstance.disconnect();
    };
  }, [user, dispatch]);

  //  Fetch sidebar users
  useEffect(() => {
    if (user) {
      dispatch(GetUsersForSidebar());
    }
  }, [user, dispatch]);

  //  Handle ad-based chat initiation
  useEffect(() => {
    if (!adId || !user || !socket || connectionStatus !== "connected") {
      return;
    }

    const initAdChat = async () => {
      try {
        console.log("🔄 Initializing ad-based chat for ad:", adId);

        // Get ad details
        const adResult = await dispatch(GetAdDetailsForChat(adId)).unwrap();
        const data = adResult.data;
        console.log("📦 Ad details data:", data);
        setAdDetails(data);

        const sellerId = data.user?._id;
        console.log("👤 Seller ID:", sellerId);

        if (!sellerId) {
          console.error(" Seller ID not found");
          return;
        }

        // Prevent self-chat
        if (sellerId === user._id) {
          toast.error("Cannot start chat with yourself");
          return;
        }

        // Get or create chat room with seller
        const roomResult = await dispatch(
          GetOrCreateChatRoom(sellerId)
        ).unwrap();
        const room = roomResult.chatRoom;
        console.log("💬 Chat room:", room);

        // Determine the other user
        const otherUser =
          room.user1._id.toString() === user._id.toString()
            ? room.user2
            : room.user1;
        console.log("👥 Other user:", otherUser);

        const chatData = {
          chatRoomId: room._id,
          user: otherUser,
          business: data.seller,
        };

        console.log("💾 Chat data to set:", chatData);
        console.log("📋 Data seller:", data.seller);
        console.log("👤 Other user details:", otherUser);

        setSelectedChat(chatData);

        // Join the chat room
        socket.emit("join_chat_room", room._id);
        console.log("🔗 Joined chat room:", room._id);

        // Load messages
        const messagesResult = await dispatch(
          GetChatRoomMessages(room._id)
        ).unwrap();
        console.log(
          "📨 Messages loaded:",
          messagesResult.messages?.length || 0
        );
        setMessages(messagesResult.messages || []);

        // Mark as read via API and socket for real-time update
        await dispatch(MarkAsRead(room._id));
        socket.emit("mark_messages_read", {
          chatRoomId: room._id,
          userId: user._id,
        });

        console.log(" Ad chat initialized successfully");
        toast.success("Chat started");
      } catch (err) {
        console.error(" Error initializing ad chat:", err);
        toast.error("Failed to initialize chat");
      }
    };

    initAdChat();
  }, [adId, user, socket, dispatch, connectionStatus]);

  //  Select chat manually from sidebar
  const handleSelectChat = async (chat: any) => {
    // Prevent self-chat
    if (chat.user._id === user._id) {
      toast.error("Cannot chat with yourself");
      return;
    }

    if (!socket || connectionStatus !== "connected") {
      toast.error("Please wait for connection");
      return;
    }

    setSelectedChat(chat);
    setReplyingTo(null);
    setShowProductSuggestion(false);

    // Join the chat room
    socket.emit("join_chat_room", chat.chatRoomId);

    try {
      const messagesResult = await dispatch(
        GetChatRoomMessages(chat.chatRoomId)
      ).unwrap();
      setMessages(messagesResult.messages || []);

      // Mark as read via API and socket for real-time update
      await dispatch(MarkAsRead(chat.chatRoomId));
      socket.emit("mark_messages_read", {
        chatRoomId: chat.chatRoomId,
        userId: user._id,
      });

      toast.success(`Chatting with ${chat.user.fullName}`);
    } catch (err) {
      console.error(" Error loading chat messages:", err);
      toast.error("Failed to load messages");
    }
  };

  //  Enhanced Send Message Handler with self-chat prevention
  const handleSend = useCallback(
    ({ message, images, location, replyTo, productReference }: any) => {
      if (!selectedChat || !socket || connectionStatus !== "connected") {
        toast.error("Cannot send message - not connected");
        return;
      }

      // Prevent self-chat
      if (selectedChat.user._id === user._id) {
        toast.error("Cannot send message to yourself");
        return;
      }

      const messageData = {
        senderId: user._id,
        receiverId: selectedChat.user._id,
        message: message || "",
        images: images || [],
        location: location || null,
        replyTo: replyTo || null,
        productReference: productReference || null,
      };

      console.log("📤 Sending message:", messageData);
      socket.emit("send_message", messageData);

      // Clear reply after sending
      if (replyTo) {
        setReplyingTo(null);
      }

      // Hide product suggestion after sending product message
      if (productReference) {
        setShowProductSuggestion(false);
      }
    },
    [selectedChat, socket, connectionStatus, user]
  );

  //  Enhanced Message Actions
  const handleReply = (message: any) => {
    setReplyingTo(message);
  };

  const handleEdit = (message: any, newMessage: string) => {
    if (newMessage && newMessage !== message.message) {
      socket.emit("edit_message", {
        chatRoomId: selectedChat.chatRoomId,
        messageId: message._id,
        message: newMessage,
      });
    }
  };

  const handleDelete = (message: any) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      socket.emit("delete_message", {
        chatRoomId: selectedChat.chatRoomId,
        messageId: message._id,
      });
    }
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
    setMessages([]);
    setReplyingTo(null);
    setShowProductSuggestion(true);
  };

  // NEW: Handle close chat (same as back but more explicit)
  const handleCloseChat = () => {
    setSelectedChat(null);
    setMessages([]);
    setReplyingTo(null);
    setShowProductSuggestion(true);
  };

  const showChatList = !selectedChat;
  const showConversation = !!selectedChat;

  // Function to set message refs
  const setMessageRef = useCallback(
    (messageId: string, element: HTMLDivElement | null) => {
      if (element) {
        messageRefs.current.set(messageId, element);
      } else {
        messageRefs.current.delete(messageId);
      }
    },
    []
  );

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      <main className="h-screen flex flex-col bg-gray-50 overflow-hidden mt-6">
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <div
            className={cn(
              "w-full md:w-80 bg-white flex flex-col",
              showConversation && "hidden md:flex"
            )}
          >
            <Sidebar
              chatUsers={chatUsers}
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChat?.chatRoomId}
              onlineUsers={onlineUsers}
              connectionStatus={connectionStatus}
              onCloseChat={handleCloseChat}
              user={user}
            />
          </div>

          {/* Conversation Area */}
          <div
            className={cn(
              "flex-1 flex flex-col min-w-0 bg-white",
              showChatList && "hidden md:flex"
            )}
          >
            {selectedChat ? (
              <>
                <ChatHeader
                  selected={selectedChat}
                  onlineUsers={onlineUsers}
                  onBack={handleBackToChats}
                  onClose={handleCloseChat} // Add close handler
                />

                {/* Messages Area with proper scroll container */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
                >
                  {/* Product Suggestion */}
                  {adDetails && showProductSuggestion && (
                    <ProductSuggestion
                      product={adDetails.product}
                      onSendProductMessage={handleSend}
                      onRemove={() => setShowProductSuggestion(false)}
                    />
                  )}

                  {/* Messages List */}
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-6 mb-4">
                        <Send className="h-12 w-12 text-purple-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        No messages yet
                      </p>
                      <p className="text-sm text-gray-500 text-center max-w-sm">
                        Start a conversation by sending a message below
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {messages.map((message) => (
                        <div
                          key={message._id}
                          ref={(el) => setMessageRef(message._id, el)}
                          className={cn(
                            "transition-all duration-300",
                            highlightedMessage === message._id &&
                              "bg-yellow-100 rounded-lg p-2 -mx-2"
                          )}
                        >
                          <MessageBubble
                            message={message}
                            align={
                              message.user._id === user._id ? "right" : "left"
                            }
                            currentUserId={user._id}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onScrollToMessage={scrollToMessage}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">typing...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <MessageInput
                  onSend={handleSend}
                  socket={socket}
                  selectedChat={selectedChat}
                  currentUser={user}
                  replyingTo={replyingTo}
                  onCancelReply={() => setReplyingTo(null)}
                  connectionStatus={connectionStatus}
                />
              </>
            ) : (
              // No Chat Selected State
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                <div className="text-center max-w-sm">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Send className="h-10 w-10 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-700 mb-3">
                    Welcome to Messages
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Choose a conversation from the sidebar to start messaging or
                    continue your existing conversations. All your chats are
                    securely stored and synced across devices.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
