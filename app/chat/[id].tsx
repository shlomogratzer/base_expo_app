// app/chat/[id].tsx
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { MessegeInput } from "../components/MessegeInput";
import RenderItem from "../components/RenderItem";
import { ChatHaeder } from "../haeders/ChatHaeder";
import { useSocket } from "../hooks/useSocket";
import { Message } from "../types/types";

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      fromMe: false,
      text: "Hey, how are you?",
      senderName: (name as string) || "John",
      createdAt: Date.now() - 60000,
    },
    {
      id: "m2",
      fromMe: true,
      text: "I'm good, thanks!",
      createdAt: Date.now() - 30000,
    },
  ]);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const { socket, sendMessage, disconnectRoom, resiveMessage, connection } =
    useSocket({
      id,
      socketRef,
      setMessages,
      flatListRef,
    });

  useEffect(() => {
    connection();
    resiveMessage();
    disconnectRoom();
    return () => {
      socket.disconnect();
    };
  });
  function renderItem({ item }: { item: Message }) {
    return <RenderItem item={item} />;
  }

  return (
    <>
      <ChatHaeder id={id} name={name} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={messages.sort(
              (a, b) => (a.createdAt || 0) - (b.createdAt || 0),
            )}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
          />
          <MessegeInput sendMessage={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ece5dd", paddingHorizontal: 10 },
});
