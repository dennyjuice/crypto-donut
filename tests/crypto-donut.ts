import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CryptoDonut } from "../target/types/crypto_donut";

describe("crypto-donut", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.CryptoDonut as Program<CryptoDonut>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
