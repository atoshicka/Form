import { useEffect, useState } from 'react';
import { useSubscription } from '../../entities/hooks/useSubscription';
import './WelcomeBlock.css';

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  if (hour >= 18 && hour < 23) return 'Good evening';
  return 'Good night';
}

export const WelcomeBlock = () => {
  const { isPro, login } = useSubscription();
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(timer);
  }, []);

  let greeting = 'Hello';

  if (isPro) {
    greeting = login ? `${getGreeting(hour)}, ${login}` : getGreeting(hour);
  }

  return (
    <div className="wrapper">
      <h1 className="hello">{greeting}</h1>
    </div>
  );
};