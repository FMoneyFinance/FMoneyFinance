const context: any = window;

export const handleConnectMetaMask = async () => {
  if (!CheckMetamaskInstalled()) {
    alert("Install Metamask extension, please.");
    return;
  }

  const responseConnect = await context.ethereum.request({
    method: "eth_requestAccounts"
  });

  if (!responseConnect[0]) return;

  return responseConnect[0];
};

export const CheckMetamaskInstalled = () => {
  return context.ethereum;
};
