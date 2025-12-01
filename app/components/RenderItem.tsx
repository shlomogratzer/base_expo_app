import { Image, StyleSheet, Text, View } from "react-native";
import { Message } from "../types/types";

export default function renderItem({ item }: { item: Message }) {
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
const styles = StyleSheet.create({
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
