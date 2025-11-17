import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "../common/avatar";
import { Check, CheckCheck, Edit, Reply, Trash2 } from "lucide-react";
import { Button } from "../common/button";
import { LocationPreview } from "./locationPreview";

export function MessageBubble({
  message,
  align,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onScrollToMessage,
}: any) {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.message);
  const messageRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOwnMessage = message.user._id === currentUserId;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        messageRef.current &&
        !messageRef.current.contains(event.target as Node)
      ) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMessageClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on links, images, or reply preview
    if (
      (e.target as HTMLElement).tagName === "A" ||
      (e.target as HTMLElement).tagName === "IMG" ||
      (e.target as HTMLElement).closest(".reply-preview")
    ) {
      return;
    }
    setShowActionMenu(!showActionMenu);
  };

  const handleReply = () => {
    onReply?.(message);
    setShowActionMenu(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(message.message);
    setShowActionMenu(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.message) {
      onEdit?.(message, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(message.message);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete?.(message);
    setShowActionMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleClickReply = () => {
    if (message.replyTo) {
      onScrollToMessage?.(message.replyTo.messageId);
    }
  };

  // Enhanced user display logic
  const getUserDisplayInfo = (user: any, business: any = null) => {
    const isBusiness = user.role === "seller" || business;

    return {
      isBusiness,
      displayName: isBusiness && business?.name ? business.name : user.fullName,
      avatar: isBusiness && business?.logo ? business.logo : user.profileImage,
      subText: isBusiness ? user.fullName : null,
    };
  };

  const userInfo = getUserDisplayInfo(message.user);

  return (
    <div
      ref={messageRef}
      className={`flex gap-2 ${
        align === "right" ? "justify-end" : "justify-start"
      } group relative mb-4`}
    >
      {/* Profile Picture - Show for received messages */}
      {align === "left" && (
        <Avatar className="size-8 flex-shrink-0 mt-1 border-2 border-white shadow-sm">
          {userInfo.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo.displayName}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className=" text-purple-700 text-sm">
              {userInfo.displayName?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
      )}

      <div className="flex flex-col max-w-xs lg:max-w-md">
        {/* User Info for received messages */}
        {align === "left" && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-medium text-gray-700">
              {userInfo.displayName}
            </span>
            {userInfo.subText && (
              <span className="text-xs text-gray-500">
                ({userInfo.subText})
              </span>
            )}
            {userInfo.isBusiness && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                Business
              </span>
            )}
          </div>
        )}

        {/* Action Menu */}
        {showActionMenu && (
          <div
            ref={menuRef}
            className={`absolute top-0 ${
              align === "right" ? "left-0" : "right-0"
            } transform -translate-y-full flex gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-[120px]`}
          >
            <button
              onClick={handleReply}
              className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              title="Reply"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>

            {isOwnMessage && (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Message Content */}
        <div
          onClick={handleMessageClick}
          className={`rounded-2xl px-4 py-3 shadow-sm cursor-pointer transition-all hover:shadow-md ${
            align === "right"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          }`}
        >
          {/* Reply Preview */}
          {message.replyTo && (
            <div
              onClick={handleClickReply}
              className={`mb-3 p-3 rounded-lg border-l-3 cursor-pointer transition-all hover:opacity-80 reply-preview ${
                align === "right"
                  ? "bg-purple-500 border-purple-300"
                  : "bg-gray-200 border-gray-400"
              }`}
            >
              <p className="text-xs font-medium opacity-90 mb-1">
                {message.replyTo.user?.fullName || "Unknown"}
              </p>
              <p className="text-sm truncate">
                {message.replyTo.text || message.replyTo.message || "📷 Photo"}
              </p>
            </div>
          )}

          {/* Product Reference */}
          {message.productReference && (
            <div
              className={`mb-3 p-3 rounded-lg ${
                align === "right" ? "bg-purple-500" : "bg-white"
              }`}
            >
              <div className="flex gap-2 items-start">
                {message.productReference.image && (
                  <img
                    src={`${message.productReference.image}`}
                    alt={message.productReference.title}
                    className="w-8 h-8 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      align === "right" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {message.productReference.title}
                  </p>
                  {message.productReference.price && (
                    <p
                      className={`text-xs ${
                        align === "right" ? "text-purple-100" : "text-green-600"
                      }`}
                    >
                      ${message.productReference.price}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode - Inline Editing */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                autoFocus
                style={{ minHeight: "60px" }}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="h-7 text-xs border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="h-7 text-xs bg-green-600 hover:bg-green-700"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            /* Message Content */
            <div className="break-words">
              <p className="text-sm leading-relaxed">{message.message}</p>

              {/* Multiple Images */}
              {message.images && message.images.length > 0 && (
                <div
                  className={`grid gap-2 mt-3 ${
                    message.images.length === 1
                      ? "grid-cols-1"
                      : message.images.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2"
                  }`}
                >
                  {message.images.map((img: string, index: number) => (
                    <img
                      key={index}
                      src={`${img}`}
                      alt={`Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              )}

              {/* Enhanced Location Display */}
              {message.location && (
                <div className="mt-3">
                  <LocationPreview
                    location={message.location}
                    className="max-w-[280px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Meta */}
        <div
          className={`flex items-center gap-2 mt-1 px-1 ${
            align === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-xs ${
              align === "right" ? "text-purple-200" : "text-gray-500"
            }`}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.isEdited && (
            <span
              className={`text-xs italic ${
                align === "right" ? "text-purple-200" : "text-gray-500"
              }`}
            >
              edited
            </span>
          )}
          {align === "right" && (
            <div className="flex items-center gap-1">
              {message.readAt ? (
                <CheckCheck className="h-3 w-3 text-purple-200" />
              ) : message.deliveredAt ? (
                <CheckCheck className="h-3 w-3 text-gray-400" />
              ) : (
                <Check className="h-3 w-3 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Picture - Show for sent messages */}
      {align === "right" && (
        <Avatar className="size-8 flex-shrink-0 mt-1 border-2 border-white shadow-sm">
          {userInfo.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo.displayName}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="text-purple-700 text-xs">
              {userInfo.displayName?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  );
}
