import { useState } from 'react';
import { TrendingUp, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Income, createIncome, updateIncome, deleteIncome } from '../api/client';

interface Props {
  monthId: number;
  incomes: Income[];
  onUpdate: () => void;
}

export default function IncomeEditor({ monthId, incomes, onUpdate }: Props) {
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const handleAdd = async () => {
    if (!newName || !newAmount) return;
    try {
      await createIncome(monthId, newName, Number(newAmount));
      setNewName('');
      setNewAmount('');
      onUpdate();
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateIncome(id, { name: editName, amount: Number(editAmount) });
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error('Error updating income:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteIncome(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const startEdit = (income: Income) => {
    setEditingId(income.id);
    setEditName(income.name);
    setEditAmount(String(income.amount));
  };

  const total = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="card p-5">
      <h2 className="section-title mb-4">
        <TrendingUp size={20} className="text-income" />
        Income
      </h2>

      <div className="space-y-2 mb-4">
        {incomes.map(income => (
          <div
            key={income.id}
            className="group flex items-center gap-2 p-2 -mx-2 rounded-button hover:bg-gray-50 transition-colors"
          >
            {editingId === income.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input flex-1"
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="input w-28"
                />
                <button
                  onClick={() => handleUpdate(income.id)}
                  className="btn-icon text-income hover:bg-green-50"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="btn-icon"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-text">{income.name}</span>
                <span className="font-medium w-28 text-right text-income">
                  {income.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => startEdit(income)}
                  className="btn-icon opacity-0 group-hover:opacity-100"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(income.id)}
                  className="btn-icon opacity-0 group-hover:opacity-100 hover:text-expense hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Name"
          className="input flex-1"
        />
        <input
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="Amount"
          className="input w-28"
        />
        <button
          onClick={handleAdd}
          className="btn-primary"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-semibold">
        <span className="text-text-secondary">Total</span>
        <span className="text-income">{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
