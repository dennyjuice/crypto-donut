import React, { useCallback, useState } from "react";
import styles from "./donate-us.module.css";

export interface SupportProps {
  sendDonate: (amount: string) => Promise<void>;
  updateBalance: () => void;
}

const DonateUs = ({ sendDonate, updateBalance }: SupportProps) => {
  const [donateAmount, setDonateAmount] = useState("1000000000");
  const [error, setError] = useState(false);

  const handleSendDonate = useCallback(() => {
    if (Number(donateAmount) <= 0) {
      setError(true);
    } else {
      setError(false);
      sendDonate(donateAmount).then(updateBalance);
    }
  }, [sendDonate, updateBalance, donateAmount]);

  return (
    <>
      <h1>Support us</h1>
      <label htmlFor="amountInput">Send lamports:</label>
      <input
        type="number"
        value={donateAmount}
        onChange={(e) => setDonateAmount(e.target.value)}
        id="amountInput"
      />
      {error && <span className={styles.error}>Should be greater than 0</span>}
      <button
        className={styles.primary}
        type="submit"
        onClick={handleSendDonate}
      >
        Send
      </button>
    </>
  );
};

export default DonateUs;
