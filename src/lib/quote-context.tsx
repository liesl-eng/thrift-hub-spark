import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Sku } from "./catalog-types";

export interface QuoteItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  msrp: number;
  maxUnits: number;
  qty: number;
}

interface QuoteContextValue {
  items: QuoteItem[];
  add: (sku: Sku, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalUnits: number;
  totalPrice: number;
  totalRetail: number;
  hydrated: boolean;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);
const STORAGE_KEY = "goodwill-quote-v2";

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const add = useCallback((sku: Sku, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === sku.id);
      if (existing) {
        const next = Math.min(existing.qty + qty, sku.units || 9999);
        return prev.map((i) => (i.id === sku.id ? { ...i, qty: next } : i));
      }
      return [
        ...prev,
        {
          id: sku.id,
          name: sku.name,
          brand: sku.brand,
          category: sku.category,
          image: sku.image,
          price: sku.price,
          msrp: sku.msrp,
          maxUnits: sku.units,
          qty: Math.min(qty, sku.units || 9999),
        },
      ];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, qty: Math.max(0, Math.min(qty, i.maxUnits || 9999)) }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { totalUnits, totalPrice, totalRetail } = useMemo(() => {
    let units = 0;
    let price = 0;
    let retail = 0;
    for (const item of items) {
      units += item.qty;
      price += item.qty * item.price;
      retail += item.qty * item.msrp;
    }
    return { totalUnits: units, totalPrice: price, totalRetail: retail };
  }, [items]);

  const value: QuoteContextValue = {
    items,
    add,
    setQty,
    remove,
    clear,
    totalUnits,
    totalPrice,
    totalRetail,
    hydrated,
  };

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider");
  return ctx;
}
