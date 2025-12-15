const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="spinner-container">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
