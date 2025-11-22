import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LoginPage from './routes/LoginPage.jsx';
// import SignupPage from './routes/SignupPage.jsx';
import SignupPage from './routes/SignUpPage.jsx';
import StoresPage from './routes/StorePage.jsx';
import AdminDashboard from './routes/AdminDashboard.jsx';
import OwnerDashboard from './routes/OwnerDashboard.jsx';

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/stores"
          element={
            <PrivateRoute roles={['normal_user', 'admin', 'store_owner']}>
              <StoresPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner"
          element={
            <PrivateRoute roles={['store_owner']}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
