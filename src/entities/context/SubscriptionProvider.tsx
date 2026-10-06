import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Plan } from '../../widgets/SubscriptionSection/model/data';
import { SubscriptionContext } from './SubscriptionContext';
import { useAuth } from '../../hooks/useAuth';
import { ApiError, fetchMe, upgradeToPro } from '../../shared/api/account-api';
import toast from 'react-hot-toast';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { isAuth, logout } = useAuth();
    const [plan, setPlan] = useState<Plan>('free');

    const logoutRef = useRef(logout);

    useEffect(() => {
        logoutRef.current = logout;
    })

    useEffect(() => {
        if (!isAuth) return;

        let cancelled = false;

        fetchMe()
            .then((user) => {
                if (!cancelled) setPlan(user.plan);
            })
            .catch((error: unknown) => {
                if (cancelled) return;
                if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
                    logoutRef.current();
                    return;
                }
                console.error('Failed to load subscription plan:', error);
                toast.error('Could not load your subscription', { id: 'plan-load-error' });
            });

        return () => {
            cancelled = true;
            setPlan('free');
        };
    }, [isAuth]);

    const upgrade = useCallback(async () => {
       await upgradeToPro();
       setPlan('pro');
    }, []);

    const value = useMemo(
        () => ({ plan, isPro: plan === 'pro', upgrade }),
        [plan, upgrade]
    );

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}