export type { CryptoDonut } from "./crypto-donut";

export type DonatorsType = { user: string; amount: string }[];

export type ConfirmOptions = {
    skipPreflight?: boolean;
    commitment?: Commitment;
    preflightCommitment?: Commitment;
    maxRetries?: number;
};

export type Commitment =
    | 'processed'
    | 'confirmed'
    | 'finalized'
    | 'recent'
    | 'single'
    | 'singleGossip'
    | 'root'
    | 'max';