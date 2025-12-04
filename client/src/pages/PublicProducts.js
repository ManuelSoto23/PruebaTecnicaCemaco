import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { useProducts } from "../hooks/useProducts";
import { usePagination } from "../hooks/usePagination";
import {
  getProductImages,
  getProductPrimaryImageUrl,
} from "../utils/productUtils";
import { PAGINATION } from "../constants/config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PublicProducts.css";

const PublicProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    products,
    loading,
    error,
    page,
    totalPages,
    pageSize,
    fetchProducts,
    changePageSize,
  } = useProducts(false);

  const {
    getPageNumbers,
    hasPreviousPage,
    hasNextPage,
    isFirstPage,
    isLastPage,
  } = usePagination(page, totalPages);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchTerm(q);
    fetchProducts(1, pageSize, q);
  }, [location.search, pageSize, fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    fetchProducts(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    changePageSize(newSize);
  };

  return (
    <div className="public-products">
      <Header />
      <main className="products-main">
        <div className="products-container">
          <h1 className="products-title">Nuestros Productos</h1>
          {searchTerm && (
            <p className="search-results-text">
              Mostrando resultados para: <strong>{searchTerm}</strong>
            </p>
          )}
          {loading ? (
            <div className="loading">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No hay productos disponibles en este momento</p>
            </div>
          ) : (
            <>
              <div className="pagination-controls-top">
                <label className="page-size-selector">
                  Items por página:
                  <select value={pageSize} onChange={handlePageSizeChange}>
                    {PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="products-grid">
                {products.map((product) => {
                  const images = getProductImages(product);
                  const primaryImageUrl = getProductPrimaryImageUrl(product);

                  return (
                    <div
                      key={product.Id}
                      className="product-card-public"
                      onClick={() => navigate(`/product/${product.Id}`)}
                    >
                      <div className="product-image-public">
                        {primaryImageUrl ? (
                          <div className="product-image-container-public">
                            <img src={primaryImageUrl} alt={product.Name} />
                            {images.length > 1 && (
                              <div className="image-count-badge-public">
                                {images.length} imágenes
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="no-image-public">Sin imagen</div>
                        )}
                      </div>
                      <div className="product-info-public">
                        <h3>{product.Name}</h3>
                        <p className="product-description-public">
                          {product.Description || "Sin descripción"}
                        </p>
                        <div className="product-price-public">
                          Q{parseFloat(product.Price).toFixed(2)}
                        </div>
                        <div className="product-sku-public">
                          SKU: {product.SKU}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="pagination products-pagination">
                  <button
                    className="btn btn-secondary pagination-btn"
                    onClick={() => handlePageChange(1)}
                    disabled={isFirstPage}
                  >
                    <FaAngleDoubleLeft />
                  </button>
                  <button
                    className="btn btn-secondary pagination-btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPreviousPage}
                  >
                    <FaAngleLeft />
                  </button>
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`btn pagination-btn ${
                        pageNum === page ? "btn-primary" : "btn-secondary"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    className="btn btn-secondary pagination-btn"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNextPage}
                  >
                    <FaAngleRight />
                  </button>
                  <button
                    className="btn btn-secondary pagination-btn"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={isLastPage}
                  >
                    <FaAngleDoubleRight />
                  </button>
                  <span className="pagination-info">
                    Página {page} de {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicProducts;
