import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { MonthSummary, createMonth } from '../api/client';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface Props {
  months: MonthSummary[];
  selectedMonth: MonthSummary | null;
  onSelect: (month: MonthSummary) => void;
  onMonthCreated: () => void;
}

export default function MonthSelector({ months, selectedMonth, onSelect, onMonthCreated }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newMonth, setNewMonth] = useState(new Date().getMonth() + 1);

  const handleCreate = async () => {
    try {
      await createMonth(newYear, newMonth);
      onMonthCreated();
      setShowCreate(false);
    } catch (error) {
      console.error('Error creating month:', error);
    }
  };

  const handlePrev = () => {
    if (!selectedMonth || months.length === 0) return;
    const currentIndex = months.findIndex(m => m.id === selectedMonth.id);
    if (currentIndex < months.length - 1) {
      onSelect(months[currentIndex + 1]);
    }
  };

  const handleNext = () => {
    if (!selectedMonth || months.length === 0) return;
    const currentIndex = months.findIndex(m => m.id === selectedMonth.id);
    if (currentIndex > 0) {
      onSelect(months[currentIndex - 1]);
    }
  };

  const isPrevDisabled = !selectedMonth || months.findIndex(m => m.id === selectedMonth.id) === months.length - 1;
  const isNextDisabled = !selectedMonth || months.findIndex(m => m.id === selectedMonth.id) === 0;

  return (
    <div className="card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={isPrevDisabled}
            className="btn-icon disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <select
              value={selectedMonth?.id || ''}
              onChange={(e) => {
                const month = months.find(m => m.id === Number(e.target.value));
                if (month) onSelect(month);
              }}
              className="input pl-10 pr-4 py-2 text-lg font-medium w-auto min-w-[200px] cursor-pointer"
            >
              {months.map(m => (
                <option key={m.id} value={m.id}>
                  {MONTH_NAMES[m.month - 1]} {m.year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="btn-icon disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn-gold"
        >
          <Plus size={18} />
          New Month
        </button>
      </div>

      {showCreate && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 animate-slide-up">
          <select
            value={newMonth}
            onChange={(e) => setNewMonth(Number(e.target.value))}
            className="input w-auto"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>

          <input
            type="number"
            value={newYear}
            onChange={(e) => setNewYear(Number(e.target.value))}
            className="input w-24"
          />

          <button
            onClick={handleCreate}
            className="btn-primary"
          >
            Create
          </button>

          <button
            onClick={() => setShowCreate(false)}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
