import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export interface SheetRow {
  [key: string]: string | undefined;
}

export function useGoogleSheet(csvUrl?: string) {
  const [rows, setRows] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!csvUrl) {
      setRows([]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(csvUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to load responses');
        }
        return res.text();
      })
      .then((text) => {
        if (!isMounted) {
          return;
        }

        const parsed = Papa.parse<SheetRow>(text, {
          header: true,
          skipEmptyLines: true,
        });

        setRows(parsed.data);
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
  }, [csvUrl]);

  return { rows, loading, error };
}
