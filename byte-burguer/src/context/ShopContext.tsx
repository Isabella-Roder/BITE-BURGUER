import { createContext, useContext } from 'react';
import type useShopState from '../hooks/useShopState';
export const ShopContext = createContext<ReturnType<typeof useShopState> | null>(null);
export function useShop() {
    const shop = useContext(ShopContext);
    if (!shop) throw new Error('useShop precisa estar dentro de ShopProvider');
    return shop;
}
