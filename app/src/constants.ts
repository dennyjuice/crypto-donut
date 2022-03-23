import {
  clusterApiUrl,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import idl from "./crypto_donut.json";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { SolletExtensionWalletAdapter } from "@solana/wallet-adapter-sollet";
import { ConfirmOptions } from "./types";

// @ts-ignore
let seed = Uint8Array.from(process.env.REACT_APP_KEYPAIR.split(","));
export const baseAccount = Keypair.fromSecretKey(seed);

export const programID = new PublicKey(idl.metadata.address);
export const network = clusterApiUrl("devnet") as WalletAdapterNetwork;
export const owner = new PublicKey(
  "4GecpK65jdYoguTNF6tND3ERLKVXKmAUaa2qTAvaeu98"
);
// export const network = "http://127.0.0.1:8899" as WalletAdapterNetwork;
export const wallets = [new SolletExtensionWalletAdapter({ network })];

export const opts: ConfirmOptions = {
  preflightCommitment: "confirmed",
};
