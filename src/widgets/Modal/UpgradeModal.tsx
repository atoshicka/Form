import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import './upgrade-modal-styles.css';
import toast from "react-hot-toast";

type Phase = 'loading' | 'success' | 'closing';

interface UpgradeModalProps {
    onUpgrade: () => void;
    onClose: () => void;
}

const LOADING_MS = 2200;
const SUCCESS_MS = 1400;
const CLOSING_MS = 350;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function UpgradeModal({ onUpgrade, onClose }: UpgradeModalProps) {
    const [phase, setPhase] = useState<Phase>('loading');

    const onUpgradeRef = useRef(onUpgrade);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onUpgradeRef.current = onUpgrade;
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (phase === 'loading') {
            let cancelled = false;

            Promise.all([onUpgradeRef.current(), wait(LOADING_MS)])
            .then(() => {
                if (!cancelled) setPhase('success');
            })
            .catch((error: unknown) => {
                if (cancelled) return;
                toast.error(error instanceof Error ? error.message : 'Upgrade failed');
                onCloseRef.current();
            });

            return () => {
                cancelled = true;
            };
        }

        if (phase === 'success') {
            const timer = setTimeout(() => setPhase('closing'), SUCCESS_MS);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => onCloseRef.current(), CLOSING_MS);
        return () => clearTimeout(timer);
    }, [phase]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const isLoading = phase === 'loading';

    return createPortal(
        <div 
        className={`upgrade-overlay ${phase === 'closing' ? 'upgrade-overlay--closing' : ''}`}
        style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
        >
            <div
            className="upgrade-modal"
            role="dialog"
            aria-modal="true"
            aria-label="upgrade processing"
            >
                <div className="upgrade-icon">
                    {isLoading ? (
                        <span className="upgrade-spinner"/>
                    ) : (
                        <svg
                            className="upgrade-check"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path d="M5 12.5 9.5 17 19 7.5" pathLength="1" />
                        </svg>
                    )}
                </div>
                <p 
                key={phase === 'loading' ? 'loading' : 'done'} 
                className="upgrade-text" 
                aria-live="polite"
                >
                    {isLoading ? 'We are processing your transaction...' : 'Successful!' }
                </p>
            </div>
        </div>,
        document.body,
    );
}