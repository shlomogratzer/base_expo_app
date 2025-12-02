import * as SecureStore from "expo-secure-store";

export function useGetUserId() {
  async function getUser() {
    const userId = await SecureStore.getItemAsync("user-id");
    if (userId) {
      return userId;
    }
    return null;
  }
  async function setUser(userId: string) {
    await SecureStore.setItemAsync("user-id", userId);
  }
  async function removeUser() {
    await SecureStore.deleteItemAsync("user-id");
  }
  return { getUser, setUser, removeUser };
}
