export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const sameWalletAddress = (
  firstWallet: string,
  lastWallet: string
): boolean => {
  if (!firstWallet || !lastWallet) return false;

  return firstWallet.toLowerCase() == lastWallet.toLowerCase();
};

export const isMobileWidth = () => {
  if (window.screen.width < 920) {
    return true;
  }
  return false;
};
