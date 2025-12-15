"use client"

import { useState, useEffect } from "react"
import { productAPI } from "../../services/api"

const ProductModal = ({ show, onHide, product, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    barcode: "",
    price: "",
    quantity: "",
    lowStockThreshold: "10",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        barcode: product.barcode,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
      })
    } else {
      setFormData({
        name: "",
        category: "",
        barcode: "",
        price: "",
        quantity: "",
        lowStockThreshold: "10",
      })
    }
    setErrors({})
  }, [product, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.category.trim()) newErrors.category = "Category is required"
    if (!formData.barcode.trim()) newErrors.barcode = "Barcode is required"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.quantity || Number.parseInt(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required"
    if (!formData.lowStockThreshold || Number.parseInt(formData.lowStockThreshold) < 1) {
      newErrors.lowStockThreshold = "Valid threshold is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)
      const data = {
        ...formData,
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
        lowStockThreshold: Number.parseInt(formData.lowStockThreshold),
      }

      if (product) {
        await productAPI.update(product.id, data)
        onSuccess("Product updated successfully")
      } else {
        await productAPI.create(data)
        onSuccess("Product created successfully")
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      onError("Failed to save product: " + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{product ? "Edit Product" : "Add New Product"}</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category *</label>
                    <input
                      type="text"
                      name="category"
                      className={`form-control ${errors.category ? "is-invalid" : ""}`}
                      value={formData.category}
                      onChange={handleChange}
                    />
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Barcode *</label>
                    <input
                      type="text"
                      name="barcode"
                      className={`form-control barcode-input ${errors.barcode ? "is-invalid" : ""}`}
                      value={formData.barcode}
                      onChange={handleChange}
                      disabled={!!product}
                    />
                    {errors.barcode && <div className="invalid-feedback">{errors.barcode}</div>}
                    {product && <small className="text-muted">Barcode cannot be changed</small>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      className={`form-control ${errors.price ? "is-invalid" : ""}`}
                      value={formData.price}
                      onChange={handleChange}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                    {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Low Stock Threshold *</label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      className={`form-control ${errors.lowStockThreshold ? "is-invalid" : ""}`}
                      value={formData.lowStockThreshold}
                      onChange={handleChange}
                    />
                    {errors.lowStockThreshold && <div className="invalid-feedback">{errors.lowStockThreshold}</div>}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onHide} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductModal
