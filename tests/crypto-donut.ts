import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CryptoDonut } from "../target/types/crypto_donut";
import { expect } from "chai";

describe("crypto-donut", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CryptoDonut as Program<CryptoDonut>;
  const baseAccount = anchor.web3.Keypair.generate();

  it("Should create account", async () => {
      console.log("p", baseAccount.publicKey);

      const tx = await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      expect(account.owner).to.deep.equal(provider.wallet.publicKey);
    });

  it("Should send donation", async () => {
      const donator = anchor.web3.Keypair.generate();

      console.log(donator.publicKey, baseAccount.publicKey);

      await provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(donator.publicKey, 10000000000),
          "confirmed"
        );

        const tx = await program.rpc.sendDonation(new anchor.BN(100), {
          accounts: {
              baseAccount: baseAccount.publicKey,
              user: donator.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
          },
          signers: [donator],
        });

        const balance = await program.account.baseAccount.getAccountInfo(donator.publicKey);
      console.log(balance);
        expect(balance.lamports.toString()).equal("100");
      });
});
