import React, { useState, useRef, useEffect } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import "./ImageDropBox.css";

const ImageDropBox = ({
  existingImages = [],
  newImages = [],
  onImagesChange,
  onRemoveExisting,
  onRemoveNew,
  onReorderImages,
  error = null,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const newPreviews = newImages
      .map((file) => {
        if (file instanceof File) {
          return URL.createObjectURL(file);
        }
        return null;
      })
      .filter(Boolean);

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const allNewImages = [...newImages, ...files];
    onImagesChange(allNewImages);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Maneja el inicio del arrastre de una imagen
   * @param {DragEvent} e - Evento de arrastre
   * @param {number} index - Índice de la imagen en su lista (existente o nueva)
   * @param {boolean} isExisting - Indica si es una imagen existente o nueva
   */
  const handleImageDragStart = (e, index, isExisting) => {
    setDraggedIndex({ index, isExisting });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  /**
   * Maneja el evento cuando se arrastra sobre una imagen
   * Calcula el índice global para el feedback visual
   * @param {DragEvent} e - Evento de arrastre
   * @param {number} index - Índice de la imagen en su lista
   * @param {boolean} isExisting - Indica si es una imagen existente o nueva
   */
  const handleImageDragOver = (e, index, isExisting) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    const globalIndex = isExisting ? index : existingImages.length + index;
    setDragOverIndex({ index, isExisting, globalIndex });
  };

  const handleImageDragLeave = () => {
    setDragOverIndex(null);
  };

  /**
   * Maneja el evento cuando se suelta una imagen
   * Calcula los índices globales y reordena si es necesario
   * @param {DragEvent} e - Evento de soltar
   * @param {number} dropIndex - Índice donde se suelta la imagen
   * @param {boolean} dropIsExisting - Indica si se suelta sobre una imagen existente
   */
  const handleImageDrop = (e, dropIndex, dropIsExisting) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedIndex) return;

    const { index: dragIndex, isExisting: dragIsExisting } = draggedIndex;

    const dragGlobalIndex = dragIsExisting
      ? dragIndex
      : existingImages.length + dragIndex;
    const dropGlobalIndex = dropIsExisting
      ? dropIndex
      : existingImages.length + dropIndex;

    if (dragGlobalIndex !== dropGlobalIndex) {
      if (onReorderImages) {
        onReorderImages(dragGlobalIndex, dropGlobalIndex);
      }
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const allImages = [...existingImages, ...previews];

  return (
    <div className="image-dropbox-container">
      <div
        className={`image-dropbox ${isDragging ? "dragging" : ""} ${
          error ? "has-error" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <div className="dropbox-content">
          <FaCloudUploadAlt className="dropbox-icon" />
          <p className="dropbox-text">
            {isDragging
              ? "Suelta las imágenes aquí"
              : "Arrastra imágenes aquí o haz clic para seleccionar"}
          </p>
          <p className="dropbox-hint">
            Puedes subir múltiples imágenes (mínimo 1 requerida)
          </p>
        </div>
      </div>

      {error && <span className="field-error">{error}</span>}

      {allImages.length > 0 && (
        <div className="images-preview">
          {existingImages.map((img, index) => {
            const globalIndex = index;
            const isDragging =
              draggedIndex?.index === index && draggedIndex?.isExisting;
            const isDragOver = dragOverIndex?.globalIndex === globalIndex;
            return (
              <div
                key={`existing-${index}`}
                className={`image-preview-item ${
                  isDragging ? "dragging" : ""
                } ${isDragOver ? "drag-over" : ""}`}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index, true)}
                onDragOver={(e) => handleImageDragOver(e, index, true)}
                onDragLeave={handleImageDragLeave}
                onDrop={(e) => handleImageDrop(e, index, true)}
              >
                <img src={img} alt={`Preview ${index + 1}`} draggable={false} />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveExisting(index);
                  }}
                  title="Eliminar imagen"
                >
                  <FaTimes />
                </button>
                {index === 0 && (
                  <div className="primary-badge" title="Imagen principal">
                    Principal
                  </div>
                )}
              </div>
            );
          })}
          {previews.map((preview, index) => {
            const globalIndex = existingImages.length + index;
            const isDragging =
              draggedIndex?.index === index && !draggedIndex?.isExisting;
            const isDragOver = dragOverIndex?.globalIndex === globalIndex;
            return (
              <div
                key={`new-${index}`}
                className={`image-preview-item ${
                  isDragging ? "dragging" : ""
                } ${isDragOver ? "drag-over" : ""}`}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index, false)}
                onDragOver={(e) => handleImageDragOver(e, index, false)}
                onDragLeave={handleImageDragLeave}
                onDrop={(e) => handleImageDrop(e, index, false)}
              >
                <img
                  src={preview}
                  alt={`New preview ${index + 1}`}
                  draggable={false}
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveNew(index);
                  }}
                  title="Eliminar imagen"
                >
                  <FaTimes />
                </button>
                {existingImages.length === 0 && index === 0 && (
                  <div className="primary-badge" title="Imagen principal">
                    Principal
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageDropBox;
