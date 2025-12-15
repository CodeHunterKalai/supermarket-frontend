"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { reportAPI, productAPI, billingAPI } from "../../services/api"
import LoadingSpinner from "../common/LoadingSpinner"
import Alert from "../common/Alert"
import StatCard from "../common/StatCard"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [recentBills, setRecentBills] = useState([])
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, lowStockRes, billsRes] = await Promise.all([
        reportAPI.getDashboard(),
        productAPI.getLowStock(),
        billingAPI.getAll(),
      ])

      setStats(statsRes.data)
      setLowStockProducts(lowStockRes.data.slice(0, 5))
      setRecentBills(billsRes.data.slice(0, 5))
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        message: "Failed to load dashboard data: " + (error.response?.data?.message || error.message),
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

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
          <h2 className="mb-0">Dashboard</h2>
          <p className="text-muted">Overview of your supermarket operations</p>
        </div>
      </div>

      <div className="row">
        <StatCard title="Total Products" value={stats?.totalProducts || 0} icon="📦" color="primary" />
        <StatCard title="Low Stock Items" value={stats?.lowStockCount || 0} icon="⚠️" color="warning" />
        <StatCard title="Out of Stock" value={stats?.outOfStockCount || 0} icon="❌" color="danger" />
        <StatCard
          title="Today's Sales"
          value={`₹${(stats?.todaysSales || 0).toFixed(2)}`}
          icon="💰"
          color="success"
          subtitle={`${stats?.todaysTransactions || 0} transactions`}
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Low Stock Alert</h5>
              <Link to="/products" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {lowStockProducts.length === 0 ? (
                <p className="text-muted text-center py-3">No low stock items</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Barcode</th>
                        <th>Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>
                            <code>{product.barcode}</code>
                          </td>
                          <td>{product.quantity}</td>
                          <td>
                            <span className="badge bg-warning">Low Stock</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Bills</h5>
              <Link to="/reports" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentBills.length === 0 ? (
                <p className="text-muted text-center py-3">No recent bills</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Bill Number</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBills.map((bill) => (
                        <tr key={bill.id}>
                          <td>
                            <code>{bill.billNumber}</code>
                          </td>
                          <td>{bill.items.length}</td>
                          <td>₹{bill.total.toFixed(2)}</td>
                          <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h5>Monthly Performance</h5>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <p className="text-muted mb-1">Total Revenue</p>
                  <h3 className="mb-0">₹{(stats?.monthlySales || 0).toFixed(2)}</h3>
                </div>
                <div className="text-end">
                  <p className="text-muted mb-1">Transactions</p>
                  <h3 className="mb-0">{stats?.monthlyTransactions || 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Quick Actions</h5>
              <div className="d-grid gap-2 mt-3">
                <Link to="/billing" className="btn btn-light">
                  Create New Bill
                </Link>
                <Link to="/products" className="btn btn-outline-light">
                  Manage Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
