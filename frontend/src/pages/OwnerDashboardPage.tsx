import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Spinner } from '../components';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import './OwnerDashboardPage.css';

interface Message {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
  propertyTitle: string;
  isRead: boolean;
}

export const OwnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const stats = { activeListings: 3, totalViews: 1240, contacts: 8 };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMessages([
        { id: '1', senderName: 'Budi', message: 'Is this available?', createdAt: '2024-01-12', propertyTitle: 'Modern Studio', isRead: false },
        { id: '2', senderName: 'Sarah', message: 'Can I view next week?', createdAt: '2024-01-11', propertyTitle: 'Apartment', isRead: true },
      ]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  return (
    <div className="owner-dashboard">
      <h1>Owner Dashboard</h1>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <div className="owner-stats">
            <Card><CardBody><div className="stat"><div>{stats.activeListings}</div><div>Active Listings</div><Button size="sm" variant="outline" onClick={() => navigate('/manage')}>Manage</Button></div></CardBody></Card>
            <Card><CardBody><div className="stat"><div>{stats.totalViews}</div><div>Views</div></div></CardBody></Card>
            <Card><CardBody><div className="stat"><div>{stats.contacts}</div><div>Contacts</div></div></CardBody></Card>
          </div>
          <h2>Recent Inquiries</h2>
          {messages.length === 0 ? (
            <p>No messages</p>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <Card key={msg.id} variant="outlined">
                  <CardBody>
                    <h3>{msg.senderName}</h3>
                    <p>{msg.propertyTitle}</p>
                    <p>{msg.message}</p>
                    {!msg.isRead && (
                      <Button size="sm" variant="outline" onClick={() => markAsRead(msg.id)}>Mark Read</Button>
                    )}
                    <Button size="sm" variant="primary">Reply</Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
