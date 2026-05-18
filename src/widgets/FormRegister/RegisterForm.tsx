import { useState } from "react";
import { Input } from "../../components/input/Input";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import './register-form-styles.css';

export const RegisterForm = () => {
  const [userLoginValue, setUserLoginValue] = useState<string>('');
  const [userPasswordValue, setUserPasswordValue] = useState<string>('');
  const [userEmailValue, setUserEmailValue] = useState<string>('');
  const [errors, setErrors] = useState({ login: '', password: '', email: '' });
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserLoginValue(e.target.value);
    if (e.target.value) setErrors(prev => ({ ...prev, login: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPasswordValue(e.target.value);
    if (e.target.value.length >= 6) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmailValue(e.target.value);
    if (emailRegex.test(e.target.value)) setErrors(prev => ({ ...prev, email: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      login: userLoginValue ? '' : 'this field is required',
      password: !userPasswordValue 
        ? 'this field is required' 
        : userPasswordValue.length < 6 
        ? 'minimum 6 characters' 
        : '',
    email: !userEmailValue 
        ? 'this field is required' 
        : !emailRegex.test(userEmailValue)
        ? 'incorrect email'
        : '',
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: userLoginValue,
          password: userPasswordValue,
          email: userEmailValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message);
        return;
      }

      toast.success('you have successfully registered!');
      navigate('/');

    } catch {
      setServerError('connection error with the server');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="page-wrapper-reg">
      <div className="card">
      <form className="main-container-reg" onSubmit={handleSubmit}>
        <h1 className="form-title-reg"><span>Sign up</span> account</h1>
        <div className="form-container-reg">
          <Input
            inputIdentificator="login"
            inputLabelText="username"
            inputType="text"
            inputValue={userLoginValue}
            onInputChange={handleLoginChange}
            errorMessage={errors.login}
            isPassword={false}
            inputPlaceholder="Enter your username"
          />
          <Input
            inputIdentificator="password"
            inputLabelText="password"
            inputType="password"
            inputValue={userPasswordValue}
            onInputChange={handlePasswordChange}
            errorMessage={errors.password}
            isPassword
            inputPlaceholder="Enter your password"
          />
          <Input
            inputIdentificator="email"
            inputLabelText="email"
            inputType="text"
            inputValue={userEmailValue}
            onInputChange={handleEmailChange}
            errorMessage={errors.email}
            isPassword={false}
            inputPlaceholder="yourEmail@example.com"
          />
          {serverError && <p className="server-error">{serverError}</p>}
          <button className="btn-reg">{isLoading ? 'Wait...' : 'Sign up'}</button>
          <p className="form-footer-reg">
            already have an account? <Link to="/" className="btn-log">log in</Link>
          </p>
        </div>
      </form>
    </div>
  </div>
  );
};