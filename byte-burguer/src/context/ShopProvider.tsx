import type { ReactNode } from 'react';
import { ShopContext } from './ShopContext.tsx';
import useShopState from '../hooks/useShopState';
export function ShopProvider({ children }: { children: ReactNode }) {
    const shop = useShopState();
    return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>;
}
