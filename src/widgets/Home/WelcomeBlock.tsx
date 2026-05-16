import styles from "./WelcomeBlock.module.css";

export const WelcomeBlock = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.hello}>Hello</h1>
    </div>
  );
};