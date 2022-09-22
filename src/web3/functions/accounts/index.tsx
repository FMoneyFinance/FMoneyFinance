import { Contract, utils } from 'ethers'
import { formatNumber } from '../../../utils/formater/number'
import { deleteWalletAddressFromStorage } from '../../../utils/storage'
import erc20TokenContract from '../../contracts/interfaces/IERC20.json'
import { getProvider, getWalletConnectProvider } from '../providers/index'
import { getConnectorInstance, handleKillSessionConnector } from '../../../web3/walletConnect'

export const getDefaultAccount = () => {
  const context: any = window
  return context.ethereum.selectedAddress
}

export const getWalletConnectDefaultAccount = () => {
  const connectorInstance = getConnectorInstance()
  return connectorInstance.accounts[0]
}

export const handleAccountWalletChange = (args: any, context: any) => {
  const accounts = args[0]
  window.sessionStorage.removeItem('userAccountSignature')
  window.localStorage.removeItem('userAccountSignature')

  if (!accounts || accounts?.length === 0) {
  } else if (accounts[0] !== getDefaultAccount()) {
    if (!context.state?.showModalConnectWallet) {
      context.changeContext({
        walletAddress: accounts[0],
        ModalConnectWalletIndex: 1,
        showModalConnectWallet: true
      })
    }
  }
}

export const handleAccountWalletChangeWalletConnect = (newWalletToSet: any, context: any) => {
  window.sessionStorage.removeItem('userAccountSignature')
  window.localStorage.removeItem('userAccountSignature')

  const connectorInstance = getConnectorInstance()
  console.log(connectorInstance?.connected)

  if (connectorInstance && connectorInstance?.connected) {
    handleKillSessionConnector()
  }

  if (!context.state?.showModalConnectWallet) {
    context.changeContext({
      walletAddress: newWalletToSet,
      ModalConnectWalletIndex: 1
    })
  }
}

export const handleGetBalances = async (context: any) => {
  const currentContext: any = window
  const provider = currentContext.ethereum ? getProvider() : await getWalletConnectProvider()
  const ETHBalance = Number(utils.formatEther(await provider.getBalance(context.state?.walletAddress)))

  const usdcContractInstance = new Contract(import.meta.env.VITE_USDC_CONTRACT_ADDRESS, erc20TokenContract.abi, provider)
  const currentUserUsdcBalance = await usdcContractInstance.balanceOf(context.state?.walletAddress)
  const usdcTokenDecimals = await usdcContractInstance.decimals()
  const usdcTokenDecimalsDivider = Number(`1e+${usdcTokenDecimals}`)
  const USDCbalance = currentUserUsdcBalance / usdcTokenDecimalsDivider

  const fmonContractInstance = new Contract(import.meta.env.VITE_FMON_CONTRACT_ADDRESS, erc20TokenContract.abi, provider)
  const currentUserFMonBalance = await fmonContractInstance.balanceOf(context.state?.walletAddress)
  const fmonTokenDecimals = await fmonContractInstance.decimals()
  const fmonTokenDecimalsDivider = Number(`1e+${fmonTokenDecimals}`)
  const fmonbalance = currentUserFMonBalance / fmonTokenDecimalsDivider
  console.log('ETHBalance', ETHBalance)
  console.log('USDCbalance', USDCbalance)
  console.log('fmonbalance', fmonbalance)

  return { usdc: formatNumber(USDCbalance), fmon: formatNumber(fmonbalance), eth: formatNumber(ETHBalance) }
}

export const disconnectWallet = (changeContext: Function) => {
  const connectorInstance = getConnectorInstance()
  console.log(connectorInstance?.connected)

  if (connectorInstance && connectorInstance?.connected) {
    handleKillSessionConnector()
  }

  deleteWalletAddressFromStorage()
  changeContext({
    walletAddress: null,
    userAccountSignature: null,
    showModalConnectWallet: null
  })
}
