// app/chat/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";

type Message = {
  id: string;
  fromMe?: boolean;
  text?: string;
  imageUri?: string;
  senderName?: string;
  createdAt?: number;
};

const SERVER_URL = "http://10.0.2.2:3000";

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
  const [input, setInput] = useState("");
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected to server", socket.id);
      socket.emit("join", id);
    });

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

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const sendMessage = async (payload: Partial<Message>) => {
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
  };

  const onPressSend = () => {
    if (!input.trim()) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "We need permission to access your photos.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
      });

      if (!result.cancelled) {
        sendMessage({ imageUri: result.uri });
      }
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
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
  };

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

          <View style={styles.inputRow}>
            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
              <Ionicons name="image-outline" size={24} />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={input}
              onChangeText={setInput}
              multiline
            />

            <TouchableOpacity onPress={onPressSend} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
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

  inputRow: {
    flexDirection: "row",
    padding: 8,
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  iconButton: {
    padding: 8,
    marginRight: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#128c7e",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    marginLeft: 8,
  },
});
