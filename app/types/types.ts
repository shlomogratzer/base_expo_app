export type Message = {
  id: string;
  fromMe?: boolean;
  text?: string;
  imageUri?: string;
  senderName?: string;
  createdAt?: number;
};
