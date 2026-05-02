import React, { useContext } from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ExpenseContext } from '../context/ExpenseContext';

const CATEGORY_ICONS = {
  Food: '🍔', Travel: '✈️', Bills: '📄', Entertainment: '🎬',
  Health: '🏥', Shopping: '🛍️', Salary: '💼', Freelance: '💻',
  Investment: '📈', Gift: '🎁', Other: '📦',
};

const CATEGORY_COLORS = {
  Food: '#f59e0b', Travel: '#3b82f6', Bills: '#8b5cf6', Entertainment: '#ec4899',
  Health: '#10b981', Shopping: '#f97316', Salary: '#06b6d4', Freelance: '#6c63ff',
  Investment: '#14b8a6', Gift: '#f43f5e', Other: '#6b7280',
};

export default function ExpenseCard({ expense, onEdit }) {
  const { deleteExpense } = useContext(ExpenseContext);
  const isIncome = expense.type === 'income';
  const color = CATEGORY_COLORS[expense.category] || '#6b7280';
  const icon  = CATEGORY_ICONS[expense.category]  || '📦';

  const handleDelete = () => {
    if (window.confirm('Delete this transaction?')) {
      deleteExpense(expense.id);
    }
  };

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '16px 20px',
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.07)',
        borderRadius: '14px',
        transition: 'all .2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,.06)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)';
      }}
    >
      {/* Category icon bubble */}
      <div style={{
        flexShrink: 0,
        width: '44px', height: '44px',
        borderRadius: '12px',
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px',
      }}>
        {icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {expense.description}
          </p>
          <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`} style={{ flexShrink: 0 }}>
            {expense.category}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#4a5568' }}>{formatDate(expense.date)}</p>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{
          fontSize: '16px', fontWeight: '800', letterSpacing: '-0.02em',
          color: isIncome ? '#34d399' : '#f87171',
        }}>
          {isIncome ? '+' : '-'}{formatCurrency(expense.amount)}
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={() => onEdit(expense)}
          className="btn-icon"
          title="Edit"
          style={{ padding: '7px' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="btn-icon"
          title="Delete"
          style={{ padding: '7px', color: '#f87171' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
