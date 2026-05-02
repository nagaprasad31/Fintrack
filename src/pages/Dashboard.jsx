import React, { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import ExpenseCard from '../components/ExpenseCard.jsx';
import EditExpenseModal from '../components/EditExpenseModal.jsx';
import { PieChartComponent, BarChartComponent } from '../components/Chart.jsx';
import {
  formatCurrency,
  calculateByCategory,
  filterByCategory,
} from '../utils/helpers';

function StatCard({ label, value, sub, accentColor, icon }) {
  return (
    <div className="stat-card animate-fade-in-up" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Minimal stat card (no decorative glow) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <p style={{ fontSize: '11.5px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a5568' }}>
          {label}
        </p>
        <div style={{
          width: '34px', height: '34px',
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}30`,
          borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
        }}>
          {icon}
        </div>
      </div>
      <p style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: '800', letterSpacing: '-0.03em', color: accentColor, lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '12px', color: '#4a5568', marginTop: '6px' }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { expenses, expenseCategories, getTotalIncome, getTotalExpenses, getBalance } = useContext(ExpenseContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingExpense, setEditingExpense] = useState(null);

  // Show all transactions on the Dashboard (no month filter)
  const filteredExpenses = useMemo(() =>
    filterByCategory(expenses, selectedCategory),
    [expenses, selectedCategory]);

  const totalIncome    = useMemo(() => getTotalIncome(),    [getTotalIncome]);
  const totalExpenses  = useMemo(() => getTotalExpenses(),  [getTotalExpenses]);
  const balance        = useMemo(() => getBalance(),        [getBalance]);

  const categoryData = useMemo(() => {
    const expensesOnly = (expenses || []).filter((e) => e.type === 'expense' || !e.type);
    const by = calculateByCategory(expensesOnly);
    return Object.entries(by).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [expenses]);

  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(0) : 0;

  return (
    <div className="page-wrapper">

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title text-gradient">Dashboard</h1>
          <p className="page-subtitle">Your financial overview for this month</p>
        </div>
        <Link to="/add-expense" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          + Add Transaction
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '36px' }}>
        <StatCard label="Total Income"   value={formatCurrency(totalIncome)}   accentColor="#10b981" icon="💰" sub="All time" />
        <StatCard label="Total Expenses" value={formatCurrency(totalExpenses)}  accentColor="#ef4444" icon="💸" sub="All time" />
        <StatCard
          label="Balance"
          value={formatCurrency(balance)}
          accentColor={balance >= 0 ? '#34d399' : '#fb923c'}
          icon={balance >= 0 ? '✅' : '⚠️'}
          sub={balance >= 0 ? 'Positive balance' : 'Overspent'}
        />
        <StatCard label="Savings Rate"  value={`${savingsRate}%`}              accentColor="#6c63ff" icon="🎯" sub="This month" />
      </div>

      {/* Charts */}
      {categoryData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px', color: '#8892a4' }}>Expenses by Category</h2>
            <PieChartComponent data={categoryData} />
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px', color: '#8892a4' }}>Spending Breakdown</h2>
            <BarChartComponent data={categoryData} />
          </div>
        </div>
      )}

      {/* Transactions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700' }}>
            Transactions
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#4a5568', marginLeft: '8px' }}>
              ({filteredExpenses.length} entries)
            </span>
          </h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '9px 40px 9px 14px', fontSize: '13px' }}
          >
            <option value="all">All Categories</option>
            {expenseCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {filteredExpenses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredExpenses.map((expense, i) => (
              <div key={expense.id} className={`animate-fade-in-up delay-${Math.min(i * 100, 500)}`}>
                <ExpenseCard expense={expense} onEdit={setEditingExpense} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card">
            <div className="empty-state">
              <div className="icon">📭</div>
              <h3 style={{ fontWeight: '600', fontSize: '16px' }}>No transactions yet</h3>
              <p>Add your first income or expense to get started.</p>
              <Link to="/add-expense" className="btn btn-primary" style={{ marginTop: '16px', padding: '11px 24px' }}>
                + Add Transaction
              </Link>
            </div>
          </div>
        )}
      </div>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}