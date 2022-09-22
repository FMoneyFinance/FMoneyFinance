export const FormatWalletAddress = (address: string): string => {
  if (!address) return "";

  return `${address.substring(0, 5)}...${address.substring(
    address?.length - 4
  )}`;
};
