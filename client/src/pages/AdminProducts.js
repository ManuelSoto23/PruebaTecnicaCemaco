import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPlus,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { usePagination } from "../hooks/usePagination";
import { PAGINATION } from "../constants/config";
import Header from "../components/Header";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import "./AdminProducts.css";

const AdminProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const {
    products,
    loading,
    page,
    totalPages,
    pageSize,
    fetchProducts,
    deleteProduct,
    changePageSize,
  } = useProducts(true);

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

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) {
      return;
    }

    const success = await deleteProduct(id);
    if (success) {
      setMessage({ type: "success", text: "Producto eliminado correctamente" });
      fetchProducts(page, pageSize, searchTerm);
    } else {
      setMessage({ type: "error", text: "Error al eliminar producto" });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    setMessage({ type: "success", text: "Producto guardado correctamente" });
    fetchProducts(page, pageSize, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    fetchProducts(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    changePageSize(newSize);
  };

  const canDelete = user?.role === "Administrador";

  return (
    <div className="admin-products">
      <Header />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Gestión de Productos</h1>
          <button className="btn btn-primary" onClick={handleCreate}>
            <FaPlus className="btn-icon" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {loading ? (
          <div className="loading">Cargando productos...</div>
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
            <ProductList
              products={products}
              onEdit={handleEdit}
              onDelete={canDelete ? handleDelete : null}
            />
            {totalPages > 1 && (
              <div className="pagination">
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
    </div>
  );
};

export default AdminProducts;
