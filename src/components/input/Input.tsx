import { useState } from 'react';
import './input-styles.css';
import openEye from '../../assets/openEye.png';
import closedEye from '../../assets/closeEye.png';

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
                    <img
                        src={showPassword ? openEye : closedEye}
                        alt="toggle password"
                        className={openEye ? 'open-eye' : 'close-eye'}
                        onClick={() => setShowPassword(prev => !prev)}
                    />
                )}
            </div>
            {errorMessage && (
                <label className='label-error'>{errorMessage}</label>
            )}
        </div>
    )
}