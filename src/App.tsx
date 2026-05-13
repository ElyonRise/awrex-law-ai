import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import TriageChat from './pages/TriageChat';
import Pricing from './pages/Pricing';
import Navbar from './components/layout/Navbar';

import Discovery from './pages/Discovery';
import LawyerProfile from './pages/LawyerProfile';
import TriageManager from './pages/TriageManager';
import CaseDetail from './pages/CaseDetail';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage type="login" />} />
              <Route path="/register" element={<AuthPage type="register" />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/triage" element={<TriageChat />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/profile/:id" element={<LawyerProfile />} />
              <Route path="/case/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
              <Route 
                path="/triage-manager" 
                element={
                  <ProtectedRoute role="ADVOGADO">
                    <TriageManager />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <footer className="py-12 px-6 border-t border-white/5 bg-obsidian text-center text-sm text-slate-500">
            <p className="max-w-2xl mx-auto">
              Aurex Law é uma infraestrutura tecnológica administrativa. 
              Não presta serviços jurídicos ou intermediação. Todos os direitos reservados.
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
