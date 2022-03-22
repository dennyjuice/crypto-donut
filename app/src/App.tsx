import React, { useEffect } from "react";
import "./App.css";
import { Idl, Program, Provider } from "@project-serum/anchor";
import {
  SolletExtensionWalletAdapter,
  SolletExtensionWalletName,
} from "@solana/wallet-adapter-sollet";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  Commitment,
  Connection,
  ConnectionConfig,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import idl from "./crypto_donut.json";

const baseAccount = Keypair.generate();

const programID = new PublicKey(idl.metadata.address);
const owner = new PublicKey("CFcfiAiQHJpoSPGaptE7oA4yQzCfhaMCrQqzHCiLSWL1");
// const network = clusterApiUrl("devnet") as WalletAdapterNetwork;
const network = "http://127.0.0.1:8899" as WalletAdapterNetwork;
const wallets = [new SolletExtensionWalletAdapter({ network })];

const opts: { preflightCommitment: Commitment | ConnectionConfig | undefined } =
  {
    preflightCommitment: "processed",
  };

const Main = () => {
  const wallet = useWallet();

  async function getProvider() {
    const connection = new Connection(network, opts.preflightCommitment);

    // @ts-ignore
    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
  }

  async function initialize() {
    const provider = await getProvider();
    const program = new Program(idl as Idl, programID, provider);
    try {
      await program.methods.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: owner,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log("account: ", account);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  useEffect(() => {
    wallet.select(SolletExtensionWalletName);
  }, [wallet.select]);

  const connectWallet = async () => {
    try {
      await wallet.connect();
      initialize();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} disabled={wallet.connected}>
        {wallet.connected ? "Connected" : "Connect"}
      </button>
      {wallet.connected && <p>{wallet.publicKey?.toBase58()}</p>}
    </div>
  );
};

const App = () => {
  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets}>
        <Main />
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
