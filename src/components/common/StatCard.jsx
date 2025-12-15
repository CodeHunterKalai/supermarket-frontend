const StatCard = ({ title, value, icon, color = "primary", subtitle }) => {
  return (
    <div className="col-md-6 col-lg-3 mb-4">
      <div className={`card stat-card border-start border-${color} border-4`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted text-uppercase mb-2">{title}</h6>
              <h2 className="mb-0">{value}</h2>
              {subtitle && <small className="text-muted">{subtitle}</small>}
            </div>
            {icon && <div className={`fs-1 text-${color}`}>{icon}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
