import { useState } from "react";
import { Input } from "../../components/input/Input";
import { Link, useNavigate } from "react-router-dom";
import './login-form-styles.css';
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export const LoginForm = () => {  
  const [userPasswordValue, setUserPasswordValue] = useState<string>('');
  const [userLoginValue, setUserLoginValue] = useState<string>('');
  const [errors, setErrors] = useState({ login: '', password: '' });
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserLoginValue(e.target.value);
    if (e.target.value) setErrors(prev => ({ ...prev, login: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPasswordValue(e.target.value);
    if (e.target.value) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      login: userLoginValue ? '' : 'this field is required',
      password: userPasswordValue ? '' : 'this field is required',
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: userLoginValue, password: userPasswordValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message);
        return;
      }

      login(data.token);
      toast.success('successful login!');
      navigate('/home');

    } catch {
      setServerError('connection error with the server');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="page-wrapper">
    <div className="card">
      <form className="main-container" onSubmit={handleSubmit}>
        <h1 className="form-title"><span>Log in</span> account</h1>
        <div className="form-container">
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
          {serverError && <p className="server-error">{serverError}</p>}
          <button className="btn-login">{isLoading ? 'Wait...' : 'Log in'}</button>
          <p className="form-footer">
            don't have an account yet? <Link to="/register" className="btn-register">sign up</Link>
          </p>
        </div>
      </form>
    </div>
  </div>
  );
};