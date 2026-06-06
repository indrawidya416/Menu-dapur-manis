import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem } from "@/lib/data";

export interface CartLine {
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  totalQty: number;
  totalPrice: number;
  add: (item: MenuItem) => void;
  increment: (name: string) => void;
  decrement: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const found = prev.find((l) => l.name === item.name);
      if (found) {
        return prev.map((l) =>
          l.name === item.name ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [
        ...prev,
        { name: item.name, price: item.price, image: item.image, qty: 1 },
      ];
    });
    setIsOpen(true);
  }, []);

  const increment = useCallback((name: string) => {
    setLines((prev) =>
      prev.map((l) => (l.name === name ? { ...l, qty: l.qty + 1 } : l)),
    );
  }, []);

  const decrement = useCallback((name: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.name === name ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((name: string) => {
    setLines((prev) => prev.filter((l) => l.name !== name));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const totalQty = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines],
  );
  const totalPrice = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty * l.price, 0),
    [lines],
  );

  const value: CartContextValue = {
    lines,
    isOpen,
    totalQty,
    totalPrice,
    add,
    increment,
    decrement,
    remove,
    clear,
    open,
    close,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
