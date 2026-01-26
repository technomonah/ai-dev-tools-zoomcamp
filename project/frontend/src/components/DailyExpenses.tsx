import { useState, useEffect } from 'react';
import { Calendar, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import {
  DailyExpense,
  createDailyExpense,
  updateDailyExpense,
  deleteDailyExpense,
  detectCategory,
  getCategories,
  Category
} from '../api/client';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Groceries': { bg: 'bg-green-100', text: 'text-green-700' },
  'Food Delivery': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'Taxi': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Subscriptions': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Pharmacy': { bg: 'bg-red-100', text: 'text-red-700' },
  'Entertainment': { bg: 'bg-pink-100', text: 'text-pink-700' },
  'Clothing': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Pets': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Transport': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'Phone': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'Other': { bg: 'bg-gray-100', text: 'text-gray-700' },
};

interface Props {
  monthId: number;
  expenses: DailyExpense[];
  onUpdate: () => void;
}

export default function DailyExpenses({ monthId, expenses, onUpdate }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [categories, setCategories] = useState<string[]>([]);
  const [newDate, setNewDate] = useState(today);
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const categoryNames = response.data.map((c: Category) => c.name);
        setCategories(categoryNames);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['Groceries', 'Food Delivery', 'Taxi', 'Subscriptions', 'Pharmacy', 'Entertainment', 'Clothing', 'Pets', 'Transport', 'Phone', 'Other']);
      }
    };
    fetchCategories();
  }, []);

  const handleDescriptionBlur = async () => {
    if (newDescription && !newCategory) {
      try {
        const response = await detectCategory(newDescription);
        setNewCategory(response.data.category);
      } catch (error) {
        console.error('Error detecting category:', error);
      }
    }
  };

  const handleAdd = async () => {
    if (!newDate || !newDescription || !newAmount) return;
    try {
      await createDailyExpense(
        monthId,
        newDate,
        newDescription,
        Number(newAmount),
        newCategory || undefined
      );
      setNewDescription('');
      setNewAmount('');
      setNewCategory('');
      onUpdate();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateDailyExpense(id, {
        date: editDate,
        description: editDescription,
        amount: Number(editAmount),
        category: editCategory
      });
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDailyExpense(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const startEdit = (expense: DailyExpense) => {
    setEditingId(expense.id);
    setEditDate(expense.date);
    setEditDescription(expense.description);
    setEditAmount(String(expense.amount));
    setEditCategory(expense.category);
  };

  const groupedByDate = expenses.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = [];
    }
    acc[expense.date].push(expense);
    return acc;
  }, {} as Record<string, DailyExpense[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const getCategoryStyle = (category: string) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
  };

  return (
    <div className="card p-5">
      <h2 className="section-title mb-4">
        <Calendar size={20} className="text-daily" />
        Daily Expenses
      </h2>

      <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-gray-100 pb-4">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="input w-auto"
        />
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          placeholder="Description"
          className="input flex-1 min-w-[200px]"
        />
        <input
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="Amount"
          className="input w-24"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="input w-auto"
        >
          <option value="">Auto</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="btn-gold"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {sortedDates.map(date => (
          <div key={date} className="animate-fade-in">
            <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <Calendar size={14} />
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </h3>
            <div className="space-y-1">
              {groupedByDate[date].map(expense => (
                <div
                  key={expense.id}
                  className="group flex items-center gap-2 p-2 -mx-2 rounded-button hover:bg-gray-50 transition-colors text-sm"
                >
                  {editingId === expense.id ? (
                    <>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="input py-1 w-32"
                      />
                      <input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="input py-1 flex-1"
                      />
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="input py-1 w-20"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="input py-1 w-auto"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleUpdate(expense.id)}
                        className="btn-icon text-income hover:bg-green-50"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-icon"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-text">{expense.description}</span>
                      <span className={`category-tag ${getCategoryStyle(expense.category).bg} ${getCategoryStyle(expense.category).text}`}>
                        {expense.category}
                      </span>
                      <span className="font-medium w-20 text-right text-daily">
                        {expense.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => startEdit(expense)}
                        className="btn-icon opacity-0 group-hover:opacity-100"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="btn-icon opacity-0 group-hover:opacity-100 hover:text-expense hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
