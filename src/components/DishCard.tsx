import type { Dish } from '../data/dishes';

interface DishCardProps {
  dish: Dish;
  checked: boolean;
  onToggle: (dishId: number) => void;
  disabled?: boolean;
  count?: number;
  limit?: number;
}

export function DishCard({ dish, checked, onToggle, disabled, count, limit }: DishCardProps) {
  const inputId = `dish-${dish.id}`;

  return (
    <label
      htmlFor={inputId}
      className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
        disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:bg-gray-50 cursor-pointer'
      }`}
    >
      <input
        id={inputId}
        type="checkbox"
        className="mt-1 w-4 h-4 accent-rose-500"
        checked={checked}
        disabled={disabled}
        onChange={() => onToggle(dish.id)}
      />
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-900">{dish.en}</div>
        <div className="text-xs text-gray-600">{dish.fa}</div>
        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
          {typeof limit === 'number' ? (
            <>
              <span>
                {count ?? 0} / {limit} sign-ups
              </span>
              {disabled && <span className="text-rose-600 font-semibold uppercase text-[11px]">Full</span>}
            </>
          ) : (
            <span>{count ?? 0} households</span>
          )}
        </div>
      </div>
    </label>
  );
}
