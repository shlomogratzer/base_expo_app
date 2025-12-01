import { Dispatch, RefObject } from "react";
import { FlatList } from "react-native";
import { io } from "socket.io-client";
import { Message } from "../types/types";

interface SocketProps {
  id: string | string[];
  socketRef: RefObject<any>;
  setMessages: Dispatch<React.SetStateAction<Message[]>>;
  flatListRef: RefObject<FlatList<any> | null>;
}
export function useSocket({
  id,
  socketRef,
  setMessages,
  flatListRef,
}: SocketProps) {
  const SERVER_URL = "http://10.0.2.2:3000";
  const socket = io(SERVER_URL, { transports: ["websocket"] });

  socketRef.current = socket;
  function connection() {
    socket.on("connect", () => {
      console.log("connected to server", socket.id);
      socket.emit("join", id);
    });
  }

  function resiveMessage() {
    socket.on("message", (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, { ...message, fromMe: message.fromMe }].sort(
          (a, b) => (a.createdAt || 0) - (b.createdAt || 0),
        );
      });

      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        50,
      );
    });
  }

  async function sendMessage(payload: Partial<Message>) {
    const message: Message = {
      id: Date.now().toString(),
      fromMe: true,
      senderName: "Me",
      createdAt: Date.now(),
      ...payload,
    };
    socketRef.current?.emit("message", { roomId: id, message });

    setMessages((prev) => [...prev, message]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
  }
  function disconnectRoom() {
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  }
  return { socket, sendMessage, disconnectRoom, resiveMessage, connection };
}
