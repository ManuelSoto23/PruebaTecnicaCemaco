import { useState, useCallback } from "react";
import api from "../services/api";
import { useErrorHandler } from "./useErrorHandler";
import { PAGINATION } from "../constants/config";

export const useProducts = (isAdmin = false) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const { error, handleError, clearError } = useErrorHandler();

  const fetchProducts = useCallback(
    async (pageToLoad = 1, size = pageSize, search = "") => {
      setLoading(true);
      clearError();

      try {
        const endpoint = isAdmin ? "/products" : "/public/products";
        const response = await api.get(endpoint, {
          params: {
            page: pageToLoad,
            pageSize: size,
            q: search || undefined,
          },
        });

        const data = response.data;

        if (Array.isArray(data)) {
          setProducts(data);
          setPage(1);
          setTotalPages(1);
        } else {
          setProducts(data.items || []);
          setPage(data.page || pageToLoad);
          setTotalPages(data.totalPages || 1);
        }

        setPageSize(size);
      } catch (err) {
        handleError(err, "Error al cargar productos");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, pageSize, handleError, clearError]
  );

  const deleteProduct = useCallback(
    async (productId) => {
      try {
        await api.delete(`/products/${productId}`);
        return true;
      } catch (err) {
        handleError(err, "Error al eliminar el producto");
        return false;
      }
    },
    [handleError]
  );

  const fetchProductById = useCallback(
    async (productId) => {
      setLoading(true);
      clearError();

      try {
        try {
          const response = await api.get(`/public/products/${productId}`);
          return response.data;
        } catch (publicError) {
          const response = await api.get(`/products/${productId}`);
          return response.data;
        }
      } catch (err) {
        handleError(err, "Error al cargar el producto");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError, clearError]
  );

  const changePageSize = useCallback(
    (newSize) => {
      fetchProducts(1, newSize);
    },
    [fetchProducts]
  );

  return {
    products,
    loading,
    error,
    page,
    totalPages,
    pageSize,
    fetchProducts,
    deleteProduct,
    fetchProductById,
    changePageSize,
    clearError,
  };
};
