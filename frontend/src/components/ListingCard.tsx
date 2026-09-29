import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import './ListingCard.css';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image?: string;
  rating?: number;
  reviews?: number;
  location: string;
  type: string;
  facilities?: string[];
  onFavorite?: () => void;
  isFavorited?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  price,
  image,
  rating = 4.5,
  reviews = 12,
  location,
  type,
  facilities = [],
  onFavorite,
  isFavorited = false,
}) => {
  return (
    <Link to={`/listings/${id}`} className="listing-card-link">
      <Card variant="elevated" className="listing-card">
        <div className="listing-card__image-container">
          <img
            src={image || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'}
            alt={title}
            className="listing-card__image"
          />
          <Badge variant="primary" className="listing-card__type">
            {type}
          </Badge>
          <button
            className="listing-card__favorite"
            onClick={(e) => {
              e.preventDefault();
              onFavorite?.();
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
          <div className="listing-card__rating">
            <span className="listing-card__stars">⭐</span>
            <span className="listing-card__rating-value">{rating}</span>
            <span className="listing-card__reviews">({reviews})</span>
          </div>
        </div>
        <CardBody>
          <h3 className="listing-card__title">{title}</h3>
          <p className="listing-card__location">📍 {location}</p>
          <p className="listing-card__price">Rp. {price.toLocaleString('id-ID')}/mo</p>

          {facilities.length > 0 && (
            <div className="listing-card__facilities">
              {facilities.slice(0, 3).map((fac) => (
                <Badge key={fac} variant="neutral" size="sm">
                  {fac}
                </Badge>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="listing-card__details-btn"
            onClick={(e) => e.preventDefault()}
          >
            View Details
          </Button>
        </CardBody>
      </Card>
    </Link>
  );
};
