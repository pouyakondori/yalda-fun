import { dishes } from '../data/dishes';
import type { SheetRow } from '../hooks/useGoogleSheet';

export interface ResultRow {
  name: string;
  partner: string;
  dishes: string;
}

export interface DishCount {
  dish: (typeof dishes)[number];
  count: number;
}

interface ColumnConfig {
  name: string;
  partner: string;
  dishes: string;
}

const normalizeToken = (value: string) => value.trim().toLowerCase();

export function summarizeResponses(rows: SheetRow[], columns: ColumnConfig) {
  const results: ResultRow[] = rows.map((row) => ({
    name: (row[columns.name] ?? '').trim(),
    partner: (row[columns.partner] ?? '').trim(),
    dishes: (row[columns.dishes] ?? '').trim(),
  }));

  const countsById = new Map<number, number>();
  dishes.forEach((dish) => countsById.set(dish.id, 0));

  results.forEach((row) => {
    row.dishes
      .split(/[,،\n]/)
      .map((token) => token.trim())
      .filter(Boolean)
      .forEach((value) => {
        const match = dishes.find(
          (dish) =>
            normalizeToken(dish.en) === normalizeToken(value) ||
            normalizeToken(dish.fa) === normalizeToken(value),
        );

        if (match) {
          countsById.set(match.id, (countsById.get(match.id) ?? 0) + 1);
        }
      });
  });

  const dishCounts: DishCount[] = dishes.map((dish) => ({
    dish,
    count: countsById.get(dish.id) ?? 0,
  }));

  const totalContributions = results.filter((row) => row.name).length;

  return { results, dishCounts, countsById, totalContributions };
}
