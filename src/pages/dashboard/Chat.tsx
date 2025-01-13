import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader, CardContent } from "@/components/ui/card";
import { useAppSelecter } from "@/Redux/Hooks/store";
import toast from "react-hot-toast";
import { Chats, upload } from "@/service/apiService";
import { FaArrowLeft, FaPaperclip } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Socket setup
const socket: Socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 5000,
});

// Define a normalized message type for state
interface Message {
  senderId: string;
  senderName: string;
  receiverId: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  timestamp: string;
}

// Server response structure for messages
interface ServerMessage {
  _id: string;
  sender: { _id: string; name: string; email: string };
  receiver: { _id: string; name: string; email: string };
  content?: string;
  fileUrl?: string;
  fileType?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploading, setisFileUploading] = useState<boolean>(false);

  const selectedReceiverId = useAppSelecter((state) => state.cart._id);
  const selectedReceiverName = useAppSelecter((state) => state?.cart.name);
  const userId = useAppSelecter((state) => state.auth.user?._id);
  const userName = useAppSelecter((state) => state?.auth.user?.name);

  const navigate = useNavigate();

  // Join a room based on selected receiver
  useEffect(() => {
    if (selectedReceiverId && userId) {
      socket.emit("join_room", { senderId: userId, receiverId: selectedReceiverId });
    }
  }, [selectedReceiverId, userId]);

  // Listen for new messages from the server
  useEffect(() => {
    socket.on("receive_message", (newMessage: ServerMessage) => {
      // Prevent duplication of messages you just sent
      if (newMessage.sender._id === userId) return;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: newMessage.sender._id,
          senderName: newMessage.sender.name,
          receiverId: newMessage.receiver._id,
          content: newMessage.content,
          fileUrl: newMessage.fileUrl,
          fileType: newMessage.fileType,
          timestamp: newMessage.createdAt,
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userId]);

  // Fetch initial chat history
  const fetchChatMessages = async (userId: string, selectedReceiverId: string) => {
    try {
      const response = await Chats(userId, selectedReceiverId);
      const data = response?.data as ServerMessage[];
      const formattedMessages = data.map((msg: ServerMessage) => ({
        senderId: msg.sender._id,
        senderName: msg.sender.name,
        receiverId: msg.receiver._id,
        content: msg.content,
        fileUrl: msg.fileUrl,
        fileType: msg.fileType,
        timestamp: msg.createdAt,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    if (userId && selectedReceiverId) {
      fetchChatMessages(userId, selectedReceiverId);
    }
  }, [userId, selectedReceiverId]);

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file || !selectedReceiverId) {
      toast.error("Select a file and receiver to continue.");
      return;
    }

    setisFileUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", userId!);
    formData.append("receiver", selectedReceiverId);

    try {
      const response = await upload(formData);
      const uploadedMessage = response.data;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: (uploadedMessage as ServerMessage).sender._id,
          senderName: userName!,
          receiverId: (uploadedMessage as ServerMessage).receiver._id,
          fileUrl: (uploadedMessage as ServerMessage).fileUrl,
          fileType: (uploadedMessage as ServerMessage).fileType,
          timestamp: (uploadedMessage as ServerMessage).createdAt,
        },
      ]);

      setFile(null);
      toast.success("File sent successfully!");
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("Failed to send the file.");
    } finally {
      setisFileUploading(false);
    }
  };

  // Handle sending a text message
  const sendMessage = () => {
    if (!message.trim() || !selectedReceiverId) {
      toast.error("Select a receiver to continue chat");
      return;
    }

    if (!socket.connected) {
      console.error("Socket is not connected");
      return;
    }

    const newMessage = {
      senderId: userId!,
      senderName: userName!,
      receiverId: selectedReceiverId,
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };
    socket.emit("send_message", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  // Handle send button click
  const handleSendClick = () => {
    if (file) {
      handleFileUpload();
    } else if (message.trim()) {
      sendMessage();
    } else {
      toast.error("Please type a message or select a file.");
    }
  };

  return (
    <Card className="flex flex-col h-full border rounded-sm">
      <CardHeader className="p-4 border-b">
        <div className="flex gap-2">
          <Button onClick={() => navigate("/users")} variant="outline" className="block sm:hidden">
            <FaArrowLeft />
          </Button>
          <h3 className="text-lg font-semibold">Chat with {selectedReceiverName || "Select a receiver"}</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 relative rounded-lg shadow ${
              msg.senderId === userId ? "self-end bg-blue-400 text-white" : "self-start bg-white text-gray-800 border"
            }`}
          >
            <p className="font-bold">{msg.senderId === userId ? "You" : msg.senderName}</p>
            {msg.content && <p>{msg.content}</p>}
            {msg.fileUrl && (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {msg.fileType?.startsWith("image/") ? (
                  <img src={msg.fileUrl} alt="Uploaded file" className="w-32 h-32 object-cover rounded-lg" />
                ) : (
                  "View File"
                )}
              </a>
            )}
            <p className="text-xs text-gray-500 absolute bottom-0 right-1">
              {new Date(msg.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex items-center gap-2 p-4 border-t">
        <label htmlFor="file-upload" className="cursor-pointer">
          <FaPaperclip size={20} className="text-gray-600 hover:text-gray-800" />
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={handleSendClick} disabled={isFileUploading}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Chat;
