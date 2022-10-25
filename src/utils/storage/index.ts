export const getInLocalOrSession = (key: string): string | null => {
  let value = sessionStorage.getItem(key) || localStorage.getItem(key);

  if (!value) {
    let stateStorage =
      sessionStorage.getItem("state") || localStorage.getItem("state");

    const state = JSON.parse(stateStorage || "{}");

    value = state[key];
  }

  return value;
};

export const deleteWalletAddressFromStorage = () => {
  let { walletAddress, ...state }: any = JSON.parse(
    localStorage.getItem("state") || "{}"
  );

  localStorage.setItem("state", JSON.stringify(state));
};
