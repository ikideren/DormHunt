import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardBody, Badge, Spinner } from '../components';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import './FindRoommatePage.css';

interface RoommateProfile {
  id: string;
  name: string;
  university: string;
  bio: string;
  budget: number;
  moveInDate: string;
  preferences: string[];
  avatar: string;
}

export const FindRoommatePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBudget, setFilterBudget] = useState(10000000);
  const [filterUniversity, setFilterUniversity] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfiles();
  }, [isAuthenticated]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const mockProfiles: RoommateProfile[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          university: 'University of Indonesia',
          bio: 'Friendly and organized, love cooking',
          budget: 2000000,
          moveInDate: '2026-06-01',
          preferences: ['Quiet', 'Non-smoker', 'Female'],
          avatar: '👩‍🎓',
        },
        {
          id: '2',
          name: 'Ahmad Reza',
          university: 'ITB',
          bio: 'Engineering student, tech enthusiast',
          budget: 2500000,
          moveInDate: '2026-07-01',
          preferences: ['Quiet', 'Student', 'Male'],
          avatar: '👨‍💻',
        },
      ];
      setProfiles(mockProfiles);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = profiles.filter((p) => {
    const budgetMatch = p.budget <= filterBudget;
    const universityMatch = !filterUniversity || p.university.toLowerCase().includes(filterUniversity.toLowerCase());
    return budgetMatch && universityMatch;
  });

  return (
    <div className="roommate-page">
      <div className="roommate-page__header">
        <h1>Find Your Perfect Roommate</h1>
        <p>Connect with students looking for shared accommodations</p>
      </div>
      <div className="roommate-page__content">
        <aside className="roommate-filters">
          <Card variant="outlined">
            <CardBody>
              <h3>Filters</h3>
              <div className="filter-group">
                <label>Budget (max)</label>
                <Input type="number" value={filterBudget} onChange={(e) => setFilterBudget(Number(e.target.value))} />
                <span className="filter-value">Rp {filterBudget.toLocaleString('id-ID')}</span>
              </div>
              <div className="filter-group">
                <label>University</label>
                <Input type="text" placeholder="Search university..." value={filterUniversity} onChange={(e) => setFilterUniversity(e.target.value)} />
              </div>
            </CardBody>
          </Card>
        </aside>
        <div className="roommate-profiles">
          {loading ? (
            <div className="roommate-loading"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <Card variant="outlined"><CardBody><p className="no-results">No profiles match your criteria</p></CardBody></Card>
          ) : (
            <div className="profiles-grid">
              {filtered.map((profile) => (
                <Card key={profile.id} variant="elevated">
                  <CardBody>
                    <div className="profile-header">
                      <div className="profile-avatar">{profile.avatar}</div>
                      <div>
                        <h3>{profile.name}</h3>
                        <p className="profile-university">{profile.university}</p>
                      </div>
                    </div>
                    <p className="profile-bio">{profile.bio}</p>
                    <div className="profile-info">
                      <div className="info-row"><span>Budget:</span><strong>Rp {profile.budget.toLocaleString('id-ID')}/mo</strong></div>
                      <div className="info-row"><span>Move-in:</span><span>{new Date(profile.moveInDate).toLocaleDateString()}</span></div>
                    </div>
                    <div className="profile-preferences">
                      {profile.preferences.map((pref) => (
                        <Badge key={pref} variant="primary" size="sm">{pref}</Badge>
                      ))}
                    </div>
                    <Button fullWidth variant="primary" size="md">💬 Connect</Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
