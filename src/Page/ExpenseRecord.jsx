// src/Page/ExpenseRecord.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/expenserecord.css"; // Updated path
import ActivateButton from "../components/ActivateButton";

const ExpenseRecord = () => {
  const navigate = useNavigate();

  const getCurrentUser = () => localStorage.getItem("username") || "Guest";

  const [form, setForm] = useState({
    date: "",
    vendor: "",
    invoiceNo: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    gstApplicable: false, // New field for GST checkbox
    gst: 0,
    totalAmount: 0,
    paymentMethod: "",
    remarks: "",
    username: getCurrentUser(),
  });

  const [entries, setEntries] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const scriptUrl =
    "https://script.google.com/macros/s/AKfycbwKKE82HiW_Z9R9kSdgYJpD7dq7HLhXotH04m_QpoVX5sNGL-PipshQEIxNSapkySWe/exec";

  // Format date to DD-MMM-YYYY
  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${scriptUrl}?action=get`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        const validEntries = (json.records || []).filter(
          (entry) => entry.date && !isNaN(new Date(entry.date).getTime())
        );
        const sortedEntries = validEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEntries(sortedEntries);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateTotals = () => {
    const qty = parseFloat(form.quantity) || 0;
    const price = parseFloat(form.unitPrice) || 0;
    const baseAmount = qty * price;
    const gstVal = form.gstApplicable ? baseAmount * 0.09 : 0; // GST only if applicable
    const total = baseAmount + gstVal;

    setForm((prev) => ({
      ...prev,
      gst: gstVal.toFixed(2),
      totalAmount: total.toFixed(2),
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [form.quantity, form.unitPrice, form.gstApplicable]); // Added gstApplicable as dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.vendor || !form.description) {
      alert("Please fill in all required fields (Date, Vendor, Description).");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, action: "add" }),
      });

      console.log("Form submitted:", form);
      setEntries((prev) => {
        const newEntries = [...prev, { ...form }];
        const validEntries = newEntries.filter(
          (entry) => entry.date && !isNaN(new Date(entry.date).getTime())
        );
        return validEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
      });

      setForm({
        date: "",
        vendor: "",
        invoiceNo: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        gstApplicable: false, // Reset to unchecked
        gst: 0,
        totalAmount: 0,
        paymentMethod: "",
        remarks: "",
        username: getCurrentUser(),
      });

      alert("Expense record saved successfully!");
    } catch (error) {
      console.error("Submit error:", error.message);
      alert("Error saving expense record: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="expense-record-container">
      <div className="expense-record-card">
        <h2>New Expense Record</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="expense-form-grid">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Vendor / Payee</label>
              <input
                type="text"
                name="vendor"
                value={form.vendor}
                onChange={handleChange}
                placeholder="e.g. Smart Energy Pte Ltd"
                required
              />
            </div>
            <div className="form-group">
              <label>Invoice / Reference #</label>
              <input
                type="text"
                name="invoiceNo"
                value={form.invoiceNo}
                onChange={handleChange}
                placeholder="e.g. 153549 / 681891000"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Gas top-up, Parking, etc."
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Unit Price</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                step="0.01"
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="gstApplicable"
                  checked={form.gstApplicable}
                  onChange={handleChange}
                />
                Apply GST (9%)
              </label>
              <input
                type="number"
                name="gst"
                value={form.gst}
                readOnly
                className="gst-input"
              />
            </div>
            <div className="form-group">
              <label>Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={form.totalAmount}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <input
                type="text"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                placeholder="e.g. NETS, Credit Card, Cash"
              />
            </div>
            <div className="form-group">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Any note"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="save-expense-button"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="button-loading">
                  <ActivateButton autoStart={true} size="small" />
                  Saving...
                </div>
              ) : (
                "Save Expense"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className={`back-button ${isSaving ? "disabled" : ""}`}
              disabled={isSaving}
            >
              Back to Dashboard
            </button>
          </div>
        </form>

        {entries.length > 0 && (
          <div className="data-grid">
            <table className="expense-data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vendor</th>
                  <th>Invoice #</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>GST</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx}>
                    <td data-label="Date">{formatDate(entry.date)}</td>
                    <td data-label="Vendor">{entry.vendor}</td>
                    <td data-label="Invoice #">{entry.invoiceNo}</td>
                    <td data-label="Description">{entry.description}</td>
                    <td data-label="Qty">{entry.quantity}</td>
                    <td data-label="Unit Price">{entry.unitPrice}</td>
                    <td data-label="GST">{entry.gst}</td>
                    <td data-label="Total">{entry.totalAmount}</td>
                    <td data-label="Payment Method">{entry.paymentMethod}</td>
                    <td data-label="Remarks">{entry.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseRecord;