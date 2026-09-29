import React, { useState, useEffect } from 'react';
import { Button, Input, Spinner, Card, CardBody } from '../components';
import { dormService } from '../api/services/dorms';
import type { Dorm } from '../api/services/dorms';
import './CompareListingsPage.css';

export const CompareListingsPage: React.FC = () => {
  const [allDorms, setAllDorms] = useState<Dorm[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDorms();
  }, []);

  const fetchDorms = async () => {
    try {
      setLoading(true);
      const data = await dormService.listApproved();
      setAllDorms(data || []);
    } catch (err) {
      console.error('Failed to fetch dorms:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = allDorms.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDorms = allDorms.filter((d) => selected.includes(d.id));

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    } else {
      alert('You can compare up to 4 properties');
    }
  };

  return (
    <div className="compare-page">
      <div className="compare-page__header">
        <h1>Compare Properties</h1>
        <p>Select up to 4 properties to compare side-by-side</p>
        <span className="compare-count">{selected.length} / 4 selected</span>
      </div>

      <div className="compare-page__content">
        {/* Selection Panel */}
        <aside className="compare-page__selector">
          <Card variant="outlined">
            <CardBody>
              <h3>Select Properties</h3>
              <Input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {loading ? (
                <div className="selector-loading">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="selector-list">
                  {filtered.map((dorm) => (
                    <button
                      key={dorm.id}
                      className={`selector-item ${selected.includes(dorm.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelect(dorm.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(dorm.id)}
                        readOnly
                      />
                      <div>
                        <div className="selector-item__title">{dorm.title}</div>
                        <div className="selector-item__price">Rp {dorm.price.toLocaleString('id-ID')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </aside>

        {/* Comparison Table */}
        <div className="compare-page__table">
          {selectedDorms.length === 0 ? (
            <div className="compare-empty">
              <p>👈 Select properties from the left to compare</p>
            </div>
          ) : (
            <div className="comparison-grid">
              {selectedDorms.map((dorm) => (
                <div key={dorm.id} className="comparison-card">
                  <div className="comparison-card__image">
                    <img
                      src={dorm.images?.[0] || 'https://via.placeholder.com/200'}
                      alt={dorm.title}
                    />
                  </div>
                  <h3>{dorm.title}</h3>
                  <div className="comparison-row">
                    <span>Price:</span>
                    <strong>Rp {dorm.price.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="comparison-row">
                    <span>Location:</span>
                    <span>{dorm.address}</span>
                  </div>
                  <div className="comparison-row">
                    <span>Facilities:</span>
                    <span>{dorm.facilities?.length || 0} amenities</span>
                  </div>
                  <div className="comparison-row">
                    <span>Status:</span>
                    <span>{dorm.status}</span>
                  </div>
                  <Button
                    fullWidth
                    onClick={() => toggleSelect(dorm.id)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
