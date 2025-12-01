import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Message } from "../types/types";

interface MessegeInputProps {
  sendMessage: (messege: Partial<Message>) => Promise<void>;
}

export function MessegeInput({ sendMessage }: MessegeInputProps) {
  const [input, setInput] = useState("");

  function onPressSend() {
    if (!input.trim()) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }
  async function pickImage() {
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

      if (!result.canceled) {
        sendMessage({ imageUri: result.assets[0].uri });
      }
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Failed to pick image.");
    }
  }
  return (
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
  );
}

const styles = StyleSheet.create({
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
