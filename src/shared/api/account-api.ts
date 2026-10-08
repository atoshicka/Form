import type { Plan } from "../../widgets/SubscriptionSection/model/data";

export interface UserData {
    id: number;
    login: string;
    email: string;
    created_at: string;
    plan: Plan;
    avatar: string | null;
}

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'token';

async function request<T>(
    path: string, 
    method: 'GET' | 'POST' | 'DELETE',
    body?: unknown,
    ): Promise<T> {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ''}`,
    };

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${path}`, {
        method,
        cache: 'no-store',
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message ?? `Request failed: ${method} ${path} (${response.status})`
        throw new ApiError(message, response.status);
    }

    return data as T;
}

export function fetchMe(): Promise<UserData> {
    return request<UserData>('/auth/me', 'GET');
}

export async function upgradeToPro(): Promise<void> {
    await request('/account/upgrade', 'POST');
}

export async function downgradeToFree(): Promise<void> {
    await request('/account/downgrade', 'POST');
}

export async function uploadAvatar(avatar: string): Promise<string> {
    const data = await request<{avatar: string}>('/account/avatar', 'POST', {avatar});
    return data.avatar;
}

export async function removeAvatar(): Promise<void> {
    await request('/account/avatar', 'DELETE');
}

export async function deleteAccount(): Promise<void> {
    await request('/account', 'DELETE');
}