"use client"

import { useState, useEffect } from "react"
import { reportAPI, billingAPI } from "../../services/api"
import LoadingSpinner from "../common/LoadingSpinner"
import Alert from "../common/Alert"

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })
  const [dailyReport, setDailyReport] = useState(null)
  const [monthlyReport, setMonthlyReport] = useState(null)
  const [bills, setBills] = useState([])
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [customReport, setCustomReport] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const [dailyRes, monthlyRes, billsRes] = await Promise.all([
        reportAPI.getDailyReport(),
        reportAPI.getMonthlyReport(),
        billingAPI.getAll(),
      ])

      setDailyReport(dailyRes.data)
      setMonthlyReport(monthlyRes.data)
      setBills(billsRes.data)
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        message: "Failed to load reports: " + (error.response?.data?.message || error.message),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomReport = async () => {
    try {
      const response = await reportAPI.getCustomReport(customDateRange.startDate, customDateRange.endDate)
      setCustomReport(response.data)
      setAlert({
        show: true,
        type: "success",
        message: "Custom report generated successfully",
      })
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        message: "Failed to generate report: " + (error.response?.data?.message || error.message),
      })
    }
  }

  const ReportCard = ({ title, report, color = "primary" }) => {
    if (!report) return null

    return (
      <div className="card mb-4">
        <div className={`card-header bg-${color} text-white`}>
          <h5 className="mb-0">{title}</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-2">
                <strong>Date Range:</strong>
              </p>
              <p className="text-muted">
                {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="col-md-6 text-end">
              <p className="mb-2">
                <strong>Transactions:</strong>
              </p>
              <h4>{report.transactionCount}</h4>
            </div>
          </div>
          <hr />
          <div className="row text-center">
            <div className="col-md-3">
              <p className="text-muted mb-1">Total Revenue</p>
              <h4 className="text-success">₹{report.totalRevenue.toFixed(2)}</h4>
            </div>
            <div className="col-md-3">
              <p className="text-muted mb-1">Avg Transaction</p>
              <h4>₹{report.averageTransactionValue.toFixed(2)}</h4>
            </div>
            <div className="col-md-3">
              <p className="text-muted mb-1">Total Tax</p>
              <h4>₹{report.totalTax.toFixed(2)}</h4>
            </div>
            <div className="col-md-3">
              <p className="text-muted mb-1">Total Discount</p>
              <h4 className="text-danger">₹{report.totalDiscount.toFixed(2)}</h4>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingSpinner message="Loading reports..." />

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
          <h2 className="mb-0">Sales Reports</h2>
          <p className="text-muted">View detailed sales analytics and reports</p>
        </div>
      </div>

      <ReportCard title="Today's Sales Report" report={dailyReport} color="success" />
      <ReportCard title="Monthly Sales Report" report={monthlyReport} color="primary" />

      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Custom Date Range Report</h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={customDateRange.startDate}
                onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={customDateRange.endDate}
                onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-info w-100" onClick={handleCustomReport}>
                Generate Report
              </button>
            </div>
          </div>

          {customReport && (
            <>
              <hr />
              <div className="row text-center">
                <div className="col-md-3">
                  <p className="text-muted mb-1">Total Revenue</p>
                  <h4 className="text-success">₹{customReport.totalRevenue.toFixed(2)}</h4>
                </div>
                <div className="col-md-3">
                  <p className="text-muted mb-1">Transactions</p>
                  <h4>{customReport.transactionCount}</h4>
                </div>
                <div className="col-md-3">
                  <p className="text-muted mb-1">Avg Transaction</p>
                  <h4>₹{customReport.averageTransactionValue.toFixed(2)}</h4>
                </div>
                <div className="col-md-3">
                  <p className="text-muted mb-1">Total Tax</p>
                  <h4>₹{customReport.totalTax.toFixed(2)}</h4>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Transaction History</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Bill Number</th>
                  <th>Date & Time</th>
                  <th>Items</th>
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr key={bill.id}>
                      <td>
                        <code>{bill.billNumber}</code>
                      </td>
                      <td>{new Date(bill.createdAt).toLocaleString()}</td>
                      <td>{bill.items.length}</td>
                      <td>₹{bill.subtotal.toFixed(2)}</td>
                      <td>₹{bill.tax.toFixed(2)}</td>
                      <td className="text-danger">₹{bill.discount.toFixed(2)}</td>
                      <td className="fw-bold">₹{bill.total.toFixed(2)}</td>
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

export default Reports
