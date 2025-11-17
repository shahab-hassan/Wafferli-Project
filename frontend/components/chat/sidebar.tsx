import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "../common/avatar";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

export function Sidebar({
  chatUsers,
  selectedChatId,
  onSelectChat,
  onlineUsers,
  connectionStatus,
  onCloseChat, // Add this prop
  user,
}: any) {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const conversations = useMemo(() => {
    let filtered = chatUsers || [];
    if (filter === "unread")
      return filtered.filter((c: any) => c.unreadCount > 0);
    if (filter === "read")
      return filtered.filter((c: any) => c.unreadCount === 0);
    return filtered;
  }, [chatUsers, filter]);

  const getAvatarContent = (user: any, isBusiness: boolean = false) => {
    if (isBusiness && user.logo) {
      return <img src={user.logo} alt={user.name} className="object-cover" />;
    }
    if (user.profileImage) {
      return (
        <img
          src={user.profileImage}
          alt={user.fullName}
          className="object-cover"
        />
      );
    }
    return (
      <AvatarFallback className=" text-purple-700 text-xs">
        {user.fullName?.slice(0, 2).toUpperCase() || "U"}
      </AvatarFallback>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold">Messages</h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-400"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            />
            <span className="text-xs text-purple-100 capitalize">
              {connectionStatus}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "read", label: "Read" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                filter === key
                  ? "bg-white text-purple-600 shadow-sm"
                  : "bg-purple-500 text-purple-100 hover:bg-purple-400"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 p-4">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-3 mb-2">
              <Send className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-sm text-center text-gray-600">
              No conversations found
            </p>
            <p className="text-xs text-center text-gray-500 mt-1">
              {filter !== "all"
                ? `No ${filter} messages`
                : "Start a new conversation"}
            </p>
          </div>
        ) : (
          conversations.map((conversation: any) => {
            const isActive = conversation.chatRoomId === selectedChatId;
            const isOnline = onlineUsers.includes(conversation.user?._id);

            // FIX: Only show unread count for messages not sent by current user
            const unreadCount =
              conversation.unreadCount > 0 &&
              conversation.lastMessage?.user?._id !== user?._id
                ? conversation.unreadCount
                : 0;

            return (
              <button
                key={conversation.chatRoomId}
                onClick={() => onSelectChat(conversation)}
                className={cn(
                  "w-full text-left p-4 border-b transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-inner"
                    : "hover:bg-gray-50 border-gray-100"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r-full" />
                )}

                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="size-12 border-2 border-white shadow-sm">
                      {getAvatarContent(
                        conversation.user,
                        conversation.user.role === "business"
                      )}
                    </Avatar>
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {conversation.user?.fullName || "Unknown User"}
                      </p>
                      {conversation.lastMessage?.createdAt && (
                        <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 ml-2">
                          {new Date(
                            conversation.lastMessage.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {conversation.lastMessage?.message || "No messages yet"}
                    </p>
                  </div>
                  {/* FIX: Only show badge for unread messages from other users */}
                  {unreadCount > 0 && (
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
