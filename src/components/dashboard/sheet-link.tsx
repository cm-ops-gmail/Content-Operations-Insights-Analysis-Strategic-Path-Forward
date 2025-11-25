"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet as SheetIcon } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function SheetLink() {
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSheetUrl() {
      try {
        const response = await fetch('/api/sheet-url');
        if (response.ok) {
          const data = await response.json();
          setSheetUrl(data.url);
        }
      } catch (error) {
        console.error("Failed to fetch sheet URL", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSheetUrl();
  }, []);

  if (loading) {
    return <Skeleton className="h-9 w-20" />;
  }

  if (!sheetUrl) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(sheetUrl, '_blank')}
    >
      <SheetIcon className="mr-2 h-4 w-4" />
      Sheet
    </Button>
  );
}
