import { useState } from 'react';
import { generateSeats, Seat } from '../data/mockData';

interface SeatSelectionProps {
  onSeatSelect: (seatId: string | null) => void;
  selectedSeat: string | null;
}

export function SeatSelection({ onSeatSelect, selectedSeat }: SeatSelectionProps) {
  const [seats] = useState<Seat[]>(generateSeats());

  const getSeatColor = (seat: Seat) => {
    if (seat.id === selectedSeat) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    if (seat.status === 'occupied') {
      return 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed border-gray-300 dark:border-gray-700';
    }

    switch (seat.type) {
      case 'first':
        return 'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30';
      case 'business':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30';
      case 'premium':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30';
      default:
        return 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    onSeatSelect(seat.id === selectedSeat ? null : seat.id);
  };

  const rows = Array.from(new Set(seats.map(s => s.row))).sort((a, b) => a - b);
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Economy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Business</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">First Class</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Occupied</span>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 overflow-x-auto">
        <div className="mb-4 text-center">
          <div className="inline-block px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-t-xl text-sm font-medium text-gray-700 dark:text-gray-300">
            Front of Aircraft
          </div>
        </div>

        <div className="flex gap-2 mb-2 justify-center">
          <div className="w-8"></div>
          {columns.map(col => (
            <div key={col} className="w-10 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              {col}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {rows.map(row => (
            <div key={row} className="flex gap-2 justify-center items-center">
              <div className="w-8 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">
                {row}
              </div>
              {columns.map((col, idx) => {
                const seat = seats.find(s => s.row === row && s.column === col);
                if (!seat) return <div key={col} className="w-10"></div>;

                return (
                  <div key={seat.id} className="relative">
                    <button
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === 'occupied'}
                      className={`w-10 h-10 rounded-lg border-2 text-xs font-semibold transition-all ${getSeatColor(seat)}`}
                      title={`${seat.id} - ${seat.type}${seat.isExit ? ' (Exit)' : ''}${seat.price > 0 ? ` +$${seat.price}` : ''}`}
                    >
                      {seat.id}
                    </button>
                    {seat.isExit && (
                      <div className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    )}
                  </div>
                );
              })}
              <div className="w-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                {row}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSeat && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-900 dark:text-blue-300">Selected Seat: {selectedSeat}</div>
              <div className="text-sm text-blue-700 dark:text-blue-400">
                {seats.find(s => s.id === selectedSeat)?.type.charAt(0).toUpperCase()}
                {seats.find(s => s.id === selectedSeat)?.type.slice(1)} Class
                {seats.find(s => s.id === selectedSeat)?.isExit && ' (Exit Row)'}
              </div>
            </div>
            {seats.find(s => s.id === selectedSeat)?.price ? (
              <div className="text-lg font-bold text-blue-900 dark:text-blue-300">
                +${seats.find(s => s.id === selectedSeat)?.price}
              </div>
            ) : (
              <div className="text-lg font-bold text-green-600 dark:text-green-400">Free</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
