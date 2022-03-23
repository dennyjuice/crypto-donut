import React from "react";
import styles from "./donators.module.css";
import { DonatorsType } from "../../types";

export interface DonatorsProps {
  donators: DonatorsType;
}

const Donators = ({ donators }: DonatorsProps) => {
  return (
    <>
      <h1>Top donators</h1>
      <div className={styles.donators}>
        {donators
          .sort((a, b) => Number(b.amount) - Number(a.amount))
          .map(({ user, amount }) => {
            return (
              <div key={user.toString()} className={styles.row}>
                <span className={styles.user}>{user.toString()}</span>
                <span
                  className={styles.amount}
                >{`${amount.toString()} L`}</span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Donators;
