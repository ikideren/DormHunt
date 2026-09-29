import { api } from '../client';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  dorm_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const messageService = {
  send: async (message: {
    receiver_id: string;
    dorm_id?: string;
    content: string;
  }) => {
    const { data } = await api.post<Message>('/messages', message);
    return data;
  },

  conversation: async (userId: string, limit = 50) => {
    const { data } = await api.get<Message[]>(`/messages/conversation/${userId}`, {
      params: { limit },
    });
    return data;
  },
};
