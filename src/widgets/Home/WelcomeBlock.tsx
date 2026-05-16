import { useNavigate } from "react-router-dom";
import './WelcomeBlock.css';

export const WelcomeBlock = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="wrapper">
      <h1 className="hello">Hello</h1>
      <button onClick={handleLogout} className="logoutBtn">log out</button>
    </div>
  );
};