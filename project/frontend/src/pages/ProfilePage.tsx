import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Tags, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LeprecoinLogo from '../components/LeprecoinLogo';
import api from '../api/client';

interface ProfileCategory {
  id: number;
  name: string;
  keywords: string;
  is_default: boolean;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ProfileCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get<ProfileCategory[]>('/api/profile/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newKeywords.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await api.post('/api/profile/categories', {
        name: newName.trim(),
        keywords: newKeywords.trim()
      });
      setNewName('');
      setNewKeywords('');
      setError('');
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create category');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim() || !editKeywords.trim()) {
      return;
    }

    try {
      await api.put(`/api/profile/categories/${id}`, {
        name: editName.trim(),
        keywords: editKeywords.trim()
      });
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      console.error('Error updating category:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/profile/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      console.error('Error deleting category:', err);
    }
  };

  const startEdit = (category: ProfileCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditKeywords(category.keywords);
  };

  const userCategories = categories.filter(c => !c.is_default);
  const defaultCategories = categories.filter(c => c.is_default);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <LeprecoinLogo size={48} className="animate-pulse" />
          <span className="text-xl text-text-secondary">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-text-secondary" />
          </Link>
          <div className="flex items-center gap-3">
            <LeprecoinLogo size={40} />
            <h1 className="text-3xl font-bold text-primary">Profile</h1>
          </div>
        </div>

        {/* User Info */}
        <div className="card p-6 mb-6">
          <h2 className="section-title mb-4">
            <User size={20} className="text-primary" />
            Account
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-text-secondary">Registered user</p>
            </div>
          </div>
        </div>

        {/* Custom Categories */}
        <div className="card p-6 mb-6">
          <h2 className="section-title mb-4">
            <Tags size={20} className="text-primary" />
            My Categories
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-card mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Add New Category */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4 p-4 bg-gray-50 rounded-card">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="input flex-1"
            />
            <input
              value={newKeywords}
              onChange={(e) => setNewKeywords(e.target.value)}
              placeholder="Keywords (comma-separated)"
              className="input flex-[2]"
            />
            <button onClick={handleAdd} className="btn-gold">
              <Plus size={18} />
              Add
            </button>
          </div>

          {/* User Categories List */}
          {userCategories.length === 0 ? (
            <p className="text-text-secondary text-center py-4">
              No custom categories yet. Add one above!
            </p>
          ) : (
            <div className="space-y-2">
              {userCategories.map(category => (
                <div
                  key={category.id}
                  className="group flex items-center gap-2 p-3 rounded-card hover:bg-gray-50 transition-colors"
                >
                  {editingId === category.id ? (
                    <>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input py-1 flex-1"
                      />
                      <input
                        value={editKeywords}
                        onChange={(e) => setEditKeywords(e.target.value)}
                        className="input py-1 flex-[2]"
                      />
                      <button
                        onClick={() => handleUpdate(category.id)}
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
                      <span className="font-medium flex-1">{category.name}</span>
                      <span className="text-sm text-text-secondary flex-[2] truncate">
                        {category.keywords}
                      </span>
                      <button
                        onClick={() => startEdit(category)}
                        className="btn-icon opacity-0 group-hover:opacity-100"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn-icon opacity-0 group-hover:opacity-100 hover:text-expense hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Default Categories */}
        <div className="card p-6">
          <h2 className="section-title mb-4">
            <Tags size={20} className="text-text-secondary" />
            Default Categories
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            These categories are available to all users and cannot be edited.
          </p>
          <div className="space-y-2">
            {defaultCategories.map(category => (
              <div
                key={category.id}
                className="flex items-center gap-2 p-3 rounded-card bg-gray-50"
              >
                <span className="font-medium flex-1">{category.name}</span>
                <span className="text-sm text-text-secondary flex-[2] truncate">
                  {category.keywords}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
