import { createContext } from 'react';
import type { Plan } from '../../widgets/SubscriptionSection/model/data';

export interface SubscriptionContextValue {
    plan: Plan;
    isPro: boolean;
    upgrade: () => void;
}

export const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);