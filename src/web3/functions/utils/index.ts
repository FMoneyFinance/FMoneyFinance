import { Contract } from 'ethers'

import { getProvider, getWalletConnectProvider } from '../providers'
import erc20TokenContract from '../../contracts/interfaces/IERC20.json'
const context: any = window

export const getDecimalsOfUSDC = async () => {
  const provider = context.ethereum ? getProvider() : await getWalletConnectProvider()
  const usdcContractInstance = new Contract(import.meta.env.VITE_USDC_CONTRACT_ADDRESS, erc20TokenContract.abi, provider)
  const usdcTokenDecimals = await usdcContractInstance.decimals()
  const usdcTokenDecimalsDivider = Number(`1e+${usdcTokenDecimals}`)

  return usdcTokenDecimalsDivider
}
