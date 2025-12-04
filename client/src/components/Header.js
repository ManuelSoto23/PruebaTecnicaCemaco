import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaSearch, FaSignInAlt } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchTerm(q);
  }, [location.search]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();

    const isAdminRoute = location.pathname.startsWith("/admin") && user;
    const basePath = isAdminRoute ? "/admin/products" : "/";

    const searchUrl = query
      ? `${basePath}?q=${encodeURIComponent(query)}`
      : basePath;

    navigate(searchUrl);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img
            src="/assets/cemaco-logo.png"
            alt="Cemaco"
            className="logo-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <h1 className="logo-text">Cemaco</h1>
        </Link>
        <div className="header-search">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar productos por nombre o SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              <FaSearch />
            </button>
          </form>
        </div>
        <nav className="nav">
          {user ? (
            <>
              <Link to="/admin/products" className="nav-link">
                Productos
              </Link>
              <span className="user-info">
                {user.username} ({user.role})
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary header-login-btn">
              <span className="header-login-content">
                <FaSignInAlt className="header-login-icon" />
                <span>Iniciar Sesión</span>
              </span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
