import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Badge, Spinner, Modal, Input } from '../components';
import { dormService } from '../api/services/dorms';
import type { Dorm } from '../api/services/dorms';
import { useAuthStore } from '../store/auth';
import './ManageListingsPage.css';

export const ManageListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuthStore();
  const [listings, setListings] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    address: '',
    facilities: [] as string[],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchListings();
  }, [isAuthenticated]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const allDorms = await dormService.listApproved();
      setListings(allDorms || []);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    try {
      await dormService.create({
        ...formData,
        seller_id: userId || 'unknown',
        images: [],
        latitude: 0,
        longitude: 0,
        status: 'pending',
      });
      setShowCreateModal(false);
      setFormData({ title: '', description: '', price: 0, address: '', facilities: [] });
      alert('Listing created!');
      fetchListings();
    } catch (err) {
      alert('Failed to create listing');
    }
  };

  return (
    <div className="manage-listings-page">
      <div className="manage-listings-page__header">
        <h1>Manage Your Listings</h1>
        <Button onClick={() => setShowCreateModal(true)} variant="primary">+ New Listing</Button>
      </div>

      {loading ? (
        <div className="manage-listings__loading"><Spinner size="lg" /></div>
      ) : listings.length === 0 ? (
        <Card variant="outlined"><CardBody><p>No listings yet</p></CardBody></Card>
      ) : (
        <div className="listings-table">
          {listings.map((listing) => (
            <Card key={listing.id} variant="elevated">
              <CardBody>
                <h3>{listing.title}</h3>
                <p>{listing.address}</p>
                <p>Rp {listing.price.toLocaleString('id-ID')}</p>
                <Badge variant={listing.status === 'approved' ? 'success' : 'warning'}>{listing.status}</Badge>
                <Button variant="outline" size="sm">Edit</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <Modal isOpen={showCreateModal} size="md" onClose={() => setShowCreateModal(false)}>
          <div className="create-modal">
            <h2>Create New Listing</h2>
            <Input label="Property Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <Input label="Price (Rp/month)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
            <Input label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            <div className="modal-actions">
              <Button onClick={() => setShowCreateModal(false)} variant="outline">Cancel</Button>
              <Button onClick={handleCreateListing} variant="primary">Create</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
