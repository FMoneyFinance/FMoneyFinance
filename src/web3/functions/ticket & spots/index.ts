import { Contract } from 'ethers'
import { getConnectorInstance } from '../../walletConnect'
import { getInLocalOrSession } from '../../../utils/storage'
import { getTransactionConfirmedData } from '../transactions'
import { getProvider, getWalletConnectProvider } from '../providers'
import { generate_ticket_api } from '../../../api/tickets-management'
import erc20TokenContract from '../../contracts/interfaces/IERC20.json'
import { getDefaultAccount, getWalletConnectDefaultAccount } from '../accounts/index'
import fmoneyRaffleManagerContract from '../../contracts/interfaces/IFmoneyRaffleManager.json'
import fmoneyRaffleOperatorContract from '../../contracts/interfaces/IFmoneyRaffleOperator.json'
const context: any = window

export const handleBuyTicket = async (selectedRaffleToBuyTicket: any, valuesToPay: any, selectedRaffleSlots: any, ticketMetadataRegisteredIpfsHashes: any, tokenToUseToBuyTickets: any) => {
  try {
    const provider = context.ethereum ? getProvider() : await getWalletConnectProvider()
    const userAccountSigner = provider.getSigner()
    const defaultAccount = context.ethereum ? getDefaultAccount() : getWalletConnectDefaultAccount()
    // const tokenToUseToBuyTickets = import.meta.env.VITE_USDC_CONTRACT_ADDRESS // ATTN
    const fmoneyRaffleOperatorContractInstance = new Contract(selectedRaffleToBuyTicket, fmoneyRaffleOperatorContract.abi, userAccountSigner)
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

    const gasLimitEstimation = await fmoneyRaffleOperatorContractInstance.estimateGas.buyTicketsToPlay(BigInt(Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals))), selectedRaffleSlots, ticketsURI, tokenToUseToBuyTickets)

    const feeNumber = 2 // Este o más al ser prioridad alta
    let currentFeeData = await provider.getFeeData()
    let maxPriorityFeePerGas = feeNumber * Number('1e+9')
    let gasPriceToPay = Number(currentFeeData.gasPrice) + Number(maxPriorityFeePerGas)

    console.log('userAccountSigner', userAccountSigner.address)
    console.log('defaultAccount', defaultAccount)

    let nonceOffset = 0
    const baseNonce = await provider.getTransactionCount(defaultAccount, 'latest')
    const currentNonce = baseNonce + nonceOffset++

    const newRaffleTicketsBoughtTx = await fmoneyRaffleOperatorContractInstance.buyTicketsToPlay(BigInt(Number(Math.round(valuesToPay.currentPriceOfTokenToUseWithoutDecimals))), selectedRaffleSlots, ticketsURI, tokenToUseToBuyTickets, {
      nonce: currentNonce,
      gasLimit: Number(gasLimitEstimation),
      gasPrice: gasPriceToPay
    })
    const transactionReceipt: any = await getTransactionConfirmedData(newRaffleTicketsBoughtTx.hash, 1, provider)

    if (transactionReceipt.logs.length === 0) {
      return { success: false, error: 'Your raffle spots was already sold' }
    }

    return { success: true, ...newRaffleTicketsBoughtTx }
  } catch (error: any) {
    console.log(error)
    return { success: false, error: error.reason ? error.reason.split(':')[1].trim() : error }
  }
}

export const handleGetAvailableSpots = async (raffleToBuyTickets: any) => {
  const connectorInstance = getConnectorInstance()

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

  return { success: true, spots: fmoneyRaffleSlotsDataUpdated }
}