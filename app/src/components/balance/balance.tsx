import React from "react";
import styles from "./balance.module.css";
import donutImg from "../../assets/donut.png";
import solCoinImg from "../../assets/solanaLogoMark.svg";
import { useProgram } from "../../hooks/use-program";

const Balance = () => {
  const { balance } = useProgram();

  return (
    <header>
      <img className={styles.logo} src={donutImg} />
      {balance ? (
        <div className={styles.balance}>
          <div className={styles.amount}>{balance}</div>
          <img className={styles.solCoin} src={solCoinImg} />
          <span>total donated</span>
        </div>
      ) : (
        <h1 className={styles.title}>CryptoDonut</h1>
      )}
    </header>
  );
};

export default Balance;
