import React from "react";
import styles from "./admin.module.css";
import { useAdmin } from "../../hooks/use-admin";
import { useProgram } from "../../hooks/use-program";

export interface AdminProps {
  getDonatorsList: () => void;
  updateBalance: () => void;
}

const Admin = ({ getDonatorsList, updateBalance }: AdminProps) => {
  const { initialize, withdraw } = useAdmin();
  const { balance } = useProgram();

  const handleWithdraw = () => {
    withdraw().then(updateBalance);
  };

  return (
    <>
      {Number(balance) === 0 ? (
        <button className={styles.init} type="button" onClick={initialize}>
          init
        </button>
      ) : (
        <button
          className={styles.withdraw}
          type="button"
          onClick={handleWithdraw}
        >
          Withdraw
        </button>
      )}
      <button
        className={styles.donatorsButton}
        type="button"
        onClick={getDonatorsList}
      >
        Top donators
      </button>
    </>
  );
};

export default Admin;
