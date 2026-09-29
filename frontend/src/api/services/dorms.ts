import { api } from '../client';

export interface Dorm {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  facilities: string[];
  images: string[];
  address: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const dormService = {
  listApproved: async () => {
    const { data } = await api.get<Dorm[]>('/dorms');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Dorm>(`/dorms/${id}`);
    return data;
  },

  create: async (dorm: Partial<Dorm>) => {
    const { data } = await api.post<Dorm>('/dorms', dorm);
    return data;
  },
};
