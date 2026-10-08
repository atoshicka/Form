import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Camera, Trash2, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../entities/hooks/useSubscription';
import {
    fetchMe,
    deleteAccount,
    uploadAvatar,
    removeAvatar,
} from '../../shared/api/account-api';
import type { UserData } from '../../shared/api/account-api';
import './account-styles.css';

const AVATAR_SIZE = 256;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(url);

            const side = Math.min(image.width, image.height);
            const sx = (image.width - side) / 2;
            const sy = (image.height - side) / 2;

            const canvas = document.createElement('canvas');
            canvas.width = AVATAR_SIZE;
            canvas.height = AVATAR_SIZE;

            const context = canvas.getContext('2d');

            if (!context) {
                reject(new Error('Could not process the image'));
                return;
            }

            context.drawImage(image, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Could not read the image'));
        };

        image.src = url;
    });
}

export const Account = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { plan, isPro, downgrade } = useSubscription();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDowngrading, setIsDowngrading] = useState(false);
    const [isAvatarBusy, setIsAvatarBusy] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let cancelled = false;

        fetchMe()
            .then((user) => {
                if (!cancelled) setUserData(user);
            })
            .catch(() => {
                if (!cancelled) setLoadError(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please choose an image file');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error('Image is too large (max 10 MB)');
            return;
        }

        setIsAvatarBusy(true);

        try {
            const dataUrl = await resizeImage(file);
            const saved = await uploadAvatar(dataUrl);
            setUserData((prev) => (prev ? { ...prev, avatar: saved } : prev));
            toast.success('Photo updated');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsAvatarBusy(false);
        }
    };

    const handleAvatarRemove = async () => {
        setIsAvatarBusy(true);

        try {
            await removeAvatar();
            setUserData((prev) => (prev ? { ...prev, avatar: null } : prev));
            toast.success('Photo removed');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsAvatarBusy(false);
        }
    };

    const handleDowngrade = async () => {
        setIsDowngrading(true);

        try {
            await downgrade();
            setIsConfirming(false);
            toast.success('You are on the free plan now');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsDowngrading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteAccount();
            toast.success('Account deleted');
            logout();
            navigate('/');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
            setIsDeleting(false);
            setIsConfirming(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isBusy = isDeleting || isDowngrading;

    return (
        <div className="account-wrapper">
            <div className="page-container">
                {userData && (
                    <div className="account-avatar">
                        <button
                            type="button"
                            className={`account-avatar-btn ${isAvatarBusy ? 'account-avatar-btn--busy' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isAvatarBusy || isBusy}
                            aria-label="Change profile photo"
                        >
                            {userData.avatar ? (
                                <img
                                    className="account-avatar-img"
                                    src={userData.avatar}
                                    alt="Your profile photo"
                                />
                            ) : (
                                <UserRound size={36} className="account-avatar-placeholder" />
                            )}
                            <span className="account-avatar-overlay">
                                <Camera size={20} />
                            </span>
                        </button>

                        {userData.avatar && (
                            <button
                                type="button"
                                className="account-avatar-remove"
                                onClick={handleAvatarRemove}
                                disabled={isAvatarBusy || isBusy}
                                aria-label="Remove profile photo"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            className="account-avatar-input"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>
                )}

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
                            <div className="account-plan-row">
                                <span className="account-value account-value--plan">{plan}</span>
                                {isPro && (
                                    <button
                                        onClick={handleDowngrade}
                                        className="planBtn"
                                        disabled={isBusy}
                                    >
                                        {isDowngrading ? 'switching...' : 'switch to free'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="account-actions">
                    <button onClick={handleLogout} className="logoutBtn" disabled={isBusy}>
                        log out
                    </button>

                    {isPro && !isConfirming && (
                        <button
                            onClick={() => setIsConfirming(true)}
                            className="deleteBtn"
                            disabled={isBusy}
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
                                disabled={isBusy}
                            >
                                {isDeleting ? 'deleting...' : 'yes, delete'}
                            </button>
                            <button
                                onClick={() => setIsConfirming(false)}
                                className="cancelBtn"
                                disabled={isBusy}
                            >
                                cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};