import { baseAccount, owner } from "../constants";
import { SystemProgram } from "@solana/web3.js";
import { useProgramConnection } from "./use-program-connection";
import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export const useAdmin = () => {
  const { program, provider } = useProgramConnection();
  const wallet = useWallet();

  const isOwner = useMemo(
    () => owner.toString() === wallet.publicKey?.toString(),
    [wallet.publicKey]
  );

  const initialize = async () => {
    try {
      await program.methods
        .initialize()
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([baseAccount])
        .rpc();
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  };

  const withdraw = async () => {
    try {
      await program.methods
        .withdraw()
        .accounts({
          baseAccount: baseAccount.publicKey,
        })
        .signers([baseAccount])
        .rpc();
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  };

  return { initialize, withdraw, isOwner };
};
