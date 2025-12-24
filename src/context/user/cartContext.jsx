'use client';
import useSWR, { KeyedMutator } from "swr";
import React, { createContext, useContext, useMemo } from "react";
import axios, { AxiosError } from "axios";

// interface ItemData {
//     item_id: number;
//     quantity: number;
//     product_name: string;
//     image_path: string;
//     base_price: number;
//     size: string;
//     max_stock: number;
//     total_item_price: number;
// }

// interface CartData {
//     items: ItemData[];
//     summary: {
//         total_cart_items: number;
//         total_cart_price: number;
//     }
// }

// interface CartContextType {
//     cartData: CartData | undefined;
//     cartError: AxiosError | undefined;
//     cartIsLoading: boolean;
//     mutateCart: KeyedMutator<CartData>;
// }

const CartContext = createContext();
const fetcher = (url) => axios.get(url).then(res => res.data);

export function CartProvider({ children }) {
    const { data: cartData, error: cartError, isLoading: cartIsLoading, mutate: mutateCart } = useSWR(
        '/api/user/cart',
        fetcher,
        {
            onError: (error) => {
                console.error('Error fetching cart data:', error);
            }
        }
    );
    const value = useMemo(() => ({
        cartData,
        cartError,
        cartIsLoading,
        mutateCart
    }), [cartData, cartError, cartIsLoading, mutateCart]);

    return (
    <CartContext.Provider value={value}>
        {children}
    </CartContext.Provider> 
);
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart ต้องใช้ภายใน CartProvider เท่านั้น');
    }
    return context;
}