import { Contract } from 'ethers'

import { getProvider, getWalletConnectProvider } from '../providers'
import { user_authentication_api } from '../../../api/users-management'
import { getDefaultAccount, getWalletConnectDefaultAccount } from '../accounts'
import fmoneyRaffleManagerContract from '../../contracts/interfaces/IFmoneyRaffleManager.json'

export const handleVerifyOwnership = async () => {
  const userAccountSigner: any = getProvider().getSigner()
  const defaultAccount = getDefaultAccount()
  const userAccountSignature = await userAccountSigner.signMessage(import.meta.env.VITE_MSG_TO_SIGN)

  const response: any = await user_authentication_api({
    defaultAccount,
    userAccountSignature
  })

  return {
    userAccountSignature,
    signature_is_authorized: response.success
  }
}

export const handleVerifyOwnershipWalletConnect = async (walletAddress: String, userAccountSignature: String) => {
  const walletConnectProvider: any = await getWalletConnectProvider()
  const userAccountSigner: any = walletConnectProvider.getSigner()

  const response: any = await user_authentication_api({
    userAccountSignature,
    defaultAccount: walletAddress
  })

  return {
    userAccountSignature,
    signature_is_authorized: response.success
  }
}

export const checkIsUser = async (context: any) => {
  const provider = getProvider()
  const defaultAccount = getDefaultAccount()
  const currentManagerSmartContract: string = sessionStorage.getItem('currentManagerSmartContract') || ''
  // const raffleManagerInstance = new Contract(import.meta.env.VITE_FMONEY_RAFFLE_MANAGER_GOERLI, fmoneyRaffleManagerContract.abi, provider)
  const raffleManagerInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, provider)
  const userIsAdmin = await raffleManagerInstance.getIfUserIsAdmin(defaultAccount)

  // if (String(defaultAccount).toLowerCase() == String(import.meta.env.VITE_FMONEY_RAFFLE_OWNER).toLowerCase()) {
  if (userIsAdmin) {
    return true
  } else {
    return false
  }
}

export const checkIfWalletConnectUserIsAdmin = async (context: any) => {
  const defaultAccount = getWalletConnectDefaultAccount()
  const walletConnectProvider = await getWalletConnectProvider()
  const currentManagerSmartContract: string = sessionStorage.getItem('currentManagerSmartContract') || ''
  const raffleManagerInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, walletConnectProvider)
  const userIsAdmin = await raffleManagerInstance.getIfUserIsAdmin(defaultAccount)

  if (userIsAdmin) {
    return true
  } else {
    return false
  }
}
