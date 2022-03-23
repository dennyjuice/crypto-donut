import React from "react";
import "./App.css";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { network, wallets } from "./constants";
import { Main } from "./components/main/main";

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require("buffer").Buffer;

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
