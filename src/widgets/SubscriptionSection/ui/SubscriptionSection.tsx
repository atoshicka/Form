import { useCallback, useState } from 'react';
import { useSubscription } from '../../../entities/hooks/useSubscription';
import { SubscriptionBlock } from '../../../shared/ui/subscription-block/SubscriptionBlock';
import { subscriptionData } from '../model/data';
import './subscription-section-styles.css';
import { UpgradeModal } from '../../Modal/UpgradeModal';

export function SubscriptionSection() {
    const { plan, isPro, upgrade } = useSubscription();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

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
                            onBtnClick={isProBlock ? handleOpenModal : undefined}
                        />
                    );
                })}
            </div>

            {isModalOpen && (
                <UpgradeModal onUpgrade={upgrade} onClose={handleCloseModal} />
            )}
        </section>
    )
}