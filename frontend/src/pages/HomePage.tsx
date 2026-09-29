import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, ListingCard, Select, Spinner } from '../components';
import { dormService } from '../api/services/dorms';
import type { Dorm } from '../api/services/dorms';
import './HomePage.css';

const propertyTypeOptions = [
  { value: 'all', label: 'All spaces' },
  { value: 'kos', label: 'Kos' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'shared', label: 'Shared house' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('all');

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        const data = await dormService.listApproved();
        setDorms(data?.slice(0, 6) || []);
      } catch (err) {
        console.error('Failed to fetch dorms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDorms();
  }, []);

  const featuredDorm = dorms[0];

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchLocation.trim()) {
      params.set('location', searchLocation.trim());
    }

    if (propertyType !== 'all') {
      params.set('type', propertyType);
    }

    navigate(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="home-hero__eyebrow">Campus housing, redesigned</span>
          <h1 className="home-hero__title">Find a place that feels calm, verified, and close to class.</h1>
          <p className="home-hero__subtitle">
            DormHunt turns student housing into a quieter, more trustworthy experience with verified listings,
            fast messaging, and room-to-room comparison.
          </p>

          <div className="home-hero__search-panel">
            <Input
              type="text"
              placeholder="University, neighborhood, or address"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              options={propertyTypeOptions}
            />
            <Button variant="primary" size="lg" onClick={handleSearch}>
              Search homes
            </Button>
          </div>

          <div className="home-hero__actions">
            <Button variant="outline" onClick={() => navigate('/roommates')}>
              Find roommates
            </Button>
            <Button variant="secondary" onClick={() => navigate('/login')}>
              List your property
            </Button>
          </div>

          <div className="home-hero__stats">
            <article className="home-stat">
              <span className="home-stat__value">1,200+</span>
              <span className="home-stat__label">verified homes listed</span>
            </article>
            <article className="home-stat">
              <span className="home-stat__value">4.8/5</span>
              <span className="home-stat__label">average tenant rating</span>
            </article>
            <article className="home-stat">
              <span className="home-stat__value">24h</span>
              <span className="home-stat__label">average owner response</span>
            </article>
          </div>
        </div>

        <div className="home-hero__visual" aria-hidden="true">
          <div className="home-hero__halo home-hero__halo--blue" />
          <div className="home-hero__halo home-hero__halo--mint" />

          <div className="home-hero__visual-card home-hero__visual-card--main">
            {featuredDorm?.images?.[0] ? (
              <img src={featuredDorm.images[0]} alt="Featured dorm preview" />
            ) : (
              <div className="home-hero__visual-illustration">
                <span>🏡</span>
              </div>
            )}

            <div className="home-hero__visual-content">
              <span className="home-hero__visual-kicker">Featured property</span>
              <strong>{featuredDorm?.title || 'Verified campus housing network'}</strong>
              <p>
                {featuredDorm
                  ? `${featuredDorm.address} · Rp ${featuredDorm.price.toLocaleString('id-ID')}/mo`
                  : 'A calmer discovery experience for students and owners.'}
              </p>
            </div>
          </div>

          <div className="home-hero__floating home-hero__floating--top">
            <span>Avg. response</span>
            <strong>Under 24 hours</strong>
          </div>

          <div className="home-hero__floating home-hero__floating--bottom">
            <span>Side-by-side compare</span>
            <strong>Up to 4 listings</strong>
          </div>
        </div>
      </section>

      <section className="home-section home-section--featured">
        <div className="section-heading">
          <div>
            <span className="section-heading__eyebrow">Featured properties</span>
            <h2>Spaces with the right mix of clarity, comfort, and trust.</h2>
          </div>
          <Button variant="outline" onClick={() => navigate('/search')}>
            View all
          </Button>
        </div>

        {loading ? (
          <div className="home-section__loading">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="home-featured-grid">
            {dorms.map((dorm) => (
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
      </section>

      <section className="home-section home-section--insights">
        <div className="section-heading section-heading--centered">
          <div>
            <span className="section-heading__eyebrow">Why it feels different</span>
            <h2>Less noise. More signal. Everything arranged so decisions are easy.</h2>
          </div>
        </div>

        <div className="home-insights-grid">
          <article className="home-insight">
            <div className="home-insight__icon">01</div>
            <h3>Discover fast</h3>
            <p>Search by campus, neighborhood, or budget and get a calm grid of verified listings.</p>
          </article>
          <article className="home-insight">
            <div className="home-insight__icon">02</div>
            <h3>Compare clearly</h3>
            <p>Keep up to four homes side-by-side and focus on the differences that matter.</p>
          </article>
          <article className="home-insight">
            <div className="home-insight__icon">03</div>
            <h3>Connect simply</h3>
            <p>Reach owners, save favorites, and move from browsing to action without the clutter.</p>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta__content">
          <span className="section-heading__eyebrow">Ready to move</span>
          <h2>Start with a cleaner housing search.</h2>
          <p>
            Join the students already using DormHunt to compare places, save options, and contact owners with more
            confidence.
          </p>
          <div className="home-cta__actions">
            <Button variant="primary" size="lg" onClick={() => navigate('/search')}>
              Start searching
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
              Sign up as an owner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
