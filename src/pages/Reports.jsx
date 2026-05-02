import React, { useState, useContext, useMemo } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { BarChartComponent, PieChartComponent } from '../components/Chart.jsx';
import { formatDate } from '../utils/helpers';
import {
  formatCurrency,
  calculateByCategory,
  calculateTotalForPeriod,
  filterByDateRange,
  downloadCSV,
} from '../utils/helpers';

export default function Reports() {
  const { expenses, categories } = useContext(ExpenseContext);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate]               = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredExpenses = useMemo(() => {
    let result = filterByDateRange(expenses, startDate, endDate);
    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.category === selectedCategory);
    }
    return result;
  }, [expenses, startDate, endDate, selectedCategory]);

  const totalExpenses  = useMemo(() => calculateTotalForPeriod(filteredExpenses), [filteredExpenses]);
  const totalIncome    = useMemo(() => filteredExpenses.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0), [filteredExpenses]);
  const netBalance     = totalIncome - totalExpenses;

  const categoryData = useMemo(() => {
    const by = calculateByCategory(filteredExpenses.filter((e) => e.type === 'expense' || !e.type));
    return Object.entries(by).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [filteredExpenses]);

  const handleExportCSV = () => downloadCSV(filteredExpenses, `report-${startDate}-to-${endDate}.csv`);

  const handleExportTXT = () => {
    const doc = [
      'SpendWise — Expense Report',
      `Period: ${startDate} → ${endDate}`,
      '',
      `Total Expenses : ${formatCurrency(totalExpenses)}`,
      `Total Income   : ${formatCurrency(totalIncome)}`,
      `Net Balance    : ${formatCurrency(netBalance)}`,
      '',
      '--- Category Breakdown ---',
      ...categoryData.map((d) => `${d.name}: ${formatCurrency(d.value)}`),
      '',
      '--- Transactions ---',
      ...filteredExpenses.map((e) => `${e.date}  ${e.type?.toUpperCase() || 'EXPENSE'}  ${e.category}  ${e.description}  ${formatCurrency(e.amount)}`),
    ].join('\n');

    const blob = new Blob([doc], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `report-${startDate}-to-${endDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title text-gradient">Reports</h1>
        <p className="page-subtitle">Analyze your spending patterns and export detailed reports</p>
      </div>

      {/* Filters */}
      <div className="glass-card animate-fade-in-up" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#4a5568', marginBottom: '20px' }}>
          Filter Report
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <label className="form-label">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="form-input">
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Expenses', value: formatCurrency(totalExpenses),  color: '#ef4444', icon: '💸' },
          { label: 'Total Income',   value: formatCurrency(totalIncome),    color: '#10b981', icon: '💰' },
          { label: 'Net Balance',    value: formatCurrency(netBalance),     color: netBalance >= 0 ? '#34d399' : '#fb923c', icon: '📊' },
          { label: 'Transactions',   value: filteredExpenses.length,        color: '#6c63ff', icon: '📋' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="stat-card animate-fade-in-up" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#4a5568' }}>{label}</span>
              <span style={{ fontSize: '18px' }}>{icon}</span>
            </div>
            <p style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="glass-card animate-fade-in-up delay-100" style={{ padding: '20px 24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>Export Report</h3>
            <p style={{ fontSize: '12.5px', color: '#4a5568' }}>Download your filtered data</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button id="export-csv" onClick={handleExportCSV} className="btn btn-accent" style={{ padding: '10px 20px' }}>
              Export CSV
            </button>
            <button id="export-txt" onClick={handleExportTXT} className="btn btn-ghost" style={{ padding: '10px 20px' }}>
              Export TXT
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      {categoryData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div className="glass-card animate-fade-in-up delay-200" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#8892a4', marginBottom: '16px' }}>Expenses by Category</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}><PieChartComponent data={categoryData} /></div>
          </div>
          <div className="glass-card animate-fade-in-up delay-300" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#8892a4', marginBottom: '16px' }}>Category Breakdown</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}><BarChartComponent data={categoryData} /></div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="glass-card animate-fade-in-up delay-400" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Detailed Transactions</h3>
        </div>

        {filteredExpenses.length > 0 ? (
          <div className="table-wrapper">
            <div style={{ maxHeight: '460px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td style={{ color: '#4a5568', fontSize: '13px', whiteSpace: 'nowrap' }}>{formatDate(expense.date)}</td>
                      <td>
                        <span className={`badge ${expense.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {expense.type === 'income' ? '▲ Income' : '▼ Expense'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{expense.category}</span>
                      </td>
                      <td style={{ color: '#8892a4', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {expense.description}
                      </td>
                      <td style={{
                        textAlign: 'right', fontWeight: '700', fontSize: '14px',
                        color: expense.type === 'income' ? '#34d399' : '#f87171',
                        whiteSpace: 'nowrap',
                      }}>
                        {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No transactions found for this period.</p>
          </div>
        )}
      
      </div>
    </div>
  );
}
