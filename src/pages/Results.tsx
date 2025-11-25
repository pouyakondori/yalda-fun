import { useMemo } from 'react';
import { dishes } from '../data/dishes';
import { buildSheetCsvUrl, googleSheetConfig } from '../config';
import { useGoogleSheet } from '../hooks/useGoogleSheet';

interface ResultRow {
  name: string;
  partner: string;
  dishes: string;
}

const normalizeToken = (value: string) => value.trim().toLowerCase();

export default function Results() {
  const csvUrl = buildSheetCsvUrl(googleSheetConfig.sheetId) ?? undefined;
  const { rows, loading, error } = useGoogleSheet(csvUrl);
  const { columns } = googleSheetConfig;

  const results: ResultRow[] = useMemo(
    () =>
      rows.map((row) => ({
        name: (row[columns.name] ?? '').trim(),
        partner: (row[columns.partner] ?? '').trim(),
        dishes: (row[columns.dishes] ?? '').trim(),
      })),
    [rows, columns],
  );

  const dishCounts = useMemo(() => {
    const counts = new Map<number, number>();
    dishes.forEach((dish) => counts.set(dish.id, 0));

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
            counts.set(match.id, (counts.get(match.id) ?? 0) + 1);
          }
        });
    });

    return dishes.map((dish) => ({
      dish,
      count: counts.get(dish.id) ?? 0,
    }));
  }, [results]);

  const totalContributions = results.filter((row) => row.name).length;
  const sheetConfigured = Boolean(csvUrl);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <header className="text-center space-y-2">
        <p className="text-rose-500 text-sm font-semibold uppercase tracking-wide">Yalda Party</p>
        <h1 className="text-3xl font-semibold text-gray-900">Live Potluck Board</h1>
        <p className="text-sm text-gray-600">
          Responses are synced directly from the Google Sheet that is backing the RSVP form.
        </p>
      </header>

      {!sheetConfigured && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-md p-4 text-sm">
          Google Sheet is not configured yet. Set <code>VITE_GOOGLE_SHEET_ID</code> in your
          environment to display live data.
        </div>
      )}

      {sheetConfigured && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wide">Total Contributions</p>
            <p className="text-3xl font-semibold text-gray-900 mt-1">{totalContributions}</p>
          </div>
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm font-medium mb-3">Dish Counts</p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {dishCounts.map(({ dish, count }) => (
                <div key={dish.id} className="flex justify-between text-gray-700 border-b border-gray-100 pb-1">
                  <dt>
                    {dish.en}{' '}
                    <span className="text-xs text-gray-500 block sm:inline">
                      {dish.fa}
                    </span>
                  </dt>
                  <dd className="font-medium text-gray-900">{count}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Household Responses</h2>
          <a className="text-sm text-rose-500 underline" href="/">
            Back to form
          </a>
        </div>

        {loading && <p className="px-4 py-6 text-sm text-gray-500">Loading sheet data...</p>}

        {error && (
          <p className="px-4 py-6 text-sm text-red-600">
            Something went wrong while loading the sheet: {error}
          </p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="border-b border-gray-200 px-4 py-2 text-gray-600">Name</th>
                  <th className="border-b border-gray-200 px-4 py-2 text-gray-600">Partner</th>
                  <th className="border-b border-gray-200 px-4 py-2 text-gray-600">Dishes</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                      No responses yet.
                    </td>
                  </tr>
                )}
                {results.map((row, index) => (
                  <tr key={`${row.name}-${index}`} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b border-gray-100 text-gray-900">{row.name || '—'}</td>
                    <td className="px-4 py-2 border-b border-gray-100 text-gray-700">
                      {row.partner || <span className="text-gray-400">No partner</span>}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-100 text-gray-700">
                      {row.dishes || <span className="text-gray-400">Not specified</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
