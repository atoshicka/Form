import { useCallback, useState } from 'react';
import { useSubscription } from '../../../entities/hooks/useSubscription';
import { SubscriptionBlock } from '../../../shared/ui/subscription-block/SubscriptionBlock';
import { subscriptionData } from '../model/data';
import './subscription-section-styles.css';
import { UpgradeModal } from '../../Modal/UpgradeModal';
import { PaymentModal } from '../../Modal/PaymentModal/PaymentModal';

type Step = 'idle' | 'payment' | 'processing';

export function SubscriptionSection() {
    const { plan, isPro, upgrade } = useSubscription();
    const [step, setStep] = useState<Step>('idle');

    const proPrice = subscriptionData.find((item) => item.plan === 'pro')?.price ?? '';

    const handleOpenPayment = useCallback(() => setStep('payment'), []);
    const handlePay = useCallback(() => setStep('processing'), []);
    const handleCloseModal = useCallback(() => setStep('idle'), []);

    return (
        <section className="subscription-section">
            <div className="subscription-section-container">
                {subscriptionData.map((subscription) => {
                    const isProBlock = subscription.plan === 'pro';
                    const isCurrent = subscription.plan === plan;
                    const isDisabled = !isProBlock || isPro;
                    let buttonText = subscription.buttonText;

                    if (isCurrent) {
                        buttonText = 'Current plan';
                    } else if (!isProBlock && isPro) {
                        buttonText = 'Not active';
                    }

                    return (
                        <SubscriptionBlock
                            key={subscription.id}
                            nameForSubscription={subscription.title}
                            priceForSubscription={subscription.price}
                            listOfSubscription={subscription.features}
                            btnOfSubscription={buttonText}
                            btnVariant={subscription.buttonVariant}
                            btnDisabled={isDisabled}
                            onBtnClick={isProBlock ? handleOpenPayment : undefined}
                        />
                    );
                })}
            </div>

            {step === 'payment' && (
                <PaymentModal
                    amount={proPrice}
                    onPay={handlePay}
                    onClose={handleCloseModal}
                />
            )}

            {step === 'processing' && (
                <UpgradeModal onUpgrade={upgrade} onClose={handleCloseModal}/>
            )}
        </section>
    )
}