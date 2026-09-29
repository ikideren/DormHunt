import React, { useState, useEffect } from 'react';
import { Button, Input, ListingCard, Spinner, Card, CardBody } from '../components';
import { dormService } from '../api/services/dorms';
import type { Dorm } from '../api/services/dorms';
import './SearchPage.css';

export const SearchPage: React.FC = () => {
  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000000 });
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchDorms();
  }, []);

  const fetchDorms = async () => {
    try {
      setLoading(true);
      const data = await dormService.listApproved();
      setDorms(data || []);
    } catch (err) {
      console.error('Failed to fetch dorms:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDorms = dorms.filter((dorm) => {
    const inPriceRange = dorm.price >= priceFilter.min && dorm.price <= priceFilter.max;
    const matchesType = !typeFilter || dorm.title.toLowerCase().includes(typeFilter.toLowerCase());
    return inPriceRange && matchesType;
  });

  return (
    <div className="search-page">
      <h1 className="search-page__title">Find Your Next Home</h1>

      <div className="search-page__content">
        {/* Sidebar Filters */}
        <aside className="search-page__filters">
          <Card variant="outlined">
            <CardBody>
              <h3 className="filters__title">Filters</h3>

              <div className="filters__group">
                <label>Price Range</label>
                <div className="filters__price">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceFilter.min}
                    onChange={(e) =>
                      setPriceFilter({ ...priceFilter, min: Number(e.target.value) })
                    }
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceFilter.max}
                    onChange={(e) =>
                      setPriceFilter({ ...priceFilter, max: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="filters__group">
                <Input
                  type="text"
                  placeholder="Type (Kos, Apartment...)"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                />
              </div>

              <Button fullWidth onClick={fetchDorms} variant="primary" size="sm">
                Apply Filters
              </Button>
            </CardBody>
          </Card>
        </aside>

        {/* Listings Grid */}
        <div className="search-page__listings">
          <div className="search-page__header">
            <p className="search-page__count">
              Found {filteredDorms.length} properties
            </p>
          </div>

          {loading ? (
            <div className="search-page__loading">
              <Spinner size="lg" />
              <p>Loading listings...</p>
            </div>
          ) : filteredDorms.length === 0 ? (
            <div className="search-page__empty">
              <p>No listings match your criteria. Try adjusting your filters.</p>
              <Button onClick={() => { setTypeFilter(''); setPriceFilter({ min: 0, max: 10000000 }); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredDorms.map((dorm) => (
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
      </div>
    </div>
  );
};

