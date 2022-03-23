import { opts, programID } from "../constants";
import { Program, Provider } from "@project-serum/anchor";
import idl from "../crypto_donut.json";
import { CryptoDonut } from "../types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const useProgramConnection = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const provider = new Provider(
    connection,
    // @ts-ignore
    wallet,
    opts
  );
  const program = new Program(idl as CryptoDonut, programID, provider);

  return { connection, program, provider };
};
