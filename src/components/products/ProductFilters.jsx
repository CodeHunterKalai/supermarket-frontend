"use client"

const ProductFilters = ({ filters, setFilters, products }) => {
  const categories = [...new Set(products.map((p) => p.category))].sort()

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <label className="form-label">Search</label>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or barcode..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
    </div>
  )
}

export default ProductFilters
