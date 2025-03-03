import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SwiftMT103Form from './components/SwiftMT103Form';
import Print from './components/Print';
import TestPDF from './components/TestPDF';
import { TransactionProvider } from './context/transactionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PinLogin from './components/PinLogin';

function AppContent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...'); // Debug log
    localStorage.removeItem('isAuthenticated');
    navigate('/login', { replace: true });
  };

  const handleLogin = () => {
    console.log('Login successful, setting auth state...'); // Debug log
    localStorage.setItem('isAuthenticated', 'true');
    console.log('Auth state set, navigating to dashboard...'); // Debug log
    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 0);
  };

  return (
    <div className="app">
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<PinLogin onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navbar onLogout={handleLogout} />
                <main className="main-content">
                  <Routes>
                    <Route path="/mt103" element={<SwiftMT103Form />} />
                    <Route path="/" element={<Navigate to="/mt103" replace />} />
                    <Route path="/dashboard" element={
                      <div className="content-container">
                        <SwiftMT103Form />
                      </div>
                    } />
                    <Route path="/print" element={
                      <div className="content-container">
                        <Print />
                      </div>
                    } />
                    <Route path="/test-pdf" element={
                      <div className="content-container">
                        <TestPDF />
                      </div>
                    } />
                    <Route path="/mt199" element={<div>MT199 Form (Coming Soon)</div>} />
                    <Route path="/mt103gpi" element={<div>MT103 GPI Form (Coming Soon)</div>} />
                    <Route path="/ledger" element={<div>Ledger to Ledger Form (Coming Soon)</div>} />
                    <Route path="/dropbox" element={<div>DropBox Form (Coming Soon)</div>} />
                    <Route path="/mt103202" element={<div>MT103/202 Form (Coming Soon)</div>} />
                  </Routes>
                </main>
                <Footer />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <TransactionProvider>
      <Router>
        <AppContent />
      </Router>
    </TransactionProvider>
  );
}

export default App;
