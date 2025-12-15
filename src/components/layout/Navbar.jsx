import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          Supermarket Management
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/dashboard")}`} to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/products")}`} to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/billing")}`} to="/billing">
                Billing
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/reports")}`} to="/reports">
                Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/stock-movements")}`} to="/stock-movements">
                Stock History
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
