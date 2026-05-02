import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

export const ExpenseContext = createContext();
export const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, name) => {
    setLoading(true);
    try {
      const response = await authService.register(email, password, name);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  const value = { user, login, logout, register, loading, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Expense Provider
export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const stored = localStorage.getItem('expenses');
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      // Normalize older entries that used 'YYYY-MM-DD' or numeric dates to full ISO strings
      return parsed.map((e) => ({
        ...e,
        date: e.date && typeof e.date === 'string' && e.date.length === 10 ? new Date(e.date).toISOString() : e.date,
        amount: e.amount !== undefined ? Number(e.amount) : e.amount,
      }));
    } catch (err) {
      return [];
    }
  });

  // Split categories for income vs expense
  const [expenseCategories, setExpenseCategories] = useState(() => {
    const stored = localStorage.getItem('expenseCategories');
    return stored
      ? JSON.parse(stored)
      : ['Food', 'Travel', 'Bills', 'Entertainment', 'Health', 'Shopping', 'Other'];
  });

  const [incomeCategories, setIncomeCategories] = useState(() => {
    const stored = localStorage.getItem('incomeCategories');
    return stored ? JSON.parse(stored) : ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  });

  const [budgets, setBudgets] = useState(() => {
    const stored = localStorage.getItem('budgets');
    return stored ? JSON.parse(stored) : {};
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem('incomeCategories', JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addExpense = useCallback((expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: expense.date || new Date().toISOString(),
      type: expense.type || 'expense',
    };
    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const updateExpense = useCallback((id, updates) => {
    setExpenses((prev) =>
      prev.map((expense) => (expense.id === id ? { ...expense, ...updates } : expense))
    );
  }, []);

  const addCategory = useCallback(
    (category, type = 'expense') => {
      if (type === 'income') {
        if (!incomeCategories.includes(category)) {
          setIncomeCategories((prev) => [...prev, category]);
        }
      } else {
        if (!expenseCategories.includes(category)) {
          setExpenseCategories((prev) => [...prev, category]);
        }
      }
    },
    [incomeCategories, expenseCategories]
  );

  const setBudget = useCallback((category, amount) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: amount,
    }));
  }, []);

  const getBudget = useCallback((category) => {
    return budgets[category] || 0;
  }, [budgets]);

  // Helper functions for Dashboard - FIXED to properly separate income and expenses
  const getTotalIncome = useCallback(() => {
    return expenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  const getTotalExpenses = useCallback(() => {
    return expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  const getBalance = useCallback(() => {
    return getTotalIncome() - getTotalExpenses();
  }, [getTotalIncome, getTotalExpenses]);

  const value = {
    expenses,
    addExpense,
    deleteExpense,
    updateExpense,
    categories: expenseCategories,
    expenseCategories,
    incomeCategories,
    addCategory,
    budgets,
    setBudget,
    getBudget,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};