import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import './account-styles.css';

interface UserData {
    login: string;
    email: string;
    created_at: string;
}

export const Account = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            const responce = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await responce.json();
            setUserData(data);
        };

        fetchUser();
    }, []);
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

return (
        <div className="account-wrapper">
            <div className="page-container">
                <h1 className="account-title">Your account</h1>
                {userData && (
                    <div className="account-info">
                        <div className="account-field">
                            <span className="account-label">username</span>
                            <span className="account-value">{userData.login}</span>
                        </div>
                        <div className="account-field">
                            <span className="account-label">email</span>
                            <span className="account-value">{userData.email}</span>
                        </div>
                        <div className="account-field">
                            <span className="account-label">member since</span>
                            <span className="account-value">{formatDate(userData.created_at)}</span>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} className="logoutBtn">log out</button>
            </div>
        </div>
    );
}