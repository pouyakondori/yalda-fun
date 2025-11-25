import { useEffect, useState } from 'react';

export interface SheetRow {
  [key: string]: string | undefined;
}

type AppsScriptResponse = (string | number | boolean | null)[][];

const toString = (value: string | number | boolean | null | undefined) =>
  typeof value === 'string' ? value : value == null ? '' : String(value);

export function useGoogleSheet(endpoint?: string) {
  const [rows, setRows] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint) {
      setRows([]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(endpoint, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to load responses');
        }
        return res.json() as Promise<AppsScriptResponse>;
      })
      .then((matrix) => {
        if (!isMounted) {
          return;
        }
        if (!Array.isArray(matrix) || matrix.length === 0) {
          setRows([]);
          return;
        }

        const [headerRow, ...dataRows] = matrix;
        const headers = headerRow.map((cell, index) => {
          const label = toString(cell).trim();
          return label || `Column ${index + 1}`;
        });

        const parsed = dataRows.map((row) => {
          const entry: SheetRow = {};
          headers.forEach((header, index) => {
            entry[header] = toString(row[index]);
          });
          return entry;
        });

        setRows(parsed);
      })
      .catch((err: Error) => {
        if (!isMounted) {
          return;
        }
        setError(err.message);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { rows, loading, error };
}
