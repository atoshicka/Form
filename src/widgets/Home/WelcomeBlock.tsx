import { useSubscription } from '../../entities/hooks/useSubscription';
import './WelcomeBlock.css';

export const WelcomeBlock = () => {
  const { isPro, login } = useSubscription();

  const greeting = isPro && login ? `Hello, ${login}` : 'Hello';

  return (
    <div className="wrapper">
      <h1 className="hello">{greeting}</h1>
    </div>
  );
};