"use client"

import { useState, useEffect } from "react"
import { productAPI } from "../../services/api"
import LoadingSpinner from "../common/LoadingSpinner"
import Alert from "../common/Alert"
import ProductModal from "../products/ProductModal"
import ProductTable from "../products/ProductTable"
import ProductFilters from "../products/ProductFilters"

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll()
      setProducts(response.data)
      setFilteredProducts(response.data)
    } catch (error) {
      showAlert("danger", "Failed to load products: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(searchLower) || p.barcode.toLowerCase().includes(searchLower),
      )
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category)
    }

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status)
    }

    setFilteredProducts(filtered)
  }

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message })
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    try {
      await productAPI.delete(id)
      showAlert("success", "Product deleted successfully")
      fetchProducts()
    } catch (error) {
      showAlert("danger", "Failed to delete product: " + (error.response?.data?.message || error.message))
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleModalSuccess = (message) => {
    handleModalClose()
    showAlert("success", message)
    fetchProducts()
  }

  if (loading) return <LoadingSpinner message="Loading products..." />

  return (
    <div className="container-fluid">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}

      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-0">Product Management</h2>
          <p className="text-muted">Manage your inventory with barcode tracking</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={handleAddProduct}>
            Add New Product
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <ProductFilters filters={filters} setFilters={setFilters} products={products} />

          <ProductTable products={filteredProducts} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
        </div>
      </div>

      {showModal && (
        <ProductModal
          show={showModal}
          onHide={handleModalClose}
          product={editingProduct}
          onSuccess={handleModalSuccess}
          onError={(msg) => showAlert("danger", msg)}
        />
      )}
    </div>
  )
}

export default Products
