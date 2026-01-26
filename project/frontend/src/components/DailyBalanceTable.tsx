import { CalendarDays } from 'lucide-react';
import { Balance, DailyBalance } from '../api/client';

interface Props {
  balance: Balance | null;
}

export default function DailyBalanceTable({ balance }: Props) {
  if (!balance || !balance.daily_balances || balance.daily_balances.length === 0) {
    return (
      <div className="card p-5">
        <h2 className="section-title mb-4">
          <CalendarDays size={20} className="text-text-secondary" />
          Daily Balance
        </h2>
        <p className="text-text-secondary text-center py-8">No data available</p>
      </div>
    );
  }

  const today = new Date();
  const currentDay = today.getDate();

  return (
    <div className="card p-5">
      <h2 className="section-title mb-4">
        <CalendarDays size={20} className="text-text-secondary" />
        Daily Balance
      </h2>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2 text-left text-text-secondary font-medium">Date</th>
              <th className="px-3 py-2 text-right text-text-secondary font-medium">Spent</th>
              <th className="px-3 py-2 text-right text-text-secondary font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {balance.daily_balances.map((day: DailyBalance, index: number) => {
              const isToday = day.day === currentDay;
              const isPositive = day.balance >= 0;

              return (
                <tr
                  key={day.day}
                  className={`
                    border-b border-gray-50 transition-colors
                    ${isToday ? 'bg-gold/5' : index % 2 === 0 ? 'bg-gray-50/50' : ''}
                    hover:bg-gray-50
                  `}
                >
                  <td className={`px-3 py-2 relative ${isToday ? 'font-medium' : ''}`}>
                    {isToday && (
                      <div className="absolute left-0 top-1 bottom-1 w-1 bg-gold rounded-r" />
                    )}
                    <span className={isToday ? 'pl-2' : ''}>
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-text-secondary">
                    {day.spent > 0 ? day.spent.toLocaleString() : '-'}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-medium ${
                      isPositive ? 'text-income' : 'text-expense'
                    }`}
                  >
                    {isPositive ? '+' : ''}{Math.round(day.balance).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
