import { useCallback, useState } from "react";
import { baseAccount } from "../constants";
import { useProgramConnection } from "./use-program-connection";
import { useWallet } from "@solana/wallet-adapter-react";
import { DonatorsType } from "../types";
import { BN } from "@project-serum/anchor";
import { SystemProgram } from "@solana/web3.js";

export const useProgram = () => {
  const [balance, setBalance] = useState("");
  const [donatorsList, setDonatorsList] = useState<DonatorsType>();
  const [isOpenTopDonators, setIsOpenTopDonators] = useState(false);
  const wallet = useWallet();

  const { program, provider } = useProgramConnection();

  const updateBalance = useCallback(() => {
    if (wallet.connected && provider) {
      provider.connection.getBalance(baseAccount.publicKey).then((account) => {
        setBalance((Number(account) / 1_000_000_000).toFixed(4));
      });
    }
  }, [provider, wallet.connected]);

  const getDonatorsList = async () => {
    try {
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      setDonatorsList(
        (account.donators as DonatorsType).map(({ user, amount }) => ({
          user,
          amount: amount.toString(),
        }))
      );
      setIsOpenTopDonators(true);
    } catch (e) {
      console.log("Top donators error: ", e);
    }
  };

  const sendDonate = async (donateAmount: string) => {
    if (provider) {
      try {
        await program.methods
          .sendDonation(new BN(donateAmount))
          .accounts({
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (err) {
        console.log("Transaction error: ", err);
      }
    }
  };

  return {
    balance,
    updateBalance,
    donatorsList,
    getDonatorsList,
    sendDonate,
    isOpenTopDonators,
    setIsOpenTopDonators,
  };
};
