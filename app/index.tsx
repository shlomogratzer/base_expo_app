import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HomeHaeder } from "./haeders/HomeHaeder";
import { useGetUserId } from "./hooks/useGetUserId";

export default function ChatListScreen() {
  const { user } = useGetUserId();
  const chats = [
    { id: "1", name: "John Doe", last: "Hey, what's up?" },
    { id: "2", name: "Alice", last: "Don't forget tomorrow!" },
  ];
  return (
    <>
      <HomeHaeder />
      <View style={styles.container}>
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={{
              pathname: `./chat/${chat.id}`,
              params: { name: chat.name || user },
            }}
            asChild
          >
            <TouchableOpacity style={styles.chatBox}>
              <Text style={styles.name}>{chat.name}</Text>
              <Text style={styles.last}>{chat.last}</Text>
            </TouchableOpacity>
          </Link>
        ))}
        <View style={styles.chatBox}>
          <Link href="./Login">Login</Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  chatBox: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  name: { fontSize: 18, fontWeight: "600" },
  last: { color: "#666", marginTop: 4 },
});
