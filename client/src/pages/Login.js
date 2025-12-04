import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSignInAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/admin/products');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-title-container">
            <img 
              src="/assets/logo-icono.ico" 
              alt="Cemaco" 
              className="login-icon"
            />
            <h1 className="login-title">Cemaco</h1>
          </div>
          <h2>Iniciar Sesión</h2>
          <p className="login-subtitle">Ingresa tus credenciales para acceder</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Ingresa tu usuario"
              className={error ? 'input-error' : ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              className={error ? 'input-error' : ''}
            />
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            className="btn btn-primary login-button" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              <span className="login-button-content">
                <FaSignInAlt className="login-button-icon" />
                <span>Iniciar Sesión</span>
              </span>
            )}
          </button>
        </form>
        <div className="login-footer">
                 <div className="credentials-info">
                   <p className="credentials-title">Usuarios de prueba:</p>
                   <div className="credentials-list">
                     <div className="credential-item">
                       <span className="credential-role">Administrador:</span>
                       <span className="credential-value">admin / admin123</span>
                     </div>
                     <div className="credential-item">
                       <span className="credential-role">Colaborador:</span>
                       <span className="credential-value">colaborador / colaborador123</span>
                     </div>
                   </div>
                 </div>
                 <Link to="/" className="back-link">
                   <FaArrowLeft className="back-link-icon" />
                   <span>Volver al inicio</span>
                 </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


