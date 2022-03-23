use anchor_lang::prelude::*;

declare_id!("3WLaHbMg2syxjgKcv5UPT5Gtnig4mg1KzAYinSP6tzxN");

#[program]
pub mod crypto_donut {
    use super::*;
    use anchor_lang::solana_program::entrypoint::ProgramResult;
    use anchor_lang::solana_program::program::invoke;
    use anchor_lang::solana_program::system_instruction::transfer;

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.owner = "4GecpK65jdYoguTNF6tND3ERLKVXKmAUaa2qTAvaeu98"
            .parse()
            .unwrap();
        Ok(())
    }

    pub fn send_donation(ctx: Context<Donation>, amount: u64) -> Result<()> {
        require!(amount > 0, DonationError::ZeroAmountForbidden);

        let base_account = &mut ctx.accounts.base_account;
        let user = &ctx.accounts.user;

        match base_account
            .donators
            .iter_mut()
            .find(|item| item.user == user.key())
        {
            Some(item_found) => {
                item_found.amount += amount;
            }
            None => base_account.donators.push(Donators {
                user: user.key(),
                amount,
            }),
        }

        invoke(
            &transfer(&user.key(), &base_account.key(), amount),
            &[user.to_account_info(), base_account.to_account_info()],
        )
        .unwrap();

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> ProgramResult {
        let base_account = &ctx.accounts.base_account.to_account_info();
        let owner = &ctx.accounts.owner;

        **owner.try_borrow_mut_lamports()? += base_account.lamports();
        **base_account.try_borrow_mut_lamports()? = 0;
        Ok(())
    }
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
    pub donators: Vec<Donators>,
    pub owner: Pubkey,
}

#[derive(Accounts)]
pub struct Donation<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, signer)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(address = base_account.owner)]
    pub owner: Signer<'info>,
}

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct Donators {
    user: Pubkey,
    amount: u64,
}

#[error_code]
pub enum DonationError {
    ZeroAmountForbidden,
}
