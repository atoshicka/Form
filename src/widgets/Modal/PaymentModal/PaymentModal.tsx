import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, Lock, TriangleAlert, X } from 'lucide-react';
import './payment-modal-styles.css';

interface PaymentModalProps {
    amount: string;
    onPay: () => void;
    onClose: () => void;
}

type Field = 'name' | 'number' | 'expiry' | 'cvc';
type Errors = Partial<Record<Field, string>>;

const CLOSING_MS = 250;

const onlyDigits = (value: string) => value.replace(/\D/g, '');

function formatCardNumber(value: string) {
    return onlyDigits(value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
    const digits = onlyDigits(value).slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function validate(values: Record<Field, string>): Errors {
    const errors: Errors = {};

    if (values.name.trim().length < 2) {
        errors.name = 'Enter the name on the card';
    }

    if (onlyDigits(values.number).length !== 16) {
        errors.number = 'Card number must have 16 digits';
    }

    const [mm, yy] = values.expiry.split('/');
    const month = Number(mm);
    const year = 2000 + Number(yy);
    const now = new Date();

    if (!mm || !yy || yy.length !== 2 || month < 1 || month > 12) {
        errors.expiry = 'Use MM/YY format';
    } else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        errors.expiry = 'Card has expired';
    }

    if (onlyDigits(values.cvc).length !== 3) {
        errors.cvc = '3 digits';
    }

    return errors;
}

export function PaymentModal({ amount, onPay, onClose }: PaymentModalProps) {
    const [values, setValues] = useState<Record<Field, string>>({
        name: '',
        number: '',
        expiry: '',
        cvc: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const nameInputRef = useRef<HTMLInputElement>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const errors = validate(values);

    const requestClose = () => {
        if (isClosing) return;
        setIsClosing(true);
        closeTimerRef.current = setTimeout(onClose, CLOSING_MS);
    };

    const requestCloseRef = useRef(requestClose);

    useEffect(() => {
        requestCloseRef.current = requestClose;
    });

    useEffect(() => {
        nameInputRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') requestCloseRef.current();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    const setField = (field: Field, formatter?: (value: string) => string) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            const next = formatter ? formatter(event.target.value) : event.target.value;
            setValues((prev) => ({ ...prev, [field]: next }));
        };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setSubmitted(true);

        if (Object.keys(errors).length > 0) return;

        onPay();
    };

    const showError = (field: Field) => submitted && errors[field];

    return createPortal(
        <div
            className={`payment-overlay ${isClosing ? 'payment-overlay--closing' : ''}`}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) requestClose();
            }}
        >
            <div
                className="payment-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Payment"
            >
                <button
                    type="button"
                    className="payment-close"
                    onClick={requestClose}
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <h2 className="payment-title">Upgrade to premium</h2>

                <form className="payment-form" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <label className="payment-field">
                        <span className="payment-label">Name on card</span>
                        <input
                            ref={nameInputRef}
                            className={`payment-input ${showError('name') ? 'payment-input--error' : ''}`}
                            type="text"
                            name="demo-name"
                            placeholder="Jane Doe"
                            autoComplete="off"
                            value={values.name}
                            onChange={setField('name')}
                        />
                        {showError('name') && <span className="payment-error">{errors.name}</span>}
                    </label>

                    <label className="payment-field">
                        <span className="payment-label">Card number</span>
                        <div className="payment-input-wrap">
                            <CreditCard size={18} className="payment-input-icon" />
                            <input
                                className={`payment-input payment-input--icon ${showError('number') ? 'payment-input--error' : ''}`}
                                type="text"
                                name="demo-number"
                                inputMode="numeric"
                                placeholder="4242 4242 4242 4242"
                                autoComplete="off"
                                value={values.number}
                                onChange={setField('number', formatCardNumber)}
                            />
                        </div>
                        {showError('number') && <span className="payment-error">{errors.number}</span>}
                    </label>

                    <div className="payment-row">
                        <label className="payment-field">
                            <span className="payment-label">Expiry</span>
                            <input
                                className={`payment-input ${showError('expiry') ? 'payment-input--error' : ''}`}
                                type="text"
                                name="demo-expiry"
                                inputMode="numeric"
                                placeholder="MM/YY"
                                autoComplete="off"
                                value={values.expiry}
                                onChange={setField('expiry', formatExpiry)}
                            />
                            {showError('expiry') && <span className="payment-error">{errors.expiry}</span>}
                        </label>

                        <label className="payment-field">
                            <span className="payment-label">CVC</span>
                            <input
                                className={`payment-input ${showError('cvc') ? 'payment-input--error' : ''}`}
                                type="text"
                                name="demo-cvc"
                                inputMode="numeric"
                                placeholder="123"
                                autoComplete="off"
                                value={values.cvc}
                                onChange={setField('cvc', (value) => onlyDigits(value).slice(0, 3))}
                            />
                            {showError('cvc') && <span className="payment-error">{errors.cvc}</span>}
                        </label>
                    </div>

                    <button type="submit" className="payment-submit">
                        <Lock size={16} />
                        Pay {amount}
                    </button>

                    <div className='payment-demo'>
                        <TriangleAlert size={18} className="payment-demo-icon" />
                        <p className="payment-hint">Demo mode. You can enter any values.</p>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
}