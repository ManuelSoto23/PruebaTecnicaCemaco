import React from "react";

const ProductFormFields = ({ formData, handleChange, validationErrors }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="name">Nombre *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={validationErrors.name ? "input-error" : ""}
        />
        {validationErrors.name && (
          <span className="field-error">{validationErrors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={validationErrors.description ? "input-error" : ""}
        />
        {validationErrors.description && (
          <span className="field-error">{validationErrors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Precio *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={validationErrors.price ? "input-error" : ""}
          />
          {validationErrors.price && (
            <span className="field-error">{validationErrors.price}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="sku">SKU *</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={validationErrors.sku ? "input-error" : ""}
          />
          {validationErrors.sku && (
            <span className="field-error">{validationErrors.sku}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="inventory">Inventario *</label>
          <input
            type="number"
            id="inventory"
            name="inventory"
            value={formData.inventory}
            onChange={handleChange}
            min="0"
            className={validationErrors.inventory ? "input-error" : ""}
          />
          {validationErrors.inventory && (
            <span className="field-error">{validationErrors.inventory}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductFormFields;
