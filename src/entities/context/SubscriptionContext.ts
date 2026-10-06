import { createContext } from 'react';
import type { Plan } from '../../widgets/SubscriptionSection/model/data';

export interface SubscriptionContextValue {
    plan: Plan;
    isPro: boolean;
    login: string | null;
    upgrade: () => Promise<void>;
    downgrade: () => Promise<void>;
}

export const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);