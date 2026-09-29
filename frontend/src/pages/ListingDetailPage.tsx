import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge, Spinner, Card, CardBody, Modal } from '../components';
import { dormService } from '../api/services/dorms';
import type { Dorm } from '../api/services/dorms';
import { messageService } from '../api/services/messages';
import { useAuthStore } from '../store/auth';
import './ListingDetailPage.css';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [dorm, setDorm] = useState<Dorm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDorm();
    }
  }, [id]);

  const fetchDorm = async () => {
    try {
      setLoading(true);
      const data = await dormService.getById(id!);
      setDorm(data);
    } catch (err) {
      setError('Failed to load listing. Please try again.');
      console.error('Error fetching dorm:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactOwner = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    setSendingMessage(true);
    try {
      await messageService.send({
        receiver_id: dorm!.seller_id,
        content: contactMessage,
        dorm_id: dorm!.id,
      });

      setContactMessage('');
      setShowContactModal(false);
      alert('Message sent! The owner will contact you soon.');
    } catch (err) {
      alert('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="listing-detail__loading">
        <Spinner size="lg" />
        <p>Loading listing details...</p>
      </div>
    );
  }

  if (error || !dorm) {
    return (
      <div className="listing-detail__error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Button onClick={() => navigate('/search')} variant="primary">
          Back to Search
        </Button>
      </div>
    );
  }

  const images = dorm.images && dorm.images.length > 0
    ? dorm.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'];

  return (
    <div className="listing-detail">
      {/* Image Gallery */}
      <section className="listing-detail__gallery">
        <div className="gallery__main">
          <img src={images[currentImageIndex]} alt={dorm.title} />
          <button
            className="gallery__nav gallery__nav--prev"
            onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
          >
            ←
          </button>
          <button
            className="gallery__nav gallery__nav--next"
            onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
          >
            →
          </button>
        </div>

        <div className="gallery__thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`gallery__thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(idx)}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      </section>

      {/* Header with Title & Actions */}
      <section className="listing-detail__header">
        <div className="header__info">
          <h1>{dorm.title}</h1>
          <p className="header__location">📍 {dorm.address}</p>
          <Badge variant="success">Approved</Badge>
        </div>

        <div className="header__actions">
          <Button
            onClick={handleFavorite}
            variant={isFavorite ? 'primary' : 'outline'}
            size="lg"
          >
            {isFavorite ? '❤️ Saved' : '🤍 Save'}
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <div className="listing-detail__content">
        {/* Left Column */}
        <div className="listing-detail__main">
          {/* Price Section */}
          <section className="detail-section">
            <h2 className="section__title">Price</h2>
            <div className="detail-price">
              <span className="price-amount">
                Rp {dorm.price.toLocaleString('id-ID')}
              </span>
              <span className="price-period">per month</span>
            </div>
          </section>

          {/* Description */}
          <section className="detail-section">
            <h2 className="section__title">About this Property</h2>
            <p className="detail-description">{dorm.description}</p>
          </section>

          {/* Facilities */}
          <section className="detail-section">
            <h2 className="section__title">Facilities & Amenities</h2>
            <div className="facilities-grid">
              {dorm.facilities && dorm.facilities.length > 0 ? (
                dorm.facilities.map((facility, idx) => (
                  <div key={idx} className="facility-item">
                    <span className="facility-icon">✓</span>
                    <span>{facility}</span>
                  </div>
                ))
              ) : (
                <p>No facilities listed</p>
              )}
            </div>
          </section>

          {/* Location Map */}
          <section className="detail-section">
            <h2 className="section__title">Location</h2>
            <div className="location-info">
              <p>
                <strong>Coordinates:</strong> {dorm.latitude.toFixed(4)}, {dorm.longitude.toFixed(4)}
              </p>
              <p className="location-note">
                📍 Map integration coming soon
              </p>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="detail-section">
            <h2 className="section__title">Reviews & Ratings</h2>
            <div className="reviews-placeholder">
              <p>No reviews yet. Be the first to review this property!</p>
              <Button onClick={() => alert('Review feature coming soon')} variant="outline" size="sm">
                Write Review
              </Button>
            </div>
          </section>
        </div>

        {/* Right Column - Contact Card */}
        <aside className="listing-detail__sidebar">
          <Card variant="elevated">
            <CardBody>
              <h3>Interested in this property?</h3>

              <div className="contact-details">
                <p>
                  <strong>Owner ID:</strong> {dorm.seller_id.substring(0, 12)}...
                </p>
                <p className="contact-hint">Contact the owner to schedule a viewing or ask questions</p>
              </div>

              <Button
                fullWidth
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setShowContactModal(true);
                  }
                }}
                variant="primary"
                size="lg"
              >
                📧 Contact Owner
              </Button>

              <Button fullWidth onClick={() => navigate('/compare')} variant="outline" size="md">
                Compare Properties
              </Button>

              <div className="share-section">
                <p className="share-title">Share this listing</p>
                <div className="share-buttons">
                  <button className="share-btn" title="Share on Facebook">
                    f
                  </button>
                  <button className="share-btn" title="Share on Twitter">
                    𝕏
                  </button>
                  <button className="share-btn" title="Copy link">
                    🔗
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </aside>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <Modal isOpen={showContactModal} size="md" onClose={() => setShowContactModal(false)}>
          <div className="contact-modal">
            <h2>Send a Message to Owner</h2>
            <textarea
              className="contact-modal__textarea"
              placeholder="Ask about availability, schedule a viewing, or introduce yourself..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              rows={6}
            />
            <div className="contact-modal__actions">
              <Button onClick={() => setShowContactModal(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleContactOwner}
                variant="primary"
                disabled={sendingMessage}
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
