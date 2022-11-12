import { Contract } from 'ethers'

import { getProvider, getWalletConnectProvider } from '../providers'
import erc20TokenContract from '../../contracts/interfaces/IERC20.json'
import fmoneyRaffleManagerContract from '../../contracts/interfaces/IFmoneyRaffleManager.json'
const context: any = window

export const getTransactionConfirmedData = (transactionHash: any, confirmationsToSet: any, provider: any) => {
  return new Promise((resolve, reject) => {
    let retriesMade = 0
    const retriesAllowed = 24
    const interval = 5000
    const confirmationsToWait = confirmationsToSet ? confirmationsToSet : 3

    const checkTxConfirmations = async () => {
      const timeoutInstance = setTimeout(checkTxConfirmations, interval)
      const transactionReceipt = await provider.getTransactionReceipt(transactionHash)

      if (transactionReceipt && transactionReceipt.confirmations >= confirmationsToWait) {
        clearTimeout(timeoutInstance)
        resolve(transactionReceipt)
      }

      if (retriesMade >= retriesAllowed) {
        reject({
          success: false,
          errorCode: 504,
          message: 'The transaction was not confirmed in time, please try later.'
        })
      }

      retriesMade++
    }

    checkTxConfirmations()
  })
}

export const handleApproveTransfer = async (selectedTokenToBuyTickets: string) => {
  try {
    const provider = context.ethereum ? getProvider() : await getWalletConnectProvider()
    const userAccountSigner = provider.getSigner()

    const raffleCashierContractAddress: string = sessionStorage.getItem('currentCashierSmartContract') || ''
    /* const raffleManagerInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, userAccountSigner)
    const raffleCashierContractAddress = await raffleManagerInstance.raffleCashier() */

    const selectedTokenContractInstance = new Contract(selectedTokenToBuyTickets, erc20TokenContract.abi, userAccountSigner)
    const selectedTokenTotalSupply = await selectedTokenContractInstance.totalSupply()

    const transferApprovalTx = await selectedTokenContractInstance.approve(raffleCashierContractAddress, BigInt(Number(selectedTokenTotalSupply)))
    const response: any = await getTransactionConfirmedData(transferApprovalTx.hash, 1, provider)

    return { success: true, ...response }
  } catch (error) {
    return { success: false, error }
  }
}
