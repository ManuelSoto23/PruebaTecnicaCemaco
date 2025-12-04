import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AdminProducts from './pages/AdminProducts';
import PublicProducts from './pages/PublicProducts';
import ProductDetail from './pages/ProductDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PublicProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/admin/products"
            element={
              <PrivateRoute>
                <AdminProducts />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;



