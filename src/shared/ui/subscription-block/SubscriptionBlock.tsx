import { Dot } from 'lucide-react';
import { type ButtonVariant } from '../../../widgets/SubscriptionSection/model/data';
import './subscription-block-styles.css';

interface SubscriptionBlockProps {
    nameForSubscription: string;
    priceForSubscription?: string;
    listOfSubscription: string[];
    btnOfSubscription: string;
    btnVariant?: ButtonVariant;
    btnDisabled?: boolean;
    onBtnClick?: () => void;
}

export function SubscriptionBlock({ 
    nameForSubscription, 
    priceForSubscription, 
    listOfSubscription, 
    btnOfSubscription,
    btnVariant = 'default',
    btnDisabled = false,
    onBtnClick,
 }: SubscriptionBlockProps) {
    return (
        <div className="subscription-block">
            <div className="subscription-header">
                <h3>{nameForSubscription}</h3>
                <p className="subscription-price">{priceForSubscription}<span>/month</span></p>
            </div>
            <ul className="subscription-features">
                {listOfSubscription.map((item, index) => (
                    <li key={index} className="subscription-feature">
                        <Dot size={30} className='subscription-dot'/>
                        {item}
                    </li>
                ))}
            </ul>
            <button 
            className={`subscription-btn subscription-btn--${btnVariant}`}
            onClick={onBtnClick}
            disabled={btnDisabled}
            >
                {btnOfSubscription}
            </button>
        </div>
    )
}