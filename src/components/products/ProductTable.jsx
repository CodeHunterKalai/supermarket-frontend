"use client"

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Barcode</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-muted py-4">
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>
                  <code className="barcode-input">{product.barcode}</code>
                </td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>
                  <span className={product.quantity <= product.lowStockThreshold ? "text-danger fw-bold" : ""}>
                    {product.quantity}
                  </span>
                </td>
                <td>
                  <span className={`badge ${product.status === "In Stock" ? "bg-success" : "bg-danger"}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
