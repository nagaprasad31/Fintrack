// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Get month year
export const getMonthYear = (date) => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Calculate total expenses by category
export const calculateByCategory = (expenses) => {
  const result = {};
  expenses.forEach((expense) => {
    result[expense.category] = (result[expense.category] || 0) + expense.amount;
  });
  return result;
};

// Calculate total for period
export const calculateTotalForPeriod = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Filter expenses by date range
export const filterByDateRange = (expenses, startDate, endDate) => {
  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    // If endDate was provided as a date-only string (YYYY-MM-DD) or a Date at midnight,
    // include the whole day by setting to end of day.
    if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0 && end.getMilliseconds() === 0) {
      end.setHours(23, 59, 59, 999);
    }
    return expenseDate >= start && expenseDate <= end;
  });
};

// Filter expenses by category
export const filterByCategory = (expenses, category) => {
  if (category === 'all') return expenses;
  return expenses.filter((expense) => expense.category === category);
};

// Get current month range
export const getCurrentMonthRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

// Export data to CSV
export const downloadCSV = (data, fileName) => {
  const csv = [
    ['Date', 'Category', 'Description', 'Amount'],
    ...data.map(item => [
      formatDate(item.date),
      item.category,
      item.description,
      item.amount
    ])
  ]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
