"use client"

const BillPreview = ({ bill, onNewBill }) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Bill Generated Successfully</h4>
              <span className="badge bg-light text-dark">{bill.billNumber}</span>
            </div>
            <div className="card-body" id="bill-content">
              <div className="text-center mb-4">
                <h3>Supermarket Management System</h3>
                <p className="text-muted mb-0">Invoice</p>
                <p className="mb-0">
                  <strong>Bill Number:</strong> {bill.billNumber}
                </p>
                <p className="text-muted">{new Date(bill.createdAt).toLocaleString()}</p>
              </div>

              <div className="table-responsive mb-4">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Barcode</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.productName}</td>
                        <td>
                          <code>{item.barcode}</code>
                        </td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row justify-content-end">
                <div className="col-md-6">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="text-end">
                          <strong>Subtotal:</strong>
                        </td>
                        <td className="text-end">₹{bill.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr className="text-danger">
                        <td className="text-end">
                          <strong>Discount:</strong>
                        </td>
                        <td className="text-end">-₹{bill.discount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="text-end">
                          <strong>Tax:</strong>
                        </td>
                        <td className="text-end">₹{bill.tax.toFixed(2)}</td>
                      </tr>
                      <tr className="table-primary">
                        <td className="text-end">
                          <h5>Total Amount:</h5>
                        </td>
                        <td className="text-end">
                          <h5>₹{bill.total.toFixed(2)}</h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-center mt-4 text-muted">
                <p className="mb-0">Thank you for your business!</p>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <button className="btn btn-primary" onClick={onNewBill}>
                New Bill
              </button>
              <button className="btn btn-outline-secondary" onClick={handlePrint}>
                Print Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillPreview
