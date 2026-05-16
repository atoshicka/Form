import { useState } from 'react';
import './input-styles.css';
import { EyeOff, Eye } from 'lucide-react';

interface InputProps {
    inputIdentificator: string;
    inputLabelText: string;
    inputType: React.HTMLInputTypeAttribute;
    inputValue: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    isPassword: boolean;
    inputPlaceholder: string;
}

export const Input = ({
    inputIdentificator,
    inputLabelText,
    inputType,
    inputValue,
    onInputChange,
    errorMessage,
    isPassword,
    inputPlaceholder,

}: InputProps ) => {
    const [showPassword, setShowPassword] = useState(false);

    useState(() => {
        if (inputValue === '') {
            setShowPassword(false);
        }
    })

    return (
        <div className='input-wrapper'>
            <label htmlFor={inputIdentificator} className='label-content'>{inputLabelText}</label>
            <div className='input-row'>
            <input 
                id={inputIdentificator}
                value={inputValue}
                placeholder={inputPlaceholder}
                type={isPassword ? (showPassword ? 'text' : 'password') : inputType}
                onChange={onInputChange}
                className={`input-content ${errorMessage ? 'input-error' : ''}`}
            />
                {isPassword && inputValue.length >= 1 && (
                    <span className='eye-icon' onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </span>
                )}
            </div>
            {errorMessage && (
                <label className='label-error'>{errorMessage}</label>
            )}
        </div>
    )
}