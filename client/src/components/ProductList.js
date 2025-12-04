import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getProductImages,
  getProductPrimaryImageUrl,
} from "../utils/productUtils";
import "./ProductList.css";

const ProductList = ({ products, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (productId, e) => {
    if (e.target.closest(".product-actions")) {
      return;
    }
    navigate(`/product/${productId}`);
  };

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos registrados</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const images = getProductImages(product);
            const primaryImageUrl = getProductPrimaryImageUrl(product);

            return (
              <div
                key={product.Id}
                className="product-card"
                onClick={(e) => handleCardClick(product.Id, e)}
              >
                <div className="product-image">
                  {primaryImageUrl ? (
                    <div className="product-image-container">
                      <img src={primaryImageUrl} alt={product.Name} />
                      {images.length > 1 && (
                        <div className="image-count-badge">
                          {images.length} imágenes
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-image">Sin imagen</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.Name}</h3>
                  <p className="product-description">
                    {product.Description || "Sin descripción"}
                  </p>
                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">SKU:</span>
                      <span>{product.SKU}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Precio:</span>
                      <span className="price">
                        Q{parseFloat(product.Price).toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Inventario:</span>
                      <span
                        className={
                          product.Inventory > 5
                            ? "inventory-ok"
                            : "inventory-low"
                        }
                      >
                        {product.Inventory}
                      </span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => onEdit(product)}
                    >
                      <FaEdit className="action-icon" />
                      <span>Editar</span>
                    </button>
                    {onDelete && (
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(product.Id)}
                      >
                        <FaTrash className="action-icon" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
