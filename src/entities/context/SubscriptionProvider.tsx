import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Plan } from '../../widgets/SubscriptionSection/model/data';
import { SubscriptionContext } from './SubscriptionContext';
import { useAuth } from '../../hooks/useAuth';
import { ApiError, downgradeToFree, fetchMe, upgradeToPro } from '../../shared/api/account-api';
import toast from 'react-hot-toast';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { isAuth, logout } = useAuth();
    const [plan, setPlan] = useState<Plan>('free');
    const [login, setLogin] = useState<string | null>(null);

    const logoutRef = useRef(logout);

    useEffect(() => {
        logoutRef.current = logout;
    })

    useEffect(() => {
        if (!isAuth) return;

        let cancelled = false;

        fetchMe()
            .then((user) => {
                if (cancelled) return;

                setPlan(user.plan === 'pro' ? 'pro' : 'free');
                setLogin(user.login ?? null);
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
            setLogin(null);
        };
    }, [isAuth]);

    const upgrade = useCallback(async () => {
       await upgradeToPro();
       setPlan('pro');
    }, []);

    const downgrade = useCallback(async () => {
        await downgradeToFree();
        setPlan('free');
    }, []);

    const value = useMemo(
        () => ({ plan, isPro: plan === 'pro', login, upgrade, downgrade }),
        [plan, login, upgrade, downgrade]
    );

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}