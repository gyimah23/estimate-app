
import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleLogin = (email: string, password: string) => {
    // For demo purposes, we'll accept any email/password
    setUser({ email });
    setIsAuthenticated(true);
    console.log('Logged in:', email);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    console.log('Logged out');
  };

  if (!isAuthenticated) {
    return <AuthLayout onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
};

export default Index;
