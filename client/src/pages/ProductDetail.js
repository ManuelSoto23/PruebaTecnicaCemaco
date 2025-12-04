import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useProducts } from "../hooks/useProducts";
import { getProductImageUrls } from "../utils/productUtils";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { loading, error, fetchProductById } = useProducts(false);

  useEffect(() => {
    const loadProduct = async () => {
      const productData = await fetchProductById(id);
      setProduct(productData);
    };
    loadProduct();
  }, [id, fetchProductById]);

  const displayImages = product ? getProductImageUrls(product) : [];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setLightboxIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const handleKeyDown = (e) => {
    if (!lightboxOpen) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="loading-container">
          <div className="loading">Cargando producto...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="error-container">
          <p>{error || "Producto no encontrado"}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft style={{ marginRight: 8 }} />
            <span>Volver</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Header />
      <main className="product-detail-main">
        <div className="product-detail-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft className="back-button-icon" />
            <span>Volver</span>
          </button>

          <div className="product-detail-content">
            <div className="product-images-section">
              {displayImages.length > 0 ? (
                <>
                  <div
                    className="main-image"
                    onClick={() => openLightbox(selectedImageIndex)}
                  >
                    <img
                      src={displayImages[selectedImageIndex]}
                      alt={product.Name}
                    />
                    <div className="image-zoom-hint">
                      <span>🔍 Click para ampliar</span>
                    </div>
                  </div>
                  {displayImages.length > 1 && (
                    <div className="thumbnail-images">
                      {displayImages.map((img, index) => (
                        <div
                          key={index}
                          className={`thumbnail ${
                            selectedImageIndex === index ? "active" : ""
                          }`}
                          onClick={() => {
                            setSelectedImageIndex(index);
                          }}
                        >
                          <img src={img} alt={`${product.Name} ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image-large">
                  <span>Sin imagen</span>
                </div>
              )}
            </div>

            {lightboxOpen && displayImages.length > 0 && (
              <div className="lightbox-overlay" onClick={closeLightbox}>
                <button className="lightbox-close" onClick={closeLightbox}>
                  ×
                </button>
                {displayImages.length > 1 && (
                  <>
                    <button
                      className="lightbox-nav lightbox-prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className="lightbox-nav lightbox-next"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    >
                      ›
                    </button>
                  </>
                )}
                <div
                  className="lightbox-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={displayImages[lightboxIndex]}
                    alt={`${product.Name} - Imagen ${lightboxIndex + 1}`}
                  />
                  {displayImages.length > 1 && (
                    <div className="lightbox-counter">
                      {lightboxIndex + 1} / {displayImages.length}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="product-info-section">
              <h1 className="product-title">{product.Name}</h1>

              <div className="product-price-large">
                Q{parseFloat(product.Price).toFixed(2)}
              </div>

              <div className="product-details-grid">
                <div className="detail-item">
                  <span className="detail-label">SKU:</span>
                  <span className="detail-value">{product.SKU}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Inventario:</span>
                  <span
                    className={`detail-value inventory ${
                      product.Inventory > 5 ? "inventory-ok" : "inventory-low"
                    }`}
                  >
                    {product.Inventory} unidades
                  </span>
                </div>
              </div>

              {product.Description && (
                <div className="product-description-section">
                  <h3>Descripción</h3>
                  <p>{product.Description}</p>
                </div>
              )}

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Creado:</span>
                  <span className="meta-value">
                    {new Date(product.CreatedAt).toLocaleDateString("es-GT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {product.UpdatedAt &&
                  product.UpdatedAt !== product.CreatedAt && (
                    <div className="meta-item">
                      <span className="meta-label">Actualizado:</span>
                      <span className="meta-value">
                        {new Date(product.UpdatedAt).toLocaleDateString(
                          "es-GT",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
