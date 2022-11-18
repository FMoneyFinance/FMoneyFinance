import { Contract, utils } from 'ethers'
import { getConnectorInstance } from '../../walletConnect'
import { getInLocalOrSession } from '../../../utils/storage'
import { getTransactionConfirmedData } from '../transactions'
import { getProvider, getWalletConnectProvider } from '../providers'
import erc20TokenContract from '../../contracts/interfaces/IERC20.json'
import { getDefaultAccount, getWalletConnectDefaultAccount } from '../accounts/index'
import fmoneyRaffleCashierContract from '../../contracts/interfaces/IFmoneyRaffleCashier.json'
import fmoneyRaffleManagerContract from '../../contracts/interfaces/IFmoneyRaffleManager.json'
import fmoneyRaffleOperatorContract from '../../contracts/interfaces/IFmoneyRaffleOperator.json'
import { get_raffle_available_spots, register_tickets_bought } from '../../../api/tickets-management'
const context: any = window

export const handleBuyTicket = async (selectedRaffleToBuyTicket: any, valuesToPay: any, selectedRaffleSlots: any, ticketMetadataRegisteredIpfsHashes: any, tokenToUseToBuyTickets: any, currentCashierSmartContract: any) => {
  try {
    const provider = context.ethereum ? getProvider() : await getWalletConnectProvider()
    const userAccountSigner = provider.getSigner()
    const connectorInstance = context.ethereum ? null : getConnectorInstance()
    const defaultAccount = context.ethereum ? getDefaultAccount() : getWalletConnectDefaultAccount()
    // const tokenToUseToBuyTickets = import.meta.env.VITE_USDC_CONTRACT_ADDRESS // ATTN
    // const fmoneyRaffleOperatorContractInstance = new Contract(selectedRaffleToBuyTicket, fmoneyRaffleOperatorContract.abi, userAccountSigner)
    const ticketsURI = []

    for (let i = 0; i < ticketMetadataRegisteredIpfsHashes?.length; i++) {
      ticketsURI.push(`https://ipfs.io/ipfs/${ticketMetadataRegisteredIpfsHashes[i]}`)
    }

    console.log({
      currentPriceOfTokenToUseWithoutDecimals: Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals)),
      selectedRaffleSlots,
      ticketsURI,
      tokenToUseToBuyTickets,
      selectedRaffleToBuyTicket
    })

    // const tokenToUseToBuyTicketsInstance = new Contract(import.meta.env.VITE_FMON_CONTRACT_ADDRESS, erc20TokenContract.abi, userAccountSigner)
    const tokenToUseToBuyTicketsInstance = new Contract(tokenToUseToBuyTickets, erc20TokenContract.abi, userAccountSigner)
    const currentWalletBalanceOfToken = await tokenToUseToBuyTicketsInstance.balanceOf(defaultAccount)
    const currentWalletAllowance = await tokenToUseToBuyTicketsInstance.allowance(defaultAccount, currentCashierSmartContract)

    if (Number(currentWalletBalanceOfToken) < Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals))) {
      return { success: false, error: 'You do not have balance to make this transaction' }
    }

    console.log('currentWalletBalanceOfToken', currentWalletBalanceOfToken)
    console.log('currentWalletAllowance', Number(currentWalletAllowance))
    console.log('currentPriceOfTokenToUseWithoutDecimals', Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals)))

    const fmoneyRaffleCashierContractInstance = new Contract(currentCashierSmartContract, fmoneyRaffleCashierContract.abi, userAccountSigner)
    const gasLimitEstimation = await fmoneyRaffleCashierContractInstance.estimateGas.buyTicketsToPlay(BigInt(Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals))), tokenToUseToBuyTickets)

    const ifaceRaffleCashier = new utils.Interface(fmoneyRaffleCashierContract.abi)
    const buyFunctionDataEncoded = ifaceRaffleCashier.encodeFunctionData('buyTicketsToPlay', [BigInt(Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals))), tokenToUseToBuyTickets])

    /* const gasLimitEstimation = await fmoneyRaffleOperatorContractInstance.estimateGas.buyTicketsToPlay(BigInt(Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals))), selectedRaffleSlots, ticketsURI, tokenToUseToBuyTickets) */

    const feeNumber = 2 // Este o más al ser prioridad alta
    let currentFeeData = await provider.getFeeData()
    let maxPriorityFeePerGas = feeNumber * Number('1e+9')
    let gasPriceToPay = Number(currentFeeData.gasPrice) + Number(maxPriorityFeePerGas)

    console.log('userAccountSigner', userAccountSigner.address)
    console.log('defaultAccount', defaultAccount)

    let nonceOffset = 0
    let buyTicketsTransactionHash = ''
    const baseNonce = await provider.getTransactionCount(defaultAccount, 'latest')
    const currentNonce = baseNonce + nonceOffset++

    if (connectorInstance) {
      const buyTicketsToPlayRawTx = {
        from: defaultAccount,
        to: currentCashierSmartContract,
        data: buyFunctionDataEncoded,
        nonce: currentNonce
      }

      const transactionResult = await connectorInstance.sendTransaction(buyTicketsToPlayRawTx)
      const transactionReceipt: any = await getTransactionConfirmedData(transactionResult, 1, provider)
      buyTicketsTransactionHash = transactionResult
    } else {
      const newRaffleTicketsBoughtTx = await fmoneyRaffleCashierContractInstance.buyTicketsToPlay(BigInt(Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals))), tokenToUseToBuyTickets, {
        nonce: currentNonce,
        gasLimit: Number(gasLimitEstimation),
        gasPrice: gasPriceToPay
      })
      console.log('newRaffleTicketsBoughtTx.hash', newRaffleTicketsBoughtTx.hash)
      const transactionReceipt: any = await getTransactionConfirmedData(newRaffleTicketsBoughtTx.hash, 1, provider)
      buyTicketsTransactionHash = newRaffleTicketsBoughtTx.hash
      console.log('transactionReceipt', transactionReceipt)
    }

    /* const newRaffleTicketsBoughtTx = await fmoneyRaffleOperatorContractInstance.buyTicketsToPlay(BigInt(Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals))), selectedRaffleSlots, ticketsURI, tokenToUseToBuyTickets, {
      nonce: currentNonce,
      gasLimit: Number(gasLimitEstimation),
      gasPrice: gasPriceToPay
    }) */

    /* if (transactionReceipt.logs.length === 0) {
      return { success: false, error: 'Your raffle spots was already sold' }
    }

    return { success: true, ...newRaffleTicketsBoughtTx } */

    const payload: object = {
      defaultAccount,
      currentPriceOfTokenToUseWithoutDecimals: Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals)),
      selectedRaffleSlots,
      ticketsURI,
      tokenToUseToBuyTickets,
      selectedRaffleToBuyTicket
    }

    try {
      const response: any = await register_tickets_bought(payload, context)
      return { success: true, spots: response.fmoneyRaffleSlotsDataUpdated }
    } catch (error) {
      console.log('error registerTicketsBought', error)
      return
    }

    /* return { success: true, ...newRaffleTicketsBoughtTx } */
    return { success: true, hash: buyTicketsTransactionHash }
  } catch (error: any) {
    console.log(error)
    return { success: false, error: error.reason ? error.reason.split(':')[1].trim() : error }
  }
}

export const handleGetAvailableSpots = async (raffleToBuyTickets: any) => {
  const payload: object = {
    raffleToBuyTickets
  }

  try {
    const response: any = await get_raffle_available_spots(payload, context)
    return { success: true, spots: response.fmoneyRaffleSlotsDataUpdated }
  } catch (error) {
    console.log('error handleGetAvailableSpots', error)
  }

  /* const connectorInstance = getConnectorInstance()

  const chainId = context.ethereum ? await context?.ethereum?.request({ method: 'eth_chainId' }) : connectorInstance.connected ? String(connectorInstance.chainId) : ''

  if (chainId !== '' && context.ethereum && chainId !== import.meta.env.VITE_CHAIN_ID_METAMASK) {
    return { success: false, message: 'wrong-chain' }
  }

  if (chainId !== '' && !context.ethereum && String(chainId) !== import.meta.env.VITE_CHAIN_ID_WALLETCONNECT) {
    return { success: false, message: 'wrong-chain' }
  }

  const provider = context.ethereum ? getProvider() : connectorInstance.connected ? await getWalletConnectProvider() : null
  const fmoneyRaffleSlotsDataUpdated = []

  if (provider !== null) {
    const fmoneyRaffleOperatorContractInstance = new Contract(raffleToBuyTickets, fmoneyRaffleOperatorContract.abi, provider)
    const maxNumberOfPlayers = await fmoneyRaffleOperatorContractInstance?.maxNumberOfPlayers()
    const raffleTicketOwners = await fmoneyRaffleOperatorContractInstance.getRaffleTicketOwners()
    const rafflePlayerNumbers = raffleTicketOwners[1].map((numberData: any) => Number(numberData))
    const ticketOwnersAddresses = raffleTicketOwners[0]
    let ticketOwnersAddressesCounter = 0

    for (let i = 1; i <= maxNumberOfPlayers; i++) {
      if (rafflePlayerNumbers.includes(i)) {
        fmoneyRaffleSlotsDataUpdated.push({ position: i, owner: ticketOwnersAddresses[ticketOwnersAddressesCounter] })
        ticketOwnersAddressesCounter++
      } else {
        fmoneyRaffleSlotsDataUpdated.push({ position: i, owner: '' })
      }
    }
  }

  return { success: true, spots: fmoneyRaffleSlotsDataUpdated } */
}
