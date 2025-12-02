import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export function HomeHaeder() {
  return (
    <Stack.Screen
      options={{
        headerTitle: () => (
          <View style={styles.mane}>
            <Ionicons
              name="ellipsis-vertical-outline"
              size={32}
              color="black"
            />
            <Ionicons name="camera-outline" size={32} color="black" />
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  mane: {
    flexDirection: "row",
  },
});
