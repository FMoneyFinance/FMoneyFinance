export const ThereAWallet = (context: any) => {
  return context.state?.walletAddress?.length > 10;
};
