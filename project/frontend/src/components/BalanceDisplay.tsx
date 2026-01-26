import { Wallet, TrendingUp, TrendingDown, PiggyBank, CalendarDays, Target, CreditCard } from 'lucide-react';
import { Balance } from '../api/client';

interface Props {
  balance: Balance | null;
}

export default function BalanceDisplay({ balance }: Props) {
  if (!balance) return null;

  const isPositive = balance.balance >= 0;

  return (
    <div className="card p-5">
      <h2 className="section-title mb-4">
        <Wallet size={20} className="text-primary" />
        Balance
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-50 rounded-button">
            <TrendingUp size={16} className="text-income" />
          </div>
          <div>
            <p className="data-label">Income</p>
            <p className="data-value text-income">
              {balance.total_income.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-50 rounded-button">
            <TrendingDown size={16} className="text-expense" />
          </div>
          <div>
            <p className="data-label">Fixed Expenses</p>
            <p className="data-value text-expense">
              {balance.total_fixed_expenses.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-button">
            <PiggyBank size={16} className="text-savings" />
          </div>
          <div>
            <p className="data-label">Savings</p>
            <p className="data-value text-savings">
              {balance.savings_amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-50 rounded-button">
            <Target size={16} className="text-text-secondary" />
          </div>
          <div>
            <p className="data-label">Available Budget</p>
            <p className="data-value">
              {balance.available_budget.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="data-label flex items-center gap-2">
            <CalendarDays size={14} />
            Daily budget
          </span>
          <span className="data-value">{Math.round(balance.daily_budget).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="data-label">Day of month</span>
          <span className="data-value">{balance.current_day} / {balance.days_in_month}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="data-label">Can spend</span>
          <span className="data-value">{Math.round(balance.expected_spent).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="data-label flex items-center gap-2">
            <CreditCard size={14} />
            Spent
          </span>
          <span className="data-value">{Math.round(balance.actual_spent).toLocaleString()}</span>
        </div>
      </div>

      <div
        className={`mt-4 p-4 rounded-card text-center ${
          isPositive
            ? 'bg-gradient-to-br from-green-50 to-green-100'
            : 'bg-gradient-to-br from-red-50 to-red-100'
        }`}
      >
        <p className="data-label mb-1">Balance</p>
        <p
          className={`text-3xl font-bold ${
            isPositive ? 'text-income' : 'text-expense'
          }`}
        >
          {isPositive ? '+' : ''}{Math.round(balance.balance).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
