"use client";

import { useState, useRef, useEffect } from "react";
import { productAPI, billingAPI } from "../../services/api";
import Alert from "../common/Alert";
import BillPreview from "../billing/BillPreview";
import Barcode from "../billing/Barcode";

const Billing = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [taxRate, setTaxRate] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [generatedBill, setGeneratedBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const handleCameraScan = async (barcode) => {
    console.log("[v0] Camera scanned barcode:", barcode);
    setBarcodeInput(barcode);
    // Automatically process the scanned barcode
    await processBarcode(barcode);
  };

  const processBarcode = async (barcode) => {
    if (!barcode.trim()) return;

    try {
      const response = await productAPI.getByBarcode(barcode.trim());
      const product = response.data;

      if (product.status === "Out of Stock") {
        showAlert("danger", `${product.name} is out of stock`);
        setBarcodeInput("");
        return;
      }

      const existingItem = billItems.find(
        (item) => item.barcode === product.barcode
      );

      if (existingItem) {
        if (existingItem.quantity >= product.quantity) {
          showAlert(
            "warning",
            `Cannot add more. Only ${product.quantity} units available`
          );
        } else {
          setBillItems(
            billItems.map((item) =>
              item.barcode === product.barcode
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
          showAlert("success", `Added 1 more ${product.name}`);
        }
      } else {
        setBillItems([
          ...billItems,
          {
            barcode: product.barcode,
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            availableStock: product.quantity,
          },
        ]);
        showAlert("success", `Added ${product.name} to bill`);
      }

      // setBarcodeInput("");
    } catch (error) {
      showAlert("danger", "Product not found with barcode: " + barcode);
      setBarcodeInput("");
    }
  };

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    await processBarcode(barcodeInput);
  };

  const handleQuantityChange = (barcode, newQuantity) => {
    const item = billItems.find((i) => i.barcode === barcode);

    if (newQuantity > item.availableStock) {
      showAlert("warning", `Only ${item.availableStock} units available`);
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveItem(barcode);
    } else {
      setBillItems(
        billItems.map((item) =>
          item.barcode === barcode ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  console.log(billItems);
  
  const handleRemoveItem = (barcode) => {
    setBillItems(billItems.filter((item) => item.barcode !== barcode));
  };

  const calculateTotals = () => {
    const subtotal = billItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountAmount = Math.min(discount, subtotal);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (taxRate / 100);
    const total = subtotalAfterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const handleGenerateBill = async () => {
    if (billItems.length === 0) {
      showAlert("warning", "Please add items to the bill");
      return;
    }

    try {
      setLoading(true);
      const billData = {
        items: billItems.map((item) => ({
          barcode: item.barcode,
          quantity: item.quantity,
        })),
        taxRate: taxRate,
        discount: calculateTotals().discountAmount,
      };

      const response = await billingAPI.create(billData);
      setGeneratedBill(response.data);
      showAlert("success", "Bill generated successfully!");

      // Reset form
      setBillItems([]);
      setDiscount(0);
      setTaxRate(5);
    } catch (error) {
      showAlert(
        "danger",
        "Failed to generate bill: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewBill = () => {
    setGeneratedBill(null);
    setBarcodeInput("");
    setBillItems([]);
    setDiscount(0);
    setTaxRate(5);
    barcodeInputRef.current?.focus();
  };

  const totals = calculateTotals();

  if (generatedBill) {
    return <BillPreview bill={generatedBill} onNewBill={handleNewBill} />;
  }

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
          <h2 className="mb-0">Billing System</h2>
          <p className="text-muted">
            Scan or enter product barcodes to create bills
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${!showScanner ? "active" : ""}`}
                    onClick={() => setShowScanner(false)}
                    type="button"
                  >
                    <i className="bi bi-keyboard me-2"></i>
                    Manual Entry
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${showScanner ? "active" : ""}`}
                    onClick={() => setShowScanner(true)}
                    type="button"
                  >
                    <i className="bi bi-camera me-2"></i>
                    Camera Scanner
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {!showScanner ? (
                <form onSubmit={handleBarcodeSubmit}>
                  <div className="input-group input-group-lg">
                    <input
                      type="text"
                      ref={barcodeInputRef}
                      className="form-control barcode-input"
                      placeholder="Scan or enter barcode..."
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      autoFocus
                    />
                    <button className="btn btn-primary" type="submit">
                      Add Item
                    </button>
                  </div>
                  <small className="text-muted">
                    Focus on this field and scan barcode or type manually
                  </small>
                </form>
              ) : (
                <Barcode
                  onScan={handleCameraScan}
                  onError={(error) => showAlert("danger", error)}
                />
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Bill Items</h5>
              <span className="badge bg-primary">{billItems.length} items</span>
            </div>
            <div className="card-body">
              {billItems.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <h4>No items added yet</h4>
                  <p>Scan or enter barcodes to add products</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Barcode</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {billItems.map((item) => (
                        <tr key={item.barcode}>
                          <td>{item.productName}</td>
                          <td>
                            <code>{item.barcode}</code>
                          </td>
                          <td>₹{item.price.toFixed(2)}</td>
                          <td>
                            <div
                              className="input-group"
                              style={{ width: "120px" }}
                            >
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.barcode,
                                    item.quantity - 1
                                  )
                                }
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="form-control form-control-sm text-center"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.barcode,
                                    Number.parseInt(e.target.value) || 0
                                  )
                                }
                                min="1"
                                max={item.availableStock}
                              />
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.barcode,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveItem(item.barcode)}
                            >
                              Remove
                            </button>
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

        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: "20px" }}>
            <div className="card-header">
              <h5 className="mb-0">Bill Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Tax Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={taxRate}
                  onChange={(e) =>
                    setTaxRate(Number.parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Discount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(Number.parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  max={totals.subtotal}
                  step="0.01"
                />
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span className="fw-bold">₹{totals.subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>Discount:</span>
                <span>-₹{totals.discountAmount.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax ({taxRate}%):</span>
                <span>₹{totals.taxAmount.toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <h5>Total:</h5>
                <h4 className="text-primary">₹{totals.total.toFixed(2)}</h4>
              </div>

              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleGenerateBill}
                disabled={billItems.length === 0 || loading}
              >
                {loading ? "Processing..." : "Generate Bill"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
