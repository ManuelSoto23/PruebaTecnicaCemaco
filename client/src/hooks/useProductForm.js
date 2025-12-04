import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { API_BASE_URL } from "../constants/config";
import { buildImageUrl } from "../utils/productUtils";
import { productSchema } from "../utils/productValidation";

export const useProductForm = (product, onSuccess) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    inventory: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.Name || "",
        description: product.Description || "",
        price: product.Price || "",
        sku: product.SKU || "",
        inventory: product.Inventory || "",
      });

      if (product.Images && product.Images.length > 0) {
        const images = product.Images.map((img) =>
          buildImageUrl(img, API_BASE_URL)
        );
        setExistingImages(images.filter(Boolean));
      } else if (product.Image) {
        const img = buildImageUrl(product.Image, API_BASE_URL);
        setExistingImages(img ? [img] : []);
      } else {
        setExistingImages([]);
      }
    } else {
      setExistingImages([]);
    }
    setNewImages([]);
  }, [product]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const handleImagesChange = useCallback(
    (files) => {
      setNewImages(files);
      if (validationErrors.images) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const removeExistingImage = useCallback(
    (index) => {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      const remainingImages = existingImages.filter((_, i) => i !== index);
      if (
        remainingImages.length + newImages.length > 0 &&
        validationErrors.images
      ) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    },
    [existingImages, newImages, validationErrors]
  );

  const removeNewImage = useCallback(
    (index) => {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
      const remainingNewImages = newImages.filter((_, i) => i !== index);
      if (
        existingImages.length + remainingNewImages.length > 0 &&
        validationErrors.images
      ) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    },
    [existingImages, newImages, validationErrors]
  );

  const handleReorderImages = useCallback(
    (dragGlobalIndex, dropGlobalIndex) => {
      const allImages = [
        ...existingImages.map((img, idx) => ({
          type: "existing",
          index: idx,
          data: img,
        })),
        ...newImages.map((file, idx) => ({
          type: "new",
          index: idx,
          data: file,
        })),
      ];

      const [removed] = allImages.splice(dragGlobalIndex, 1);
      allImages.splice(dropGlobalIndex, 0, removed);

      const newExistingImages = [];
      const newNewImages = [];

      allImages.forEach((item) => {
        if (item.type === "existing") {
          newExistingImages.push(item.data);
        } else {
          newNewImages.push(item.data);
        }
      });

      setExistingImages(newExistingImages);
      setNewImages(newNewImages);
    },
    [existingImages, newImages]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setValidationErrors({});
      setLoading(true);

      try {
        const dataToValidate = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: formData.price ? parseFloat(formData.price) : "",
          sku: formData.sku.trim(),
          inventory: formData.inventory ? parseInt(formData.inventory, 10) : "",
        };

        await productSchema.validate(dataToValidate, { abortEarly: false });

        const totalImages = existingImages.length + newImages.length;
        if (totalImages === 0) {
          setValidationErrors({ images: "Debe subir al menos una imagen" });
          setLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("sku", formData.sku);
        formDataToSend.append("inventory", formData.inventory);

        newImages.forEach((file) => {
          formDataToSend.append("images", file);
        });

        const imageOrder = [
          ...existingImages.map((img) => {
            const path = img.startsWith("http")
              ? img.replace(API_BASE_URL, "")
              : img;
            return path;
          }),
          ...newImages.map(() => "NEW"),
        ];
        formDataToSend.append("imageOrder", JSON.stringify(imageOrder));

        if (product) {
          const originalImages =
            product.Images || (product.Image ? [product.Image] : []);
          const imagesToDelete = originalImages.filter((img) => {
            const fullPath = img.startsWith("http")
              ? img.replace(API_BASE_URL, "")
              : img;
            return !existingImages.some((existing) =>
              existing.includes(fullPath)
            );
          });

          imagesToDelete.forEach((img) => {
            const path = img.startsWith("http")
              ? img.replace(API_BASE_URL, "")
              : img;
            formDataToSend.append("deleteImages", path);
          });
        }

        if (product) {
          await api.put(`/products/${product.Id}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post("/products", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        onSuccess();
      } catch (err) {
        if (err.inner) {
          const errors = {};
          err.inner.forEach((error) => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });
          setValidationErrors(errors);
        } else {
          setError(
            err.response?.data?.message || "Error al guardar el producto"
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, existingImages, newImages, product, onSuccess]
  );

  return {
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
  };
};
