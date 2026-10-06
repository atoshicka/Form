export type Plan = 'free' | 'pro';
export type ButtonVariant = 'default' | 'accent';

export interface SubscriptionItem {
    id: number;
    plan: Plan;
    title: string;
    price: string;
    features: string[];
    buttonText: string;
    buttonVariant: ButtonVariant;
}

export const subscriptionData: SubscriptionItem[] = [
    { 
        id: 1, 
        plan: 'free',
        title: 'free', 
        price: '$0', 
        features: [
            'On the main page, you’re greeted.', 
            'You can see the date of your registration.'
        ],
        buttonText: 'Actively',
        buttonVariant: 'default',
    },
    
    { 
        id: 2, 
        plan: 'pro',
        title: 'premium', 
        price: '$20', 
        features: [
            'You are welcomed on the main page with your name.', 
            'You can see the date of your registration.', 
            'You can delete your account.'
        ],
        buttonText: 'Upgrade',
        buttonVariant: 'accent',
    },
];