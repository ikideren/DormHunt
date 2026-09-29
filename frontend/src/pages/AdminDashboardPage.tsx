import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Badge, Spinner, Modal } from '../components';
import { useNavigate } from 'react-router-dom';
import './AdminDashboardPage.css';

interface Report {
  id: string;
  reportedItem: string;
  reason: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalListings: 0, pendingApprovals: 0, totalUsers: 0 });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check admin access (simplified)
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data
      setStats({
        totalListings: 128,
        pendingApprovals: 12,
        totalUsers: 450,
      });
      setReports([
        {
          id: '1',
          reportedItem: 'Listing #456',
          reason: 'Spam/Inappropriate content',
          status: 'open',
          createdAt: '2024-01-10',
        },
        {
          id: '2',
          reportedItem: 'User Profile #123',
          reason: 'Suspicious activity',
          status: 'resolved',
          createdAt: '2024-01-09',
        },
        {
          id: '3',
          reportedItem: 'Listing #789',
          reason: 'Pricing issue',
          status: 'open',
          createdAt: '2024-01-11',
        },
      ]);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = () => {
    if (selectedReport) {
      const updated = reports.map((r) =>
        r.id === selectedReport.id ? { ...r, status: 'resolved' as const } : r
      );
      setReports(updated);
      setShowModal(false);
      setSelectedReport(null);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>Admin Dashboard</h1>
        <p>Manage platform, moderate content, and handle reports</p>
      </div>

      {loading ? (
        <div className="admin-loading">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="admin-stats">
            <Card variant="elevated">
              <CardBody>
                <div className="stat-item">
                  <div className="stat-value">{stats.totalListings}</div>
                  <div className="stat-label">Total Listings</div>
                </div>
              </CardBody>
            </Card>
            <Card variant="elevated">
              <CardBody>
                <div className="stat-item">
                  <div className="stat-value">{stats.pendingApprovals}</div>
                  <div className="stat-label">Pending Approvals</div>
                </div>
              </CardBody>
            </Card>
            <Card variant="elevated">
              <CardBody>
                <div className="stat-item">
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Reports Section */}
          <div className="admin-section">
            <h2>User Reports ({reports.filter((r) => r.status === 'open').length} Open)</h2>
            <div className="reports-list">
              {reports.map((report) => (
                <Card key={report.id} variant="outlined">
                  <CardBody>
                    <div className="report-row">
                      <div className="report-info">
                        <h3>{report.reportedItem}</h3>
                        <p>{report.reason}</p>
                        <span className="report-date">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="report-status">
                        <Badge
                          variant={report.status === 'open' ? 'error' : 'success'}
                        >
                          {report.status}
                        </Badge>
                        {report.status === 'open' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setSelectedReport(report);
                              setShowModal(true);
                            }}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Modal */}
          {showModal && selectedReport && (
            <Modal isOpen={showModal} size="md" onClose={() => setShowModal(false)}>
              <div className="report-modal">
                <h2>Review Report</h2>
                <div className="report-details">
                  <p>
                    <strong>Reported Item:</strong> {selectedReport.reportedItem}
                  </p>
                  <p>
                    <strong>Reason:</strong> {selectedReport.reason}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="modal-actions">
                  <Button onClick={() => setShowModal(false)} variant="outline">
                    Keep Investigating
                  </Button>
                  <Button onClick={handleResolveReport} variant="success">
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};
