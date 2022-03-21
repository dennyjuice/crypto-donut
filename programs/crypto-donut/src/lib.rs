use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod crypto_donut {
    use super::*;
    use anchor_lang::solana_program::entrypoint::ProgramResult;
    use anchor_lang::solana_program::program::invoke;
    use anchor_lang::solana_program::system_instruction::transfer;

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.owner = ctx.accounts.user.to_account_info().key();
        Ok(())
    }

    pub fn send_donation(ctx: Context<Donation>, amount: u64) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.donators.push(ctx.accounts.user.key());

        let user = &mut ctx.accounts.user;

        let instruction = transfer(&user.key, &base_account.key(), amount);

        invoke(
            &instruction,
            &[user.to_account_info(), base_account.to_account_info()],
        )
        .unwrap();

        Ok(())
    }

    // pub fn withdraw(ctx: Context<Donation>) -> ProgramResult {
    //     let instruction = transfer(
    //         &ctx.accounts.base_account.key(),
    //         &ctx.accounts.user.owner,
    //         ctx.accounts.base_account.to_account_info().lamports(),
    //     );
    //
    //     invoke(
    //         &instruction,
    //         &[
    //             ctx.accounts.base_account.to_account_info(),
    //             ctx.accounts.user.to_account_info(),
    //         ],
    //     )
    // }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 64 + 1024)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BaseAccount {
    pub donators: Vec<Pubkey>,
    pub owner: Pubkey,
}

#[derive(Accounts)]
pub struct Donation<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
