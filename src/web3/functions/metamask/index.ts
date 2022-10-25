import { providers } from 'ethers'
import { getProvider } from '../providers'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { checkIsUser as checkIsUserIsAdmin, checkIfWalletConnectUserIsAdmin, handleVerifyOwnership, handleVerifyOwnershipWalletConnect } from '../user'
import { hashMessage } from '../utils/encrypt'

const winContext: any = window

export const handleConnectMetaMask = async (contextHook: any) => {
  try {
    if (!CheckMetamaskInstalled()) {
      return {
        error: true,
        msg: 'Metamask is not installed'
      }
    }

    const responseConnect = await winContext.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if (!responseConnect[0])
      return {
        error: true,
        msg: 'The request was cancelled'
      }

    const { signature_is_authorized, userAccountSignature }: any = await handleVerifyOwnership()
    const isAdminUser = await checkIsUserIsAdmin(contextHook)

    return {
      isAdminUser,
      userAccountSignature,
      signature_is_authorized,
      walletAddress: responseConnect[0]
    }
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'Error'
    }
  }
}

export const handleConnectWalletConnect = async (contextHook: any, connectorInstance: any) => {
  try {
    // hash message
    const hash = hashMessage(import.meta.env.VITE_MSG_TO_SIGN)
    const walletAddress = connectorInstance.accounts[0]

    // eth_sign params
    const msgParams = [walletAddress, hash]
    const userAccountSignature = await connectorInstance.signMessage(msgParams)

    const { signature_is_authorized }: any = await handleVerifyOwnershipWalletConnect(walletAddress, userAccountSignature)
    const isAdminUser = await checkIfWalletConnectUserIsAdmin(contextHook)

    return {
      isAdminUser,
      success: true,
      walletAddress,
      userAccountSignature,
      signature_is_authorized
    }
  } catch (error: any) {
    console.log(error)
    return {
      error: true,
      msg: error?.message || 'Error'
    }
  }
}

export const CheckMetamaskInstalled = () => {
  return winContext.ethereum
}
