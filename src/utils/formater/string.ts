export const FormatWalletAddress = (address: string): string => {
  if (!address) return "";

  return `${address.substring(0, 4)}...${address.substring(
    address.length - 4
  )}`;
};
