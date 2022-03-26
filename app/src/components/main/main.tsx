import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolletExtensionWalletName } from "@solana/wallet-adapter-sollet";
import { useProgram } from "../../hooks/use-program";
import { useAdmin } from "../../hooks/use-admin";
import styles from "./main.module.css";
import { Balance } from "../balance/balance";
import Donators from "../donators/donators";
import DonateUs from "../donate-us/donate-us";
import Admin from "../admin/admin";

export const Main = () => {
  const wallet = useWallet();

  const {
    donatorsList,
    isOpenTopDonators,
    setIsOpenTopDonators,
    sendDonate,
    updateBalance,
    getDonatorsList,
  } = useProgram();
  const { isOwner } = useAdmin();

  useEffect(() => {
    wallet.select(SolletExtensionWalletName);
  }, [wallet]);

  const connectWallet = useCallback(() => {
    try {
      wallet.connect();
    } catch (err) {
      console.log("Wallet connecting error: ", err);
    }
  }, [wallet]);

  const content = useMemo(() => {
    if (!wallet.connected) {
      return (
        <button
          className={styles.primary}
          onClick={connectWallet}
          disabled={wallet.connected}
        >
          Connect
        </button>
      );
    }

    if (wallet.connected && isOpenTopDonators && donatorsList) {
      return (
        <>
          <Donators donators={donatorsList} />
          <button
            className={styles.donatorsButton}
            type="button"
            onClick={() => setIsOpenTopDonators(false)}
          >
            {isOwner ? "ADMIN" : "Support us"}
          </button>
        </>
      );
    }

    if (wallet.connected && isOwner) {
      return (
        <Admin
          getDonatorsList={getDonatorsList}
          updateBalance={updateBalance}
        />
      );
    }

    return (
      <>
        <DonateUs sendDonate={sendDonate} updateBalance={updateBalance} />
        <button
          className={styles.donatorsButton}
          type="button"
          onClick={getDonatorsList}
        >
          Top donators
        </button>
      </>
    );
  }, [
    connectWallet,
    donatorsList,
    getDonatorsList,
    isOpenTopDonators,
    isOwner,
    sendDonate,
    setIsOpenTopDonators,
    updateBalance,
    wallet.connected,
  ]);

  return (
    <main>
      <div className={styles.container}>
        <Balance />
        <div className={styles.content}>{content}</div>
      </div>
    </main>
  );
};
