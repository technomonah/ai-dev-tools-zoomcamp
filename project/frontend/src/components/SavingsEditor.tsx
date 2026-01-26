import { useState, useEffect, useRef } from 'react';
import { PiggyBank } from 'lucide-react';
import { updateMonth } from '../api/client';

interface Props {
  monthId: number;
  savingsPercent: number;
  totalIncome: number;
  onUpdate: () => void;
}

export default function SavingsEditor({ monthId, savingsPercent, totalIncome, onUpdate }: Props) {
  const [percent, setPercent] = useState(savingsPercent);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setPercent(savingsPercent);
  }, [savingsPercent]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (percent === savingsPercent) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await updateMonth(monthId, { savings_percent: percent });
        onUpdate();
      } catch (error) {
        console.error('Error updating savings:', error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [percent, monthId, onUpdate, savingsPercent]);

  const savingsAmount = totalIncome * (percent / 100);

  return (
    <div className="card p-5">
      <h2 className="section-title mb-4">
        <PiggyBank size={20} className="text-savings" />
        Savings
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="range"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            min="0"
            max="100"
            className="range-slider flex-1"
          />
          <div className="flex items-center gap-1 min-w-[80px]">
            <input
              type="number"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              min="0"
              max="100"
              className="input w-16 text-center py-1"
            />
            <span className="text-text-secondary">%</span>
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-savings to-blue-400 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-semibold">
        <span className="text-text-secondary">To deposit</span>
        <span className="text-savings">{savingsAmount.toLocaleString()}</span>
      </div>
    </div>
  );
}
