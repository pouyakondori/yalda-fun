import type { Dish } from '../data/dishes';

interface DishCardProps {
  dish: Dish;
  checked: boolean;
  onToggle: (dishId: number) => void;
}

export function DishCard({ dish, checked, onToggle }: DishCardProps) {
  const inputId = `dish-${dish.id}`;

  return (
    <label
      htmlFor={inputId}
      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <input
        id={inputId}
        type="checkbox"
        className="mt-1 w-4 h-4 accent-rose-500"
        checked={checked}
        onChange={() => onToggle(dish.id)}
      />
      <div>
        <div className="font-medium text-sm text-gray-900">{dish.en}</div>
        <div className="text-xs text-gray-600">{dish.fa}</div>
        {dish.capacity && (
          <div className="text-xs text-gray-500 mt-0.5">Max suggested: {dish.capacity}</div>
        )}
      </div>
    </label>
  );
}
