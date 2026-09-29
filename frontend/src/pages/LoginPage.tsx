import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, CardBody, Spinner } from '../components';
import { useAuthStore } from '../store/auth';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [registerRole, setRegisterRole] = useState('student'); // 'student' or 'owner'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In dev mode, we accept any UUID-like string
      // For demo, generate a UUID from email
      const userId = `user-${loginEmail.replace(/[@.]/g, '-')}`;

      login(userId, 'demo-token');
      navigate('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerPassword !== registerPasswordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // In dev mode, generate a demo user ID
      const userId = `user-${registerEmail.replace(/[@.]/g, '-')}`;

      login(userId, 'demo-token');
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <h1>Welcome to DormHunt</h1>
          <p>Find your perfect student home or list your property</p>
        </div>

        <Card variant="elevated">
          <CardBody>
            {/* Tab Switcher */}
            <div className="auth-tabs">
              <button
                className={`auth-tabs__button ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                className={`auth-tabs__button ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="auth-error">{error}</div>}

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="auth-form">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="student@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Sign In'}
                </Button>

                <div className="auth-demo">
                  <p>Demo Mode: Use any email/password to login instantly</p>
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="auth-form">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="student@university.edu"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />

                <div className="auth-role">
                  <label>I am a...</label>
                  <div className="auth-role__options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="student"
                        checked={registerRole === 'student'}
                        onChange={(e) => setRegisterRole(e.target.value)}
                      />
                      <span>Student Searching</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="owner"
                        checked={registerRole === 'owner'}
                        onChange={(e) => setRegisterRole(e.target.value)}
                      />
                      <span>Property Owner</span>
                    </label>
                  </div>
                </div>

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPasswordConfirm}
                  onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Create Account'}
                </Button>

                <div className="auth-demo">
                  <p>Demo Mode: Use any email/password to register instantly</p>
                </div>
              </form>
            )}
          </CardBody>
        </Card>

        <div className="login-page__footer">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>

      <div className="login-page__illustration">
        <div className="illustration-content">
          <div className="illustration-emoji">🏠</div>
          <h2>Welcome Home</h2>
          <p>
            {isLogin
              ? 'Sign in to explore and manage your listings'
              : 'Join our community of students and property owners'}
          </p>
        </div>
      </div>
    </div>
  );
};
