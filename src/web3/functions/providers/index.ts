import { providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

const context: any = window;

export const getProvider = () => {
  return new providers.Web3Provider(context.ethereum);
};

export const getWalletConnectProvider = () : Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const provider = new WalletConnectProvider({ infuraId: import.meta.env.VITE_INFURA_API_KEY });
    await provider.enable();
    const walletConnectProvider = new providers.Web3Provider(provider);
    resolve(walletConnectProvider);
  })
};

