import { api } from '../client';

export interface Report {
  id: string;
  reporter_id: string;
  reported_item_id: string;
  reported_item_type: 'dorm' | 'user' | 'comment';
  reason: string;
  details?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'dismissed';
  created_at: string;
}

export const reportService = {
  submit: async (report: {
    reported_item_id: string;
    reported_item_type: 'dorm' | 'user' | 'comment';
    reason: string;
    details?: string;
  }) => {
    const { data } = await api.post<Report>('/reports', report);
    return data;
  },

  listOpen: async () => {
    const { data } = await api.get<Report[]>('/reports/open');
    return data;
  },

  resolve: async (id: string) => {
    await api.patch(`/reports/${id}/resolve`);
  },
};
