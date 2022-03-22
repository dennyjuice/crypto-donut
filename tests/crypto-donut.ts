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
  const user = anchor.web3.Keypair.generate();

  const sendDonate = async (user: anchor.web3.Keypair) => {
    await program.rpc.sendDonation(new anchor.BN(1), {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [user],
    });
  };

  it("Should create account", async () => {
    await program.rpc.initialize({
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
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 1_000_000),
      "confirmed"
    );

    await sendDonate(user);

    const balance = await program.account.baseAccount.getAccountInfo(
      user.publicKey
    );
    expect(balance.lamports.toString()).equal("999999");
  });

  it("Should return list of donators", async () => {
    const user1 = anchor.web3.Keypair.generate();
    const user2 = anchor.web3.Keypair.generate();

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user1.publicKey, 1_000_000),
      "confirmed"
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user2.publicKey, 1_000_000),
      "confirmed"
    );

    await sendDonate(user1);
    await sendDonate(user2);
    await sendDonate(user2);

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );

    expect((account.donators as []).length).to.equal(3);
    expect(account.donators[0].user).to.deep.equal(user.publicKey);
    expect(account.donators[2].amount.toString()).to.equal("2");
  });

  it("Should withdraw", async () => {
    const ownerBalanceBefore = await provider.connection.getBalance(
      provider.wallet.publicKey
    );

    await program.rpc.withdraw({
      accounts: {
        baseAccount: baseAccount.publicKey,
        owner: provider.wallet.publicKey,
      },
      signers: [baseAccount],
    });

    const ownerBalanceAfter = await provider.connection.getBalance(
      provider.wallet.publicKey
    );
    const baseBalanceAfter = await provider.connection.getBalance(
      baseAccount.publicKey
    );

    expect(ownerBalanceAfter).to.greaterThan(ownerBalanceBefore);
    expect(baseBalanceAfter).equal(0);
  });
});
