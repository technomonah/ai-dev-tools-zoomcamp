import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, User, LogOut } from 'lucide-react';
import {
  MonthSummary,
  Month,
  Balance,
  Analytics as AnalyticsData,
  getMonths,
  getMonth,
  getBalance,
  getAnalytics
} from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import LeprecoinLogo from '../components/LeprecoinLogo';
import MonthSelector from '../components/MonthSelector';
import IncomeEditor from '../components/IncomeEditor';
import FixedExpensesEditor from '../components/FixedExpensesEditor';
import SavingsEditor from '../components/SavingsEditor';
import DailyExpenses from '../components/DailyExpenses';
import BalanceDisplay from '../components/BalanceDisplay';
import Analytics from '../components/Analytics';
import DailyBalanceTable from '../components/DailyBalanceTable';

type TabType = 'overview' | 'expenses';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [months, setMonths] = useState<MonthSummary[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<MonthSummary | null>(null);
  const [monthData, setMonthData] = useState<Month | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const fetchMonths = useCallback(async () => {
    try {
      const response = await getMonths();
      setMonths(response.data);
      if (response.data.length > 0 && !selectedMonth) {
        setSelectedMonth(response.data[0]);
      } else if (response.data.length === 0) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching months:', error);
      setLoading(false);
    }
  }, [selectedMonth]);

  const fetchMonthData = useCallback(async () => {
    if (!selectedMonth) return;
    try {
      const [monthResponse, balanceResponse, analyticsResponse] = await Promise.all([
        getMonth(selectedMonth.id),
        getBalance(selectedMonth.id),
        getAnalytics(selectedMonth.id)
      ]);
      setMonthData(monthResponse.data);
      setBalance(balanceResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error fetching month data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchMonths();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      setLoading(true);
      fetchMonthData();
    }
  }, [selectedMonth, fetchMonthData]);

  const handleUpdate = () => {
    fetchMonthData();
  };

  const handleMonthCreated = async () => {
    const response = await getMonths();
    setMonths(response.data);
    if (response.data.length > 0) {
      setSelectedMonth(response.data[0]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading && !monthData) {
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LeprecoinLogo size={40} />
            <h1 className="text-3xl font-bold text-primary">
              Leprecoin
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors"
            >
              <User size={18} />
              <span className="hidden sm:inline">{user?.email}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-text-secondary hover:text-expense transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <MonthSelector
          months={months}
          selectedMonth={selectedMonth}
          onSelect={setSelectedMonth}
          onMonthCreated={handleMonthCreated}
        />

        {monthData && (
          <>
            {/* Tab Navigation */}
            <div className="tab-pills inline-flex mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={activeTab === 'overview' ? 'tab-pill-active' : 'tab-pill hover:bg-gray-50'}
              >
                <LayoutDashboard size={18} className="inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={activeTab === 'expenses' ? 'tab-pill-active' : 'tab-pill hover:bg-gray-50'}
              >
                <Receipt size={18} className="inline mr-2" />
                Daily Expenses
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                <div className="space-y-6">
                  <IncomeEditor
                    monthId={monthData.id}
                    incomes={monthData.incomes}
                    onUpdate={handleUpdate}
                  />
                  <FixedExpensesEditor
                    monthId={monthData.id}
                    expenses={monthData.fixed_expenses}
                    onUpdate={handleUpdate}
                  />
                  <SavingsEditor
                    monthId={monthData.id}
                    savingsPercent={monthData.savings_percent}
                    totalIncome={monthData.incomes.reduce((sum, i) => sum + i.amount, 0)}
                    onUpdate={handleUpdate}
                  />
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BalanceDisplay balance={balance} />
                    <Analytics analytics={analytics} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                <DailyExpenses
                  monthId={monthData.id}
                  expenses={monthData.daily_expenses}
                  onUpdate={handleUpdate}
                />
                <DailyBalanceTable balance={balance} />
              </div>
            )}
          </>
        )}

        {!monthData && months.length === 0 && (
          <div className="text-center py-12">
            <LeprecoinLogo size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary mb-4">
              Create your first month to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
