// import { useTranslation } from 'react-i18next'
import { Contract, providers, utils } from 'ethers'

import { CheckMetamaskInstalled } from '../metamask'
import { getInLocalOrSession } from '../../../utils/storage'
import { getTransactionConfirmedData } from '../transactions'
import { getProvider, getWalletConnectProvider } from '../providers'
import { create_raffle_api } from '../../../api/tickets-management'
import erc20TokenContract from '../../contracts/interfaces/IERC20.json'
import { getDefaultAccount, getWalletConnectDefaultAccount } from '../accounts/index'
import { getConnectorInstance, handleKillSessionConnector } from '../../walletConnect'
import fmoneyRaffleManagerContract from '../../contracts/interfaces/IFmoneyRaffleManager.json'
import fmoneyRaffleOperatorContract from '../../contracts/interfaces/IFmoneyRaffleOperator.json'

const context: any = window

export const getRafflesInfo = async () => {
  const provider = context.ethereum ? getProvider() : await getWalletConnectProvider()
  const currentManagerSmartContract: string = sessionStorage.getItem('currentManagerSmartContract') || ''
  // const fmoneyRaffleManagerContractInstance = new Contract(import.meta.env.VITE_FMONEY_RAFFLE_MANAGER_GOERLI, fmoneyRaffleManagerContract.abi, provider)
  const fmoneyRaffleManagerContractInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, provider)
  const usdcContractInstance = new Contract(import.meta.env.VITE_USDC_CONTRACT_ADDRESS, erc20TokenContract.abi, provider)

  const usdcTokenDecimals = await usdcContractInstance.decimals()
  const usdcTokenDecimalsDivider = Number(`1e+${usdcTokenDecimals}`)
  const tableDataToSet = []
  const currentRafflesLength = await fmoneyRaffleManagerContractInstance.allRafflesLength()

  let raffleWinnerPlayer = null

  for (let i = 0; i < currentRafflesLength; i++) {
    const raffleSmartContractAddress = await fmoneyRaffleManagerContractInstance.rafflesAddresses(i)
    const fmoneyRaffleOperatorContractInstance = new Contract(raffleSmartContractAddress, fmoneyRaffleOperatorContract.abi, provider)
    const raffleStatus = await fmoneyRaffleOperatorContractInstance.running()
    const dateOfDraw = await fmoneyRaffleOperatorContractInstance.dateOfDraw()
    const currentPrizePot = await fmoneyRaffleOperatorContractInstance.getRafflePotBalance()
    const priceOfTheRaffleTicketInUSDC = await fmoneyRaffleOperatorContractInstance.priceOfTheRaffleTicketInUSDC()
    const maxNumberOfPlayers = await fmoneyRaffleOperatorContractInstance.maxNumberOfPlayers()
    const currentNumOfPlayers = await fmoneyRaffleOperatorContractInstance.getRaffleTicketBuyers()

    try {
      raffleWinnerPlayer = await fmoneyRaffleOperatorContractInstance.getRaffleWinnerPlayer()
    } catch (error) {
      console.log('raffleWinnerPlayer error', error)
    }

    const percentageOfPrizeToOperator = await fmoneyRaffleOperatorContractInstance.percentageOfPrizeToOperator()

    tableDataToSet.push({
      raffleStatus: raffleStatus === true ? 'OPEN' : 'CLOSED',
      dateOfDraw: new Date(Number(dateOfDraw) * 1000),
      currentPrizePot: `$${currentPrizePot / usdcTokenDecimalsDivider} USDC`,
      priceOfTheRaffleTicketInUSDC: `$${priceOfTheRaffleTicketInUSDC / usdcTokenDecimalsDivider} USDC`,
      maxNumberOfPlayers,
      raffleWinnerPlayer,
      currentNumOfPlayers: Number(currentNumOfPlayers[1]),
      percentageOfPrizeToOperator: `${percentageOfPrizeToOperator}%`,
      raffleSmartContractAddress
    })
  }

  return tableDataToSet
}

export const CreateRaffleFunct = async ({ selectedRaffleName, selectedDateOfDraw, selectedPriceOfTheRaffleTicket, selectedPercentageOfPrizeToOperator, selectedMaxNumberOfPlayers, errorDate, translation }: any) => {
  // const { t } = useTranslation(['modalCreateRaffle'])

  let isFormValid = true
  const errors: any = {}

  const currentTimestamp = new Date().getTime()
  console.log('new Date()', new Date())
  const selectedDateOfDrawTimestamp = new Date(selectedDateOfDraw).getTime()
  console.log('selectedDateOfDraw', new Date(selectedDateOfDraw))
  const differenceBetweenDates = selectedDateOfDrawTimestamp - currentTimestamp
  console.log('differenceBetweenDates', differenceBetweenDates)

  const daysDifference = Math.ceil(differenceBetweenDates / (1000 * 60 * 60 * 24))
  console.log('daysDifference', daysDifference)

  const minsDifference = Math.round(((differenceBetweenDates % 86400000) % 3600000) / 60000)
  console.log('minsDifference', minsDifference)

  if (daysDifference < 1 && minsDifference < 30) {
    isFormValid = false
    errors.selectedDateOfDraw = translation('errors.selectedDateOfDraw')
  }

  if (!selectedRaffleName) {
    isFormValid = false
    errors.selectedRaffleName = translation('errors.selectedRaffleName')
  }

  if (selectedRaffleName && selectedRaffleName.length > 25) {
    isFormValid = false
    errors.selectedRaffleName = translation('errors.selectedRaffleName')
  }

  if (!selectedPriceOfTheRaffleTicket) {
    isFormValid = false
    errors.selectedPriceOfTheRaffleTicket = translation('errors.selectedPriceOfTheRaffleTicket')
  }

  if (selectedPriceOfTheRaffleTicket && isNaN(selectedPriceOfTheRaffleTicket)) {
    isFormValid = false
    errors.selectedPriceOfTheRaffleTicket = translation('errors.selectedPriceOfTheRaffleTicketHasNumber')
  }

  if (selectedPriceOfTheRaffleTicket && !isNaN(selectedPriceOfTheRaffleTicket) && selectedPriceOfTheRaffleTicket < 0) {
    isFormValid = false
    errors.selectedPriceOfTheRaffleTicket = translation('errors.selectedPriceOfTheRaffleTicketPositiveNumber')
  }

  if (!selectedMaxNumberOfPlayers) {
    isFormValid = false
    errors.selectedMaxNumberOfPlayers = translation('errors.selectedMaxNumberOfPlayers')
  }

  if (selectedMaxNumberOfPlayers && isNaN(selectedMaxNumberOfPlayers)) {
    isFormValid = false
    errors.selectedMaxNumberOfPlayers = translation('errors.selectedMaxNumberOfPlayersHasNumber')
  }

  if (selectedMaxNumberOfPlayers && !isNaN(selectedMaxNumberOfPlayers) && selectedMaxNumberOfPlayers < 0) {
    isFormValid = false
    errors.selectedMaxNumberOfPlayers = translation('errors.selectedMaxNumberOfPlayersPositiveNumber')
  }

  if (!selectedPercentageOfPrizeToOperator) {
    isFormValid = false
    errors.selectedPercentageOfPrizeToOperator = translation('errors.selectedPercentageOfPrizeToOperator')
  }

  if (selectedPercentageOfPrizeToOperator && isNaN(selectedPercentageOfPrizeToOperator)) {
    isFormValid = false
    errors.selectedPercentageOfPrizeToOperator = translation('errors.selectedPercentageOfPrizeToOperatorHasNumber')
  }

  if (selectedPercentageOfPrizeToOperator && !isNaN(selectedPercentageOfPrizeToOperator) && selectedPercentageOfPrizeToOperator > 100) {
    isFormValid = false
    errors.selectedPercentageOfPrizeToOperator = translation('errors.selectedPercentageOfPrizeToOperatorPositiveNumber')
  }

  if (selectedPercentageOfPrizeToOperator && !isNaN(selectedPercentageOfPrizeToOperator) && selectedPercentageOfPrizeToOperator < 0) {
    isFormValid = false
    errors.selectedPercentageOfPrizeToOperator = translation('errors.selectedPercentageOfPrizeToOperatorPositiveNumber')
  }

  if (!isFormValid) {
    return { success: false, errors }
  }

  if (!CheckMetamaskInstalled()) {
    const connectorInstance = getConnectorInstance()
    console.log(connectorInstance.connected)

    if (connectorInstance.connected && String(connectorInstance.chainId) !== import.meta.env.VITE_CHAIN_ID_LAYER_2_WALLETCONNECT) {
      handleKillSessionConnector()
      // location.reload()
      return { success: false, errors: { selectedMaxNumberOfPlayers: import.meta.env.VITE_CHAIN_ID_LAYER_2_WALLETCONNECT === '80001' ? translation('errors.changeConnectorNetworkTesnet') : translation('errors.changeConnectorNetworkMainnet') } }
    }
  } else {
    const isConnected = context?.ethereum?.isConnected()
    const chainId = await context?.ethereum?.request({ method: 'eth_chainId' })

    if (isConnected && chainId !== import.meta.env.VITE_CHAIN_ID_LAYER_2_METAMASK) {
      return { success: false, errors: { selectedMaxNumberOfPlayers: import.meta.env.VITE_CHAIN_ID_LAYER_2_WALLETCONNECT === '80001' ? translation('errors.changeConnectorNetworkTesnet') : translation('errors.changeConnectorNetworkMainnet') } }
    }
  }

  const provider = context.ethereum ? getProvider() : await getWalletConnectProvider()
  const defaultAccount = context.ethereum ? getDefaultAccount() : getWalletConnectDefaultAccount()
  let nonceOffset = 0
  const baseNonce = await provider.getTransactionCount(defaultAccount, 'latest')
  const currentNonce = baseNonce + nonceOffset++
  const userAccountSigner = provider.getSigner()

  const currentManagerSmartContract: string = sessionStorage.getItem('currentManagerSmartContract') || ''
  // const fmoneyRaffleManagerContractInstance = new Contract(import.meta.env.VITE_FMONEY_RAFFLE_MANAGER_GOERLI, fmoneyRaffleManagerContract.abi, userAccountSigner)
  console.log('currentManagerSmartContract', currentManagerSmartContract)
  const fmoneyRaffleManagerContractInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, userAccountSigner)
  const currentNumOfRaffles = await fmoneyRaffleManagerContractInstance.allRafflesLength()

  // const usdcContractInstance = new Contract(import.meta.env.VITE_USDC_CONTRACT_ADDRESS, erc20TokenContract.abi, provider)

  // const usdcTokenDecimals = await usdcContractInstance.decimals()
  // const usdcTokenDecimalsDivider = Number(`1e+${usdcTokenDecimals}`)
  let gasLimitEstimation = null

  try {
    /* gasLimitEstimation = await fmoneyRaffleManagerContractInstance.estimateGas.createRaffle(
      import.meta.env.VITE_USDC_CONTRACT_ADDRESS,
      Math.round(new Date(selectedDateOfDraw).getTime() / 1000),
      // `FMoney Raffle No. ${Number(currentNumOfRaffles) + 1}`,
      selectedRaffleName,
      2, // selectedMinNumberOfPlayers
      selectedMaxNumberOfPlayers,
      `FMON-V1-${Math.round(new Date(selectedDateOfDraw).getTime() / 1000)}`,
      selectedPercentageOfPrizeToOperator,
      selectedPriceOfTheRaffleTicket * usdcTokenDecimalsDivider
    ) */

    gasLimitEstimation = await fmoneyRaffleManagerContractInstance.estimateGas.createRaffle(Math.round(new Date(selectedDateOfDraw).getTime() / 1000), selectedRaffleName, 2, selectedMaxNumberOfPlayers, `FMON-V1-${Math.round(new Date(selectedDateOfDraw).getTime() / 1000)}`, selectedPercentageOfPrizeToOperator, selectedPriceOfTheRaffleTicket)
  } catch (error: any) {
    console.log('error', error)
    return { success: false, error }
  }

  const feeNumber = 2 // Este o más al ser prioridad alta
  let currentFeeData = await provider.getFeeData()
  let maxPriorityFeePerGas = feeNumber * Number('1e+9')
  let gasPriceToPay = Number(currentFeeData.gasPrice) + Number(maxPriorityFeePerGas)
  let creationOfRaffleTx: any = {}

  try {
    /* creationOfRaffleTx = await fmoneyRaffleManagerContractInstance.createRaffle(
      import.meta.env.VITE_USDC_CONTRACT_ADDRESS,
      Math.round(new Date(selectedDateOfDraw).getTime() / 1000),
      // `FMoney Raffle No. ${Number(currentNumOfRaffles) + 1}`,
      selectedRaffleName,
      2, // selectedMinNumberOfPlayers
      selectedMaxNumberOfPlayers,
      `FMON-V1-${Math.round(new Date(selectedDateOfDraw).getTime() / 1000)}`,
      selectedPercentageOfPrizeToOperator,
      selectedPriceOfTheRaffleTicket * usdcTokenDecimalsDivider,
      {
        nonce: currentNonce,
        gasLimit: Number(gasLimitEstimation),
        gasPrice: gasPriceToPay
      }
    ) */

    creationOfRaffleTx = await fmoneyRaffleManagerContractInstance.createRaffle(Math.round(new Date(selectedDateOfDraw).getTime() / 1000), selectedRaffleName, 2, selectedMaxNumberOfPlayers, `FMON-V1-${Math.round(new Date(selectedDateOfDraw).getTime() / 1000)}`, selectedPercentageOfPrizeToOperator, selectedPriceOfTheRaffleTicket, {
      nonce: currentNonce,
      gasLimit: Number(gasLimitEstimation),
      gasPrice: gasPriceToPay
    })
  } catch (error: any) {
    return { success: false, error }
  }

  const userAccountSignature = getInLocalOrSession('userAccountSignature')
  const newRaffleData = {
    raffleStatus: 'creating',
    // raffleName: `FMoney Raffle No. ${Number(currentNumOfRaffles) + 1}`,
    raffleName: selectedRaffleName,
    raffleTxHashCreation: creationOfRaffleTx.hash,
    raffleSymbol: `FMON-V1-${Math.round(new Date(selectedDateOfDraw).getTime() / 1000)}`,
    maxNumberOfPlayers: Number(selectedMaxNumberOfPlayers),
    timestampDateOfDraw: Math.round(new Date(selectedDateOfDraw).getTime() / 1000),
    percentageOfPrizeToOperator: Number(selectedPercentageOfPrizeToOperator),
    priceOfTheRaffleTicketInUSDC: Number(selectedPriceOfTheRaffleTicket)
  }

  const payload: object = {
    ...newRaffleData,
    userAccountSignature,
    defaultAccount
  }

  const response: any = await create_raffle_api(payload)

  return response
}

export const GetTimestampRaffle = async (selectedRaffe: string) => {
  /* const provider = context.ethereum ? getProvider() : await getWalletConnectProvider()
  const fmoneyRaffleOperatorContractInstance = new Contract(selectedRaffe, fmoneyRaffleOperatorContract.abi, provider)
  const fmoneyRaffleDateTimestamp = await fmoneyRaffleOperatorContractInstance.dateOfDraw() */
  console.log('localStorage GetTimestampRaffle', localStorage, localStorage.getItem('state'))

  const currentStateInfo = JSON.parse(localStorage.getItem('state') || '{}')
  const raffleSelectedInfo = currentStateInfo.rafflesInfo.filter((raffleInfo: any) => String(raffleInfo.raffleSmartContractAddress) === String(selectedRaffe))
  const fmoneyRaffleDateTimestamp = raffleSelectedInfo.length > 0 ? raffleSelectedInfo[0].timestampDateOfDraw : 1668283200

  return Number(fmoneyRaffleDateTimestamp)
}

export const GetRaffleId = async (selectedRaffleToBuyTicket: string) => {
  /* const provider = context.ethereum ? getProvider() : await getWalletConnectProvider()
  const currentManagerSmartContract: string = sessionStorage.getItem('currentManagerSmartContract') || ''
  const fmoneyRaffleManagerContractInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, provider)
  const currentRaffleId = await fmoneyRaffleManagerContractInstance.currentRaffleId()
  let fmoneyRaffleId = 0

  for (let i = 0; i < currentRaffleId; i++) {
    const raffleContractAddress = await fmoneyRaffleManagerContractInstance.rafflesAddresses(i)

    if (String(raffleContractAddress).toLowerCase() === String(selectedRaffleToBuyTicket).toLowerCase()) {
      fmoneyRaffleId = i
    }
  } */

  console.log('localStorage GetRaffleId', localStorage, localStorage.getItem('state'))

  const currentStateInfo = JSON.parse(localStorage.getItem('state') || '{}')
  const raffleSelectedInfo = currentStateInfo.rafflesInfo.filter((raffleInfo: any) => String(raffleInfo.raffleSmartContractAddress) === String(selectedRaffleToBuyTicket))
  const fmoneyRaffleId = raffleSelectedInfo.length > 0 ? raffleSelectedInfo[0].raffleId : '0'

  return fmoneyRaffleId
}
