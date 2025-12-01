// app/chat/[id].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MessegeInput } from "../components/MessegeInput";
import { useSocket } from "../hooks/useSocket";
import { Message } from "../types/types";

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      fromMe: false,
      text: "Hey, how are you?",
      senderName: name || "John",
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
    return (
      <View
        style={[
          styles.message,
          item.fromMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {!item.fromMe && item.senderName && (
          <Text style={styles.sender}>{item.senderName}</Text>
        )}

        {item.text ? <Text>{item.text}</Text> : null}

        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.imageMessage} />
        ) : null}
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerRow}>
              <Image
                source={{ uri: "https://i.pravatar.cc/100?u=" + (id || "1") }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.headerName}>{name || `Chat ${id}`}</Text>
                <Text style={styles.headerStatus}>Online</Text>
              </View>
            </View>
          ),
        }}
      />

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

  headerRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 38, height: 38, borderRadius: 19, marginRight: 10 },
  headerName: { fontSize: 17, fontWeight: "600" },
  headerStatus: { fontSize: 12, color: "gray" },

  message: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    maxWidth: "80%",
    marginVertical: 6,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sender: { fontSize: 11, color: "#075e54", marginBottom: 4 },
  imageMessage: { width: 180, height: 120, borderRadius: 10, marginTop: 6 },
});
