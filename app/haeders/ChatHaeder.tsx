import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface ChatHaederProps {
  id: string | string[];
  name: string | string[];
}
export function ChatHaeder({ id, name }: ChatHaederProps) {
  return (
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
            <View style={styles.headerRow}>
              <Ionicons name="videocam-outline" size={32} color="black" />
              <Ionicons name="call-outline" size={32} color="black" />
              <Ionicons
                name="ellipsis-vertical-outline"
                size={32}
                color="black"
              />
            </View>
          </View>
        ),
      }}
    />
  );
}
const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 38, height: 38, borderRadius: 19, marginRight: 10 },
  headerName: { fontSize: 17, fontWeight: "600" },
  headerStatus: { fontSize: 12, color: "gray" },
});
