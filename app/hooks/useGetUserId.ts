import * as SecureStore from "expo-secure-store";
import { useState } from "react";

export function useGetUserId() {
  const [user, setUser] = useState<string | null>(null);
  async function getUser() {
    const userId = await SecureStore.getItemAsync("user");
    if (userId) {
      setUser(userId);
    }
  }

  async function saveUser(userId: string) {
    await SecureStore.setItemAsync("user", userId);
    setUser(userId);
  }
  async function removeUser() {
    await SecureStore.deleteItemAsync("user");
    setUser(null);
  }
  return { getUser, saveUser, removeUser, user };
}
