import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

type CartState = {
  owner: string | null;
  items: CartItem[];
  carts: Record<string, CartItem[]>;
  setOwner: (owner: string | null) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  decreaseItem: (id: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      owner: null,
      items: [],
      carts: {},
      setOwner: (owner) =>
        set((state) => {
          const carts = { ...state.carts };
          if (state.owner) carts[state.owner] = state.items;
          return { owner, items: owner ? (carts[owner] ?? []) : [], carts };
        }),
      addItem: (item) =>
        set((state) => {
          if (!state.owner) return state;
          const found = state.items.find((product) => product.id === item.id);
          const items = found
            ? state.items.map((product) =>
                product.id === item.id
                  ? { ...product, quantity: product.quantity + 1 }
                  : product,
              )
            : [...state.items, { ...item, quantity: 1 }];
          return { items, carts: { ...state.carts, [state.owner]: items } };
        }),
      decreaseItem: (id) =>
        set((state) => {
          if (!state.owner) return state;
          const items = state.items.flatMap((item) =>
            item.id === id
              ? item.quantity > 1
                ? [{ ...item, quantity: item.quantity - 1 }]
                : []
              : [item],
          );
          return { items, carts: { ...state.carts, [state.owner]: items } };
        }),
      removeItem: (id) =>
        set((state) => {
          if (!state.owner) return state;
          const items = state.items.filter((item) => item.id !== id);
          return { items, carts: { ...state.carts, [state.owner]: items } };
        }),
      clear: () =>
        set((state) =>
          state.owner
            ? { items: [], carts: { ...state.carts, [state.owner]: [] } }
            : state,
        ),
    }),
    { name: "nordic-cart" },
  ),
);
