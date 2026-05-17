import { useNavigate } from "react-router-dom";
import './WelcomeBlock.css';
import { useAuth } from "../../hooks/useAuth";

export const WelcomeBlock = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div className="wrapper">
      <h1 className="hello">Hello</h1>
      <button onClick={handleLogout} className="logoutBtn">log out</button>
    </div>
  );
};