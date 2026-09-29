import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation, Footer } from './components';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { LoginPage } from './pages/LoginPage';
import { ManageListingsPage } from './pages/ManageListingsPage';
import { CompareListingsPage } from './pages/CompareListingsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FindRoommatePage } from './pages/FindRoommatePage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { useAuthStore } from './store/auth';
import './styles/globals.css';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/dorms/:id" element={<ListingDetailPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/manage"
              element={
                <ProtectedRoute>
                  <ManageListingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <CompareListingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="/find-roommate" element={<FindRoommatePage />} />
            <Route path="/roommates" element={<FindRoommatePage />} />
            <Route path="/owner" element={<OwnerDashboardPage />} />
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
