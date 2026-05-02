import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import EditExpenseModal from '../components/EditExpenseModal.jsx';
import { formatDate, formatCurrency } from '../utils/helpers';

const incomeCategories  = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

export default function AddExpense() {
  const { addExpense, categories, addCategory } = useContext(ExpenseContext);
  const navigate = useNavigate();
  const { expenses, deleteExpense } = useContext(ExpenseContext);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0],
    type: 'income',
  });
  const [newCategory, setNewCategory]       = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState(false);

  const expenseCategories = categories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: value === 'income' ? 'Salary' : 'Food' }),
    }));
  };

  const setType = (type) => {
    setFormData((prev) => ({ ...prev, type, category: type === 'income' ? 'Salary' : 'Food' }));
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
    try {
      addExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        // normalize to full ISO string to avoid timezone parsing issues
        date: new Date(formData.date).toISOString(),
        type: formData.type,
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch {
      setError('Failed to add transaction');
    }
  };

  const isIncome = formData.type === 'income';
  const [showTransactions, setShowTransactions] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <div className="page-wrapper" style={{ maxWidth: '680px' }}>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="text-gradient">{isIncome ? 'Add Income' : 'Add Expense'}</span>
        </h1>
        <p className="page-subtitle">
          {isIncome ? 'Record an income source to your account' : 'Track a new expense entry'}
        </p>
      </div>

      <div className="glass-card-elevated animate-fade-in-up" style={{ padding: 'clamp(28px, 5vw, 44px)' }}>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <button type="button" onClick={() => setShowTransactions(true)} className="btn btn-ghost" style={{ padding: '9px 14px' }}>
            View Transactions
          </button>
        </div>

        {/* Success banner */}
        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 18px', marginBottom: '24px',
            background: 'rgba(16,185,129,.12)',
            border: '1px solid rgba(16,185,129,.3)',
            borderRadius: '12px', color: '#34d399',
            animation: 'fadeInUp .3s ease',
          }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Transaction added! Redirecting…
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-box" style={{ marginBottom: '24px' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* Type Toggle */}
          <div>
            <label className="form-label">Transaction Type</label>
            <div className="type-toggle">
              <button
                id="type-income"
                type="button"
                onClick={() => setType('income')}
                className={`type-toggle-btn ${isIncome ? 'active-income' : ''}`}
              >
                💰 Income
              </button>
              <button
                id="type-expense"
                type="button"
                onClick={() => setType('expense')}
                className={`type-toggle-btn ${!isIncome ? 'active-expense' : ''}`}
              >
                💸 Expense
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description</label>
            <input
              id="tx-description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              placeholder={isIncome ? 'e.g., Monthly salary' : 'e.g., Grocery shopping'}
              required
            />
          </div>

          {/* Amount + Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Amount (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '14px', fontWeight: '700', color: '#4a5568',
                }}>₹</span>
                <input
                  id="tx-amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                  style={{ paddingLeft: '30px' }}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                id="tx-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Category</label>
            <select
              id="tx-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
            >
              {(isIncome ? incomeCategories : expenseCategories).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {!isIncome && (
              <button
                type="button"
                onClick={() => setShowNewCategory(!showNewCategory)}
                style={{
                  marginTop: '8px', background: 'none', border: 'none',
                  color: '#6c63ff', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', padding: '4px 0', textDecoration: 'none',
                }}
              >
                {showNewCategory ? '− Cancel' : '+ Add custom category'}
              </button>
            )}

            {showNewCategory && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-input"
                  placeholder="New category name"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="btn btn-success"
                  style={{ flexShrink: 0, padding: '10px 18px' }}
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button
              id="tx-submit"
              type="submit"
              className={`btn ${isIncome ? 'btn-success' : 'btn-danger'}`}
              style={{ flex: 1, padding: '14px', fontSize: '15px', borderRadius: '12px' }}
            >
              {isIncome ? '+ Add Income' : '+ Add Expense'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-ghost"
              style={{ flex: 1, padding: '14px', fontSize: '15px', borderRadius: '12px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {/* Transactions Popup */}
      {showTransactions && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowTransactions(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '860px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Transactions</h2>
                <p style={{ fontSize: '12px', color: '#4a5568', marginTop: '2px' }}>Your recent income and expenses</p>
              </div>
              <button onClick={() => setShowTransactions(false)} className="btn-icon" style={{ width: '34px', height: '34px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding: '16px 20px' }}>
              {expenses && expenses.length > 0 ? (
                <div style={{ maxHeight: '56vh', overflowY: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((tx) => (
                        <tr key={tx.id}>
                          <td style={{ color: '#4a5568', fontSize: '13px', whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</td>
                          <td>
                            <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                              {tx.type === 'income' ? '▲ Income' : '▼ Expense'}
                            </span>
                          </td>
                          <td><span className="badge badge-neutral">{tx.category}</span></td>
                          <td style={{ color: '#8892a4', fontSize: '13px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</td>
                          <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '14px', color: tx.type === 'income' ? '#34d399' : '#f87171' }}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                              <button onClick={() => setEditingExpense(tx)} className="btn-icon" title="Edit"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                              <button onClick={() => { if (window.confirm('Delete this transaction?')) deleteExpense(tx.id); }} className="btn-icon" title="Delete" style={{ color: '#f87171' }}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">📭</div>
                  <p>No transactions yet.</p>
                </div>
              )}
            </div>
          </div>
          {editingExpense && (
            <EditExpenseModal expense={editingExpense} onClose={() => setEditingExpense(null)} onSave={() => setEditingExpense(null)} />
          )}
        </div>
      )}
    </div>
  );
}