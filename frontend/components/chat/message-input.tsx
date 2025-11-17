import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import LocationPicker, { PickedLocation } from "./location-picker";
import { Button } from "../common/button";
import { ImageIcon, Loader2, MapPin, Reply, Send, X } from "lucide-react";
import { Textarea } from "../common/textarea";

export function MessageInput({
  onSend,
  socket,
  selectedChat,
  currentUser,
  replyingTo,
  onCancelReply,
  connectionStatus,
}: any) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend =
    (value.trim().length > 0 || selectedImages.length > 0) &&
    !busy &&
    connectionStatus === "connected";

  const handleSend = useCallback(() => {
    if (!canSend) return;

    // Prevent self-chat
    if (selectedChat?.user?._id === currentUser._id) {
      toast.error("Cannot send message to yourself");
      return;
    }

    setBusy(true);
    onSend({
      message: value.trim(),
      images: selectedImages,
      replyTo: replyingTo || undefined,
    });

    setValue("");
    setSelectedImages([]);
    onCancelReply?.();
    setTimeout(() => setBusy(false), 500);
  }, [
    canSend,
    onSend,
    value,
    selectedImages,
    replyingTo,
    selectedChat,
    currentUser,
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const totalImages = selectedImages.length + files.length;
    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed in total");
      return;
    }

    const newImages: string[] = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large (max 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          setSelectedImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendLocation = useCallback(
    (location: PickedLocation) => {
      // Prevent self-chat
      if (selectedChat?.user?._id === currentUser._id) {
        toast.error("Cannot send message to yourself");
        return;
      }

      setBusy(true);
      onSend({ message: "", images: [], location });
      setBusy(false);
      setPickerOpen(false);
    },
    [onSend, selectedChat, currentUser]
  );

  // Typing indicators
  useEffect(() => {
    if (!socket || !selectedChat || connectionStatus !== "connected") return;

    let typingTimeout: NodeJS.Timeout;

    if (value.length > 0) {
      socket.emit("typing_start", {
        chatRoomId: selectedChat.chatRoomId,
        userId: currentUser._id,
      });

      typingTimeout = setTimeout(() => {
        socket.emit("typing_stop", {
          chatRoomId: selectedChat.chatRoomId,
          userId: currentUser._id,
        });
      }, 2000);
    } else {
      socket.emit("typing_stop", {
        chatRoomId: selectedChat.chatRoomId,
        userId: currentUser._id,
      });
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [value, socket, selectedChat, currentUser, connectionStatus]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Focus textarea when replying
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  return (
    <>
      {/* Enhanced Reply Preview */}
      {replyingTo && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-3 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-purple-700 mb-1">
              <Reply className="h-3 w-3" />
              <span className="font-medium">
                Replying to {replyingTo.user?.fullName}
              </span>
            </div>
            <p className="text-sm text-gray-800 line-clamp-2 bg-white px-2 py-1 rounded border">
              {replyingTo.message ||
                (replyingTo.images?.length > 0 ? "📷 Photo" : "📍 Location")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="h-6 w-6 p-0 flex-shrink-0 hover:bg-purple-100"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="p-3 bg-white border-b">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={image}
                  alt={`Selected ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full bg-red-500 hover:bg-red-600 border-2 border-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full p-4 bg-white border-t shadow-sm">
        <div className="flex items-end gap-3">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              connectionStatus === "connected"
                ? "Write a message..."
                : "Connecting..."
            }
            className="min-h-[44px] max-h-32 resize-none rounded-2xl flex-1 text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            rows={1}
            disabled={connectionStatus !== "connected"}
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 rounded-full border-gray-300 hover:border-purple-500 hover:bg-purple-50"
              title="Add images"
              disabled={connectionStatus !== "connected"}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => setPickerOpen(true)}
              className="h-10 w-10 rounded-full border-gray-300 hover:border-purple-500 hover:bg-purple-50"
              title="Send location"
              disabled={connectionStatus !== "connected"}
            >
              <MapPin className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="h-10 rounded-full px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:from-gray-400 disabled:to-gray-400 shadow-sm"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {connectionStatus !== "connected" && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Cannot send messages - disconnected
          </p>
        )}
      </div>

      <LocationPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={handleSendLocation}
      />
    </>
  );
}
