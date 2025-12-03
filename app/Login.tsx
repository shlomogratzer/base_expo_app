import { Stack } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function Login() {
  const [input, setInput] = useState("");
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View>
              <Text>Login</Text>
            </View>
          ),
        }}
      />
      <View>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a phone number"
        />
      </View>
    </>
  );
}
