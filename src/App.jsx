import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Dashboard from "./components/pages/Dashboard"
import Products from "./components/pages/Products"
import Billing from "./components/pages/Billing"
import Reports from "./components/pages/Reports"
import StockMovements from "./components/pages/StockMovements"

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/stock-movements" element={<StockMovements />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
