import React from "react";
import { useProductForm } from "../hooks/useProductForm";
import ProductFormFields from "./ProductFormFields";
import ImageDropBox from "./ImageDropBox";
import "./ProductForm.css";

const ProductForm = ({ product, onClose, onSuccess }) => {
  const {
    formData,
    existingImages,
    newImages,
    loading,
    error,
    validationErrors,
    handleChange,
    handleImagesChange,
    removeExistingImage,
    removeNewImage,
    handleReorderImages,
    handleSubmit,
  } = useProductForm(product, onSuccess);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{product ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <ProductFormFields
            formData={formData}
            handleChange={handleChange}
            validationErrors={validationErrors}
          />

          <div className="form-group">
            <label htmlFor="images">Imágenes *</label>
            <ImageDropBox
              existingImages={existingImages}
              newImages={newImages}
              onImagesChange={handleImagesChange}
              onRemoveExisting={removeExistingImage}
              onRemoveNew={removeNewImage}
              onReorderImages={handleReorderImages}
              error={validationErrors.images}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
