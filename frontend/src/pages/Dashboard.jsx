import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiLogOut, FiPlus, FiTrash2, FiEdit,  FiPieChart } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byCategory: {}, count: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: '',
    description: '',
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const pieData = Object.entries(summary.byCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += expense.amount;
    return acc;
  }, {});

  const barData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch {
      toast.error('Failed to fetch expenses');
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses/summary');
      setSummary(response.data);
    } catch {
      toast.error('Failed to fetch summary');
    }
  };

  useEffect(() => {
    (async () => {
      await fetchExpenses();
      await fetchSummary();
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await axios.put(`http://localhost:5000/api/expenses/${editingExpense._id}`, formData);
        toast.success('Expense updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/expenses', formData);
        toast.success('Expense added successfully');
      }
      setFormData({ title: '', amount: '', category: 'Food', date: '', description: '' });
      setShowAddForm(false);
      setEditingExpense(null);
      fetchExpenses();
      fetchSummary();
    } catch {
      toast.error('Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`http://localhost:5000/api/expenses/${id}`);
        toast.success('Expense deleted successfully');
        fetchExpenses();
        fetchSummary();
      } catch {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? expense.date.split('T')[0] : '',
      description: expense.description,
    });
    setShowAddForm(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/*<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <FiPieChart className="text-white text-xl" />
          </div>*/}
          <h1 className="text-2xl font-bold text-white">Expense Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/80">Welcome, {user?.username}</span>
        </div>
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 ml-auto bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            <FiLogOut /> Logout
          </button>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              {/* <div className="bg-blue-500/20 p-2 rounded-lg">
                <FiDollarSign className="text-blue-400 text-xl" />
              </div> */}
              <h3 className="text-white/70 text-sm">Total Expenses</h3>
            </div>
            <p className="text-4xl font-bold text-white">&#8377;{summary.total.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              {/*<div className="bg-green-500/20 p-2 rounded-lg">
                <FiTrendingUp className="text-green-400 text-xl" />
              </div>*/}
              <h3 className="text-white/70 text-sm">Total Transactions</h3>
            </div>
            <p className="text-4xl font-bold text-white">{summary.count}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              {/*<div className="bg-purple-500/20 p-2 rounded-lg">
                <FiPieChart className="text-purple-400 text-xl" />
              </div>*/}
              <h3 className="text-white/70 text-sm">Categories</h3>
            </div>
            <p className="text-4xl font-bold text-white">{Object.keys(summary.byCategory).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">Expenses by Category</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px', border: 'none' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-white/50">
                No data to display
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">Monthly Spending</h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.7)" />
                  <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px', border: 'none' }} />
                  <Bar dataKey="amount" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" />
                      <stop offset="95%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-white/50">
                No data to display
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Expenses</h2>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingExpense(null);
              setFormData({ title: '', amount: '', category: 'Food', date: '', description: '' });
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            <FiPlus /> {showAddForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-2">Title: </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50"
                  placeholder="Enter expense title"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Amount: </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Category: </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-800">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-2">Date: </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/80 mb-2">Description: </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50"
                  rows="2"
                  placeholder="Add a description (optional)"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg font-semibold"
                >
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {expenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-medium text-white">{expense.title}</div>
                    <div className="text-sm text-white/60">{expense.description}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-bold text-green-400">&#8377;{expense.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-white/60">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-400 hover:text-blue-300 mr-4 transition-colors"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-white/50">
                    <div className="flex flex-col items-center">
                      <FiPieChart className="text-4xl mb-2 opacity-50" />
                      <p>No expenses yet. Add your first expense!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
