import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ListingCard, Spinner, Card, CardBody } from '../components';
import { dormService } from '../api/services/dorms';
import type { Dorm } from '../api/services/dorms';
import { useAuthStore } from '../store/auth';
import './FavoritesPage.css';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [favorites, setFavorites] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const saved = localStorage.getItem('favorites');
      const favoriteIds = saved ? JSON.parse(saved) : [];
      const data = await dormService.listApproved();
      const fav = data?.filter((d) => favoriteIds.includes(d.id)) || [];
      setFavorites(fav);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="favorites-page__loading"><Spinner size="lg" /></div>;
  }

  return (
    <div className="favorites-page">
      <h1>My Saved Properties</h1>
      {favorites.length === 0 ? (
        <Card variant="outlined">
          <CardBody>
            <p>No saved properties</p>
            <Button onClick={() => navigate('/search')} variant="primary">Browse Listings</Button>
          </CardBody>
        </Card>
      ) : (
        <div className="favorites-grid">
          {favorites.map((dorm) => (
            <ListingCard
              key={dorm.id}
              id={dorm.id}
              title={dorm.title}
              price={dorm.price}
              location={dorm.address}
              type={dorm.price < 1000000 ? 'Kos' : 'Apartment'}
              facilities={dorm.facilities}
              image={dorm.images?.[0]}
            />
          ))}
        </div>
      )}
    </div>
  );
};
