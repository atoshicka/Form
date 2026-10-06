import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import './account-styles.css';
import { useSubscription } from "../../entities/hooks/useSubscription";
import { fetchMe, deleteAccount } from "../../shared/api/account-api";
import toast from "react-hot-toast";

interface UserData {
    login: string;
    email: string;
    created_at: string;
}

export const Account = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { plan, isPro } = useSubscription();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let calcelled = false;

        fetchMe()
            .then((user) => {
                if (!calcelled) setUserData(user);
            })
            .catch(() => {
                if (!calcelled) setLoadError(true);
            });
        return () => {
            calcelled = true;
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteAccount();
            toast.success('Account deleted');
            logout();
            navigate('/');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong')
            setIsDeleting(false);
            setIsConfirming(false);
        }
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

                {loadError && <p className="account-error">Could not load your data</p>}

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
                            <span className="account-label">registration date</span>
                            <span className="account-value">{formatDate(userData.created_at)}</span>
                        </div>
                        <div className="account-field">
                            <span className="account-label">plan</span>
                            <span className="account-value account-value--plan">{plan}</span>
                        </div>
                    </div>
                )}

                <div>
                    <button onClick={handleLogout} className="logoutBtn">
                        log out
                    </button>

                    {isPro && !isConfirming && (
                        <button
                        onClick={() => setIsConfirming(true)}
                        className="deleteBtn"
                        >   
                            delete account
                        </button>
                    )}
                </div>

                {isPro && isConfirming && (
                    <div className="account-confirm">
                        <p className="account-confirm-text">
                            Delete your account? This cannot be undone.
                        </p>
                        <div className="account-confirm-buttons">
                            <button
                            onClick={handleDelete}
                            className="deleteBtn deleteBtn--solid"
                            disabled={isDeleting}
                            >
                                {isDeleting ? 'deleting...' : 'yes, delete'}
                            </button>
                            <button
                            onClick={() => setIsConfirming(false)}
                            className="cancelBtn"
                            disabled={isDeleting}
                            >
                                cancel
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}