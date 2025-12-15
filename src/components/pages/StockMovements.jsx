"use client"

import { useState, useEffect } from "react"
import { productAPI } from "../../services/api"
import LoadingSpinner from "../common/LoadingSpinner"
import Alert from "../common/Alert"

const StockMovements = () => {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  useEffect(() => {
    fetchStockMovements()
  }, [])

  const fetchStockMovements = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getStockMovements(0)
      // Since we don't have a direct endpoint for all movements, we'll use the product endpoint
      // In a real scenario, you'd have a dedicated endpoint
      setMovements([])
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        message: "Failed to load stock movements: " + (error.response?.data?.message || error.message),
      })
    } finally {
      setLoading(false)
    }
  }

  const getMovementBadge = (type) => {
    const badges = {
      SALE: "bg-danger",
      RESTOCK: "bg-success",
      ADJUSTMENT: "bg-warning",
      INITIAL: "bg-info",
    }
    return badges[type] || "bg-secondary"
  }

  if (loading) return <LoadingSpinner message="Loading stock movements..." />

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
          <h2 className="mb-0">Stock Movement History</h2>
          <p className="text-muted">Track all inventory changes and transactions</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Date & Time</th>
                  <th>Product</th>
                  <th>Barcode</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Previous Stock</th>
                  <th>New Stock</th>
                  <th>Bill Number</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      No stock movements recorded yet
                    </td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                    <tr key={movement.id}>
                      <td>{new Date(movement.createdAt).toLocaleString()}</td>
                      <td>{movement.productName}</td>
                      <td>
                        <code>{movement.barcode}</code>
                      </td>
                      <td>
                        <span className={`badge ${getMovementBadge(movement.movementType)}`}>
                          {movement.movementType}
                        </span>
                      </td>
                      <td>{movement.quantity}</td>
                      <td>{movement.previousStock}</td>
                      <td>{movement.newStock}</td>
                      <td>{movement.billNumber ? <code>{movement.billNumber}</code> : "-"}</td>
                      <td>{movement.notes || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockMovements
