import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

export default function EditExpenseModal({ expense, onClose, onSave }) {
  const { categories, addCategory, updateExpense } = useContext(ExpenseContext);

  const [formData, setFormData] = useState({
    description: '', amount: '', category: 'Food', date: '',
  });
  const [newCategory, setNewCategory]         = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError]                     = useState('');
  const [saving, setSaving]                   = useState(false);

  useLayoutEffect(() => {
    if (!expense) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [expense]);

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        amount:      expense.amount.toString(),
        category:    expense.category,
        date:        expense.date.split('T')[0],
      });
    }
  }, [expense]);

  if (!expense) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory);
      setFormData((prev) => ({ ...prev, category: newCategory }));
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.description.trim()) { setError('Description is required'); return; }
    if (!formData.amount || parseFloat(formData.amount) <= 0) { setError('Amount must be greater than 0'); return; }
    setSaving(true);
    try {
      updateExpense(expense.id, {
        description: formData.description,
        amount:      parseFloat(formData.amount),
        category:    formData.category,
        // store as ISO to match add flow and avoid timezone/date parsing issues
        date:        new Date(formData.date).toISOString(),
      });
      setTimeout(() => { setSaving(false); onClose(); }, 400);
    } catch {
      setError('Failed to update transaction');
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,.07)',
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>Edit Transaction</h2>
            <p style={{ fontSize: '12px', color: '#4a5568', marginTop: '2px' }}>Make changes to your transaction</p>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: '34px', height: '34px', borderRadius: '8px' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Error */}
          {error && (
            <div className="error-box" style={{ marginBottom: '20px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Grocery shopping"
              />
            </div>

            {/* Amount + Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="form-label">Amount (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '13px', fontWeight: '700', color: '#4a5568',
                  }}>₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    style={{ paddingLeft: '28px' }}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="form-label">Category</label>
              {!showNewCategory ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    style={{ background: 'none', border: 'none', color: '#6c63ff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    + Add custom category
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="form-input"
                    placeholder="Category name"
                    autoFocus
                  />
                  <button type="button" onClick={handleAddCategory} className="btn btn-success" style={{ flexShrink: 0, padding: '10px 16px', fontSize: '13px' }}>Add</button>
                  <button type="button" onClick={() => setShowNewCategory(false)} className="btn btn-ghost" style={{ flexShrink: 0, padding: '10px 14px', fontSize: '13px' }}>✕</button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ flex: 1, padding: '13px', fontSize: '14px', borderRadius: '12px' }}
              >
                {saving ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin .8s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Saving…
                  </span>
                ) : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                style={{ flex: 1, padding: '13px', fontSize: '14px', borderRadius: '12px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
