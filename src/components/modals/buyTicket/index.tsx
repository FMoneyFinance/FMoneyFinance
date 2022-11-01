import React, { useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isMobile } from 'react-device-detect'
import socketIo from 'socket.io-client'
import { Contract } from 'ethers'

import './styles.scss'
import Logo from '../../logo'
import Button from '../../Buttons'
import FullModal from '../base/full'
import BuyTicketsModal from '../buyTickets'
import SelectToken from './parts/selectToken'
import FormSendEmailTickets from './parts/form'
import AppContext from '../../../context/AppContext'
import ApproveTokenBuy from './parts/approveTokenBuy'
import LoaderCountdown from './parts/LoaderCountdown'
import BasicSpinner from '../../elements/loader/basic'
import LogoLoader from '../../../assets/logos/main.webp'
import { getDecimalsOfUSDC } from '../../../web3/functions/utils'
import pairContract from '../../../web3/contracts/interfaces/IPair.json'
import { handleBuyTicket } from '../../../web3/functions/ticket & spots'
import { CheckMetamaskInstalled } from '../../../web3/functions/metamask'
import { handleApproveTransfer } from '../../../web3/functions/transactions'
import factoryContract from '../../../web3/contracts/interfaces/IFactory.json'
import erc20TokenContract from '../../../web3/contracts/interfaces/IERC20.json'
import { GetRaffleId, GetTimestampRaffle } from '../../../web3/functions/raffles'
import aggregatorV3Contract from '../../../web3/contracts/interfaces/aggregatorV3.json'
import { generate_links_api, has_to_approve_api } from '../../../api/tickets-management'
import { getProvider, getWalletConnectProvider } from '../../../web3/functions/providers'
import ticketanddivider from '../../../assets/ilustrations/landingpage/ticketanddivider.svg'
import { send_ticket_to_email_api, download_tickets } from '../../../api/tickets-management/index'
import fmoneyRaffleManagerContract from '../../../web3/contracts/interfaces/IFmoneyRaffleManager.json'

const io: any = socketIo

function ModalBuyTicket({ listSpotsToBuy, allSpots, onCloseModal, getraffleSpots, raffleSelected }: any) {
  const [email, setEmail] = useState('')
  const [check, setCheck] = useState(false)
  const context: any = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<any>(false)
  const [textButton, setTextButton] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [index, setIndex] = useState('selectToken')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [valuesToPay, setValuesToPay] = useState<any>(null)
  const [disableButton, setDisableButton] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [approvingToken, setApprovingToken] = useState(false)
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [allSpotsHook, setAllSpotsHook] = useState<number[]>([])
  const [errorSelectedToken, setErrorSelectedToken] = useState(false)
  const [responseBuyTicket, setResponseBuyTicket] = useState<any | any>({})
  const [socketConnectionInstance, setSocketConnectionInstance] = useState<any>()
  const [responseGenerateLinks, setResponseGenerateLinks] = useState<any | any>({})
  const [selectedRaffleSmartContract, setSelectedRaffleSmartContract] = useState('')
  const [currentPriceOfTokenToUseWithDecimals, setCurrentPriceOfTokenToUseWithDecimals] = useState(0)
  const [positionToBuy, setpositionToBuy] = useState(listSpotsToBuy?.map((e: any) => e.position) || [])
  const [currentPriceOfTokenToUseWithoutDecimals, setCurrentPriceOfTokenToUseWithoutDecimals] = useState(0)
  const [selectedTokenToBuyTickets, setSelectedTokenToBuyTickets] = useState<any | any>(JSON.parse(localStorage.getItem('defaultToken') || '{}'))
  const { t } = useTranslation(['modalBuyTicket'])

  useEffect(() => {
    handleGetraffleSpots()
    setSelectedTokenToBuyTickets(JSON.parse(localStorage.getItem('defaultToken') || '{}'))

    if (localStorage.getItem('defaultToken')) {
      setIndex('')
    }

    context.socketConnection.on('current-raffles-tickets-info', (raffleTicketsInfo: any) => {
      setSelectedRaffleSmartContract((currentSelectedRaffleSmartContract) => {
        if (String(raffleTicketsInfo.raffleSmartContractAddress).toLowerCase() === String(currentSelectedRaffleSmartContract).toLowerCase()) {
          handleUpdateTicketsInfo(raffleTicketsInfo.ticketsCurrentFullInfo)
        }

        return currentSelectedRaffleSmartContract
      })
    })

    return () => {
      context.socketConnection.off('current-raffles-tickets-info')
    }
  }, [])

  useEffect(() => {
    setSelectedRaffleSmartContract(raffleSelected?.raffleSmartContractAddress)
  }, [raffleSelected?.raffleSmartContractAddress])

  useEffect(() => {
    if (dataLoaded) {
      checkApprovePoint(listSpotsToBuy)

      if (positionToBuy.length !== listSpotsToBuy.length && listSpotsToBuy.length > 0) {
        setpositionToBuy(listSpotsToBuy?.map((e: any) => e.position) || [])
      }
    }
  }, [listSpotsToBuy])

  useEffect(() => {
    if (selectedTokenToBuyTickets?.tokenSmartContract && String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() !== String(import.meta.env.VITE_USDC_CONTRACT_ADDRESS).toLowerCase()) {
      // handleGetCurrentTokenPriceByUSDC()
      handleGetCurrentTokenPriceByETH()
    }

    if (selectedTokenToBuyTickets?.tokenSmartContract && String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() === String(import.meta.env.VITE_USDC_CONTRACT_ADDRESS).toLowerCase()) {
      handleCalculateValuesToPay()
    }
  }, [positionToBuy, selectedTokenToBuyTickets])

  useEffect(() => {
    handleCalculateValuesToPay()
  }, [currentPriceOfTokenToUseWithDecimals])

  const handleGetCurrentTokenPriceByETH = async () => {
    const provider = CheckMetamaskInstalled() ? getProvider() : await getWalletConnectProvider()

    const priceOfTheRaffleTicketInUSDC = raffleSelected?.priceOfTheRaffleTicketInUSDC
    console.log('priceOfTheRaffleTicketInUSDC', priceOfTheRaffleTicketInUSDC)
    const usdcContractInstance = new Contract(import.meta.env.VITE_USDC_CONTRACT_ADDRESS, erc20TokenContract.abi, provider)
    const usdcTokenDecimals = await usdcContractInstance.decimals()
    const usdcTokenDecimalsDivider = Number(`1e+${usdcTokenDecimals}`)

    const factoryContractInstance = new Contract(import.meta.env.VITE_UNISWAP_FACTORY, factoryContract.abi, provider)
    const pairContractAddress = await factoryContractInstance.getPair(selectedTokenToBuyTickets.tokenSmartContract, import.meta.env.VITE_WETH_CONTRACT_ADDRESS)

    const pairContractInstance = new Contract(pairContractAddress, pairContract.abi, provider)
    const pairToken0 = await pairContractInstance.token0()
    const pairToken1 = await pairContractInstance.token1()
    const currentTokensReserves = await pairContractInstance.getReserves()

    const token0ContractInstance = new Contract(pairToken0, erc20TokenContract.abi, provider)
    const token0Decimals = await token0ContractInstance.decimals()
    const token1ContractInstance = new Contract(pairToken1, erc20TokenContract.abi, provider)
    const token1Decimals = await token1ContractInstance.decimals()

    const currentToken0PriceWithoutDecimals = (Number(`1e+${token0Decimals}`) * Number(currentTokensReserves[1])) / Number(currentTokensReserves[0]) // --> For 1 FMON is this ETH
    const currentToken1PriceWithoutDecimals = (Number(`1e+${token1Decimals}`) * Number(currentTokensReserves[0])) / Number(currentTokensReserves[1]) // --> For 1 ETH is this FMON

    const priceFeed = new Contract(import.meta.env.VITE_ETH_USD_PRICE_FEED_ORACLE_ADDRESS, aggregatorV3Contract.abi, provider)
    const latestRoundData = await priceFeed.latestRoundData()
    const priceDecimals = await priceFeed.decimals()
    const priceDecimalsDivider = Number(`1e+${priceDecimals}`)
    const currentPriceETHInUSD = Number(Number(latestRoundData.answer) / priceDecimalsDivider)
    const currentPriceETHInUSDWithoutDecimals = currentPriceETHInUSD * usdcTokenDecimalsDivider
    let currentPriceOfTokenWithoutDecimalsInUSD = 0
    let currentTokenDecimalsDivider = 0

    if (String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() === String(pairToken0).toLowerCase()) {
      currentPriceOfTokenWithoutDecimalsInUSD = (Number(`1e+${token0Decimals}`) * currentPriceETHInUSDWithoutDecimals) / currentToken1PriceWithoutDecimals
      currentTokenDecimalsDivider = Number(`1e+${token0Decimals}`)
    } else if (String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() === String(pairToken1).toLowerCase()) {
      currentPriceOfTokenWithoutDecimalsInUSD = (Number(`1e+${token1Decimals}`) * currentPriceETHInUSDWithoutDecimals) / currentToken0PriceWithoutDecimals
      currentTokenDecimalsDivider = Number(`1e+${token1Decimals}`)
    }

    const priceOfTheRaffleTicketInUSDCWithoutDecimals = priceOfTheRaffleTicketInUSDC * usdcTokenDecimalsDivider

    const selectedTokenUnitsToSendForOneTicketWithoutDecimals = ((priceOfTheRaffleTicketInUSDCWithoutDecimals * currentTokenDecimalsDivider) / currentPriceOfTokenWithoutDecimalsInUSD) * positionToBuy?.length
    const pricePercentageAdjustmentWithoutDecimals = selectedTokenUnitsToSendForOneTicketWithoutDecimals + (selectedTokenUnitsToSendForOneTicketWithoutDecimals * 3) / 100

    const selectedTokenUnitsToSendForOneTicketWithDecimals = selectedTokenUnitsToSendForOneTicketWithoutDecimals / currentTokenDecimalsDivider
    const pricePercentageAdjustment = selectedTokenUnitsToSendForOneTicketWithDecimals + (selectedTokenUnitsToSendForOneTicketWithDecimals * 3) / 100

    setCurrentPriceOfTokenToUseWithDecimals(pricePercentageAdjustment)
    setCurrentPriceOfTokenToUseWithoutDecimals(pricePercentageAdjustmentWithoutDecimals)
    /* console.log('positionToBuy?.length', positionToBuy?.length)
    console.log('currentTokenDecimalsDivider', currentTokenDecimalsDivider) */
    console.log('currentPriceOfTokenWithoutDecimalsInUSD', currentPriceOfTokenWithoutDecimalsInUSD)
    /* console.log('priceOfTheRaffleTicketInUSDCWithoutDecimals', priceOfTheRaffleTicketInUSDCWithoutDecimals)
    console.log('selectedTokenUnitsToSendForOneTicketWithoutDecimals', selectedTokenUnitsToSendForOneTicketWithoutDecimals) */
    console.log('currentPriceOfTokenWithDecimalsInUSD', currentPriceOfTokenWithoutDecimalsInUSD / usdcTokenDecimalsDivider)
  }

  const handleGetCurrentTokenPriceByUSDC = async () => {
    const provider = CheckMetamaskInstalled() ? getProvider() : await getWalletConnectProvider()

    const priceOfTheRaffleTicketInUSDC = raffleSelected?.priceOfTheRaffleTicketInUSDC
    const usdcContractInstance = new Contract(import.meta.env.VITE_USDC_CONTRACT_ADDRESS, erc20TokenContract.abi, provider)
    const usdcTokenDecimals = await usdcContractInstance.decimals()
    const usdcTokenDecimalsDivider = Number(`1e+${usdcTokenDecimals}`)
    const priceOfTheRaffleTicketInUSDCWithoutDecimals = priceOfTheRaffleTicketInUSDC * usdcTokenDecimalsDivider

    const factoryContractInstance = new Contract(import.meta.env.VITE_UNISWAP_FACTORY, factoryContract.abi, provider)
    const pairContractAddress = await factoryContractInstance.getPair(selectedTokenToBuyTickets.tokenSmartContract, import.meta.env.VITE_USDC_CONTRACT_ADDRESS)

    const pairContractInstance = new Contract(pairContractAddress, pairContract.abi, provider)
    const pairToken0 = await pairContractInstance.token0()
    const pairToken1 = await pairContractInstance.token1()
    const currentTokensReserves = await pairContractInstance.getReserves()

    const selectedTokenPositionInPair = String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() === String(pairToken0).toLowerCase() ? pairToken0 : pairToken1
    const currentSelectedTokenReserves = String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() === String(pairToken0).toLowerCase() ? Number(currentTokensReserves[0]) : Number(currentTokensReserves[1])
    const currentUSDCTokenReserves = String(import.meta.env.VITE_USDC_CONTRACT_ADDRESS).toLowerCase() === String(pairToken0).toLowerCase() ? Number(currentTokensReserves[0]) : Number(currentTokensReserves[1])
    const currentMarketConstant = currentSelectedTokenReserves * currentUSDCTokenReserves

    const USDCTokenReservesUpdated = currentUSDCTokenReserves - priceOfTheRaffleTicketInUSDCWithoutDecimals * positionToBuy?.length // Se le resta lo que se va a extraer
    const selectedTokenReservesUpdated = currentMarketConstant / USDCTokenReservesUpdated // x * y = k --> Se despeja y

    const selectedTokenUnitsToSendForOneTicketWithoutDecimals = selectedTokenReservesUpdated - currentSelectedTokenReserves // nueva reserva - reserva vieja
    const tokenContractInstance = new Contract(selectedTokenToBuyTickets.tokenSmartContract, erc20TokenContract.abi, provider)
    const tokenDecimals = await tokenContractInstance.decimals()
    const tokenDecimalsDivider = Number(`1e+${tokenDecimals}`)

    const pricePercentageAdjustmentWithoutDecimals = selectedTokenUnitsToSendForOneTicketWithoutDecimals + (selectedTokenUnitsToSendForOneTicketWithoutDecimals * 3) / 100

    const selectedTokenUnitsToSendForOneTicketWithDecimals = selectedTokenUnitsToSendForOneTicketWithoutDecimals / tokenDecimalsDivider
    const pricePercentageAdjustment = selectedTokenUnitsToSendForOneTicketWithDecimals + (selectedTokenUnitsToSendForOneTicketWithDecimals * 3) / 100 // Para asegurar

    console.log('pricePercentageAdjustment', pricePercentageAdjustment)
    console.log('pricePercentageAdjustmentWithoutDecimals', pricePercentageAdjustmentWithoutDecimals)
    setCurrentPriceOfTokenToUseWithDecimals(pricePercentageAdjustment)
    setCurrentPriceOfTokenToUseWithoutDecimals(pricePercentageAdjustmentWithoutDecimals)
  }

  const handleCalculateValuesToPay = async () => {
    if (index === '') setDisableButton(true)
    const priceOfTheRaffleTicketInUSDC = raffleSelected?.priceOfTheRaffleTicketInUSDC

    if (selectedTokenToBuyTickets && String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() === String(import.meta.env.VITE_USDC_CONTRACT_ADDRESS).toLowerCase()) {
      const quantityExpressedInTokenUnits = priceOfTheRaffleTicketInUSDC * positionToBuy?.length

      const provider = CheckMetamaskInstalled() ? getProvider() : await getWalletConnectProvider()
      const usdcContractInstance = new Contract(import.meta.env.VITE_USDC_CONTRACT_ADDRESS, erc20TokenContract.abi, provider)
      const usdcTokenDecimals = await usdcContractInstance.decimals()
      const usdcTokenDecimalsDivider = Number(`1e+${usdcTokenDecimals}`)

      const currentPriceOfTokenToUseWithoutDecimals = priceOfTheRaffleTicketInUSDC * usdcTokenDecimalsDivider * positionToBuy?.length

      setValuesToPay({
        quantityExpressedInTokenUnits,
        currentPriceOfTokenToUseWithoutDecimals,
        quantityExpressedInUSDCUnits: quantityExpressedInTokenUnits
      })
    } else if (selectedTokenToBuyTickets && String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() !== String(import.meta.env.VITE_USDC_CONTRACT_ADDRESS).toLowerCase()) {
      const quantityExpressedInUSDCUnits = priceOfTheRaffleTicketInUSDC * positionToBuy?.length
      let quantityExpressedInTokenUnits: any = currentPriceOfTokenToUseWithDecimals
      quantityExpressedInTokenUnits = Number(quantityExpressedInTokenUnits) === 0 ? 0 : quantityExpressedInTokenUnits < 1 ? quantityExpressedInTokenUnits.toFixed(10) : quantityExpressedInTokenUnits.toFixed(2)

      setValuesToPay({
        quantityExpressedInUSDCUnits,
        quantityExpressedInTokenUnits,
        currentPriceOfTokenToUseWithoutDecimals
      })
    }

    setTimeout(() => setDisableButton(false), 1500)
  }

  const saveRaffleList = async (payload: any) => {
    const selectedRaffleUpdatedData = payload.filter((raffleUpdatedData: any) => String(raffleUpdatedData.raffleSmartContractAddress) === String(raffleSelected.raffleSmartContractAddress))[0]

    const response = await getraffleSpots()
    const notAvailableSpots = response.filter((spotData: any) => spotData.owner !== '')

    setpositionToBuy((currentPositionsToBuy: any) => {
      const positionsToBuyUpdated = [...currentPositionsToBuy]
      let i = positionsToBuyUpdated.length
      while (i--) {
        for (let h = 0; h < notAvailableSpots.length; h++) {
          if (Number(positionsToBuyUpdated[i]) === Number(notAvailableSpots[h].position)) {
            positionsToBuyUpdated.splice(i, 1)
          }
        }
      }

      return positionsToBuyUpdated
    })

    setAllSpotsHook(response)
  }

  const handleUpdateTicketsInfo = async (updatedTicketsInfo: any) => {
    setAllSpotsHook((currentAllSpotsHook: any[]) => {
      const rafflePlayerNumbers = updatedTicketsInfo.rafflePlayerNumbers
      const ticketOwnersAddresses = updatedTicketsInfo.ticketOwnersAddresses

      const allSpotsHookUpdated = [...currentAllSpotsHook]
      for (let i = 0; i < allSpotsHookUpdated.length; i++) {
        if (rafflePlayerNumbers.includes(i + 1)) {
          const ownerIndexPosition = rafflePlayerNumbers.indexOf(i + 1)
          allSpotsHookUpdated[i] = {
            position: i + 1,
            owner: ticketOwnersAddresses[ownerIndexPosition]
          }
        }
      }

      return allSpotsHookUpdated
    })

    setpositionToBuy((currentPositionsToBuy: any[]) => {
      const rafflePlayerNumbers = updatedTicketsInfo.rafflePlayerNumbers
      const positionsToBuyUpdated = [...currentPositionsToBuy]

      let i = positionsToBuyUpdated.length
      while (i--) {
        if (rafflePlayerNumbers.includes(positionsToBuyUpdated[i])) {
          positionsToBuyUpdated.splice(i, 1)
        }
      }

      return positionsToBuyUpdated
    })
  }

  const handleGetraffleSpots = async () => {
    if (!getraffleSpots) {
      setAllSpotsHook(allSpots)
      return
    }

    setLoading(true)
    setTextButton(t('buttonStateTexts.loading'))
    const response = await getraffleSpots()

    setDataLoaded(true)
    setTextButton(t('buyNow.buttonText'))
    setAllSpotsHook(response)
    setLoading(false)
  }

  const handleOnClick = () => {
    if (textButton == 'Approve') {
      handleApprove()
    } else if (textButton == 'Send') {
      onSuccessClick()
    } else if (textButton == 'Done') {
      if (onCloseModal) onCloseModal()
      context.changeContext({ showModal: null })
    } else {
      handleBuyTickets()
    }
  }

  const handleApprove = async () => {
    const empty: any = ''
    setTextButton(t('buttonStateTexts.approve'))
    setError(empty)
    setSuccessMsg('')
    setLoading(true)

    const response: any = await handleApproveTransfer(selectedTokenToBuyTickets.tokenSmartContract)

    setLoading(false)
    if (!response.success) {
      setError(response.error?.message || response.error)
    } else {
      setSuccessMsg('Your transfer was approved with success. Now you can buy your tickets!')
      setTextButton(t('buyNow.buttonText'))
    }
  }

  const handleBuyTickets = async () => {
    const empty: any = ''
    setError(empty)
    setSuccessMsg('')
    setLoading(true)
    const usdcTokenDecimalsDivider: any = await getDecimalsOfUSDC()

    const payloadGenerateLinks: object = {
      selectedRaffleSlots: positionToBuy,
      fmoneyRaffleAddress: raffleSelected?.raffleSmartContractAddress,
      fmoneyRaffleId: await GetRaffleId(raffleSelected?.raffleSmartContractAddress),
      fmoneyRaffleDateTimestamp: await GetTimestampRaffle(raffleSelected?.raffleSmartContractAddress)
    }

    const responseGenerateLinks: any = await generate_links_api(payloadGenerateLinks, context)

    if (responseGenerateLinks?.ticketMetadataRegisteredIpfsHashes?.length === positionToBuy?.length) {
      setResponseGenerateLinks(responseGenerateLinks)
    }

    const filterPositionToBuy = () => {
      if (positionToBuy.length === responseGenerateLinks?.ticketMetadataRegisteredIpfsHashes?.length) {
        return positionToBuy?.filter((e: any) => e)
      }
      return null
    }

    const filterResponseGenerateLinks = () => {
      if (positionToBuy.length === responseGenerateLinks?.ticketMetadataRegisteredIpfsHashes?.length) {
        return responseGenerateLinks?.ticketMetadataRegisteredIpfsHashes
      }
      return null
    }

    const response: any = await handleBuyTicket(raffleSelected?.raffleSmartContractAddress, valuesToPay, filterPositionToBuy(), filterResponseGenerateLinks(), selectedTokenToBuyTickets.tokenSmartContract)

    if (response.success) {
      context.emitEvent('update-raffles-spots', 'getraffleSpots')
      context.changeContext({
        loadUserHistory: true
      })

      console.log('context changed')
      setResponseBuyTicket(response)
      setTextButton(t('buttonStateTexts.done'))
      setSuccess(true)
      if (getraffleSpots) getraffleSpots()

      context.socketConnection.emit('graph-price-changed', raffleSelected?.raffleSmartContractAddress)
      console.log('socket emited')
    } else {
      setError(response.error?.message || response.error)
    }

    setLoading(false)
  }

  const handleOpenModalEmail = async () => {
    setIndex('email')
    setSuccess(false)
    setTextButton(t('buttonStateTexts.send'))
    setLoading(false)
  }

  const handleSendEmail = async () => {
    setError(false)
    setSuccess(false)

    const payload: object = {
      emailToSendTicket: email,
      raffleTicketGeneratedTxHash: responseBuyTicket.hash,
      fileRegisteredIpfsHashes: responseGenerateLinks.fileRegisteredIpfsHashes,
      ticketMetadataRegisteredJsons: responseGenerateLinks.ticketMetadataRegisteredJsons,
      ticketMetadataRegisteredIpfsHashes: responseGenerateLinks.ticketMetadataRegisteredIpfsHashes
    }

    setLoading(true)

    const response: any = await send_ticket_to_email_api(payload, context)

    if (response.success) {
      setLoading(false)
      setSuccess(true)
      setTextButton(t('buttonStateTexts.done'))
    } else {
      console.log('error', response)
      setLoading(false)
      setError(t('sendEmail.errorMessage'))
    }
  }

  const handleDownloadTickets = async () => {
    const payload: object = {
      ticketMetadataRegisteredJsons: responseGenerateLinks.ticketMetadataRegisteredJsons,
      ticketMetadataRegisteredIpfsHashes: responseGenerateLinks.ticketMetadataRegisteredIpfsHashes
    }

    const response: any = await download_tickets(payload, context)

    console.log('response', response)
    window.open(response.location, '_blank')
  }

  const checkApprovePoint = async (newArrayPoints: any) => {
    if (!selectedTokenToBuyTickets || (selectedTokenToBuyTickets && !selectedTokenToBuyTickets.tokenSmartContract && !selectedTokenToBuyTickets.token)) {
      return
    }

    setError(false)
    handleLoadingButton(true)

    const payload: object = {
      ticketsAmountToBuy: newArrayPoints?.length,
      raffleSmartContractAddress: raffleSelected?.raffleSmartContractAddress,
      tokenToApprove: selectedTokenToBuyTickets.tokenSmartContract
    }

    const response: any = await has_to_approve_api(payload, context)

    if (response?.hasToApprove && response?.hasBalance) {
      setTextButton(t('buttonStateTexts.approve'))
    }

    if (response?.hasToApprove && !response?.hasBalance) {
      setDisableButton(true)
      setError(t('errors.noBalance'))
    }

    handleLoadingButton(false)
  }

  const onSuccessClick = () => {
    if (index) {
      switch (index) {
        case 'email':
          if (textButton == 'Done') {
            if (onCloseModal) onCloseModal()
            context.changeContext({ showModal: null })
          } else {
            handleSendEmail()
          }
          break
      }
    } else {
      if (onCloseModal) onCloseModal()
      context.changeContext({ showModal: null })
    }
  }

  const configModalBuyTicket = {
    title: t('title'),
    classButton: 'buttonModalBuyTickets',
    loadingButton,
    onPressButton: success ? onSuccessClick : handleOnClick,
    styles: {
      width: '90%',
      maxWidth: '556px'
    },
    disableButton,
    setShowModal: () => {
      if (onCloseModal) onCloseModal()
      context.changeContext({ showModal: null })
    }
  }

  const handleSelectToken = async () => {
    setErrorSelectedToken(false)

    if (index === 'Approve') {
      setIndex('selectToken')
      return
    }

    if (!selectedTokenToBuyTickets || (selectedTokenToBuyTickets && !selectedTokenToBuyTickets.tokenSmartContract && !selectedTokenToBuyTickets.token)) {
      setErrorSelectedToken(true)
      return
    }

    const payload: object = {
      tokenToApprove: selectedTokenToBuyTickets?.tokenSmartContract || selectedTokenToBuyTickets.token
    }

    setLoadingApprove(true)
    setDisableButton(true)

    const response: any = await has_to_approve_api(payload, context)

    if (response.success && response.hasToApprove) {
      setIndex('Approve')
    }

    if (response.success && !response.hasToApprove) {
      setIndex('')
      setTextButton(t('buyNow.buttonText'))
      if (check) {
        localStorage.setItem('defaultToken', JSON.stringify(selectedTokenToBuyTickets))
      } else {
        sessionStorage.setItem('defaultToken', JSON.stringify(selectedTokenToBuyTickets))
      }
    }

    setLoadingApprove(false)
    setDisableButton(false)
  }

  const configModalSelectToken = {
    title: t('title'),
    classButton: 'buttonModalBuyTickets',
    loadingButton,
    onPressButton: handleSelectToken,
    styles: {
      width: '90%',
      maxWidth: '556px'
      /* height: '70vh' */
    },
    disableButton,
    setShowModal: () => {
      if (onCloseModal) onCloseModal()
      context.changeContext({ showModal: null })
    }
  }

  const handleLoadingButton = (newState: boolean) => {
    setLoadingButton(newState)
  }

  const handleDisableButton = (newState: boolean) => {
    setDisableButton(newState)
  }

  const renderComponent = () => {
    if (index) {
      switch (index) {
        case 'email':
          if (loading) {
            return (
              <div className="container-loading-buying-ticket">
                {/* <BasicSpinner green /> */}
                <div className="container-ApproveLoadingBuy">
                  <img src={LogoLoader} alt="Fmoney" style={{ width: '50%', maxWidth: '120px' }} />
                </div>
                <h5>
                  {index == 'email' && (
                    <>
                      <span>{t('modalBuyTicket.sendingEmail')}</span> <br />
                    </>
                  )}
                </h5>
              </div>
            )
          } else if (success) {
            return (
              <div className="container-success-buying-ticket">
                <img src={ticketanddivider} />
                <h5>{t('modalBuyTicket.ticketsSuccesfulySent')}</h5>
              </div>
            )
          } else {
            return <FormSendEmailTickets {...{ error, setDisableButton, setTextButton, email, setEmail }} />
          }
        case 'selectToken':
          return <SelectToken loading={loadingApprove} setCheck={setCheck} check={check} setTextButton={setTextButton} tokenDefault={selectedTokenToBuyTickets} setToken={setSelectedTokenToBuyTickets} errorSelectedToken={errorSelectedToken} />
        case 'Approve':
          return <ApproveTokenBuy isCheckEnabled={check} setIndex={setIndex} tokenSelected={selectedTokenToBuyTickets} approvingState={(approving: any) => setApprovingToken(approving)} />
        default:
          return <div></div>
      }
    } else if (success) {
      return (
        <div className="container-success-buying-ticket">
          <img src={ticketanddivider} />
          <h5>
            {t('modalBuyTicket.succesfulyPurchased')} {positionToBuy?.length > 0 ? 'tickets' : 'ticket'}. {t('modalBuyTicket.goodLuck')}!
          </h5>
          <div className="container-buttons-successfully">
            <Button text={t('modalBuyTicket.buttonDownload')} onPress={handleDownloadTickets} />
            <Button text={t('modalBuyTicket.buttonSendTickets')} onPress={handleOpenModalEmail} />
            <Button
              text={t('modalBuyTicket.buttonDone')}
              onPress={() => {
                context.changeContext({ showModal: null })
              }}
            />
          </div>
        </div>
      )
    } else if (loading) {
      return (
        <div className="container-loading-buying-ticket">
          {/* <BasicSpinner green /> */}
          <div className="container-ApproveLoadingBuy">
            <img src={LogoLoader} alt="Fmoney" style={{ width: '50%', maxWidth: '120px' }} />
          </div>
          <h5>
            {textButton == 'Approve' && (
              <>
                <span>{t('modalBuyTicket.buyingTickets.approvingTransfer')}</span> <br />
                <span>
                  {t('modalBuyTicket.buyingTickets.dontReload.text1')} <br /> {t('modalBuyTicket.buyingTickets.dontReload.text2')}
                </span>
              </>
            )}
            {textButton == t('buyNow.buttonText') && (
              <>
                <span> {t('modalBuyTicket.buyingTickets.title')}</span> <br />
                <span>
                  {t('modalBuyTicket.buyingTickets.dontReload.text1')} <br /> {t('modalBuyTicket.buyingTickets.dontReload.text2')}
                </span>
                <br />
                <br />
                <LoaderCountdown />
              </>
            )}
            {textButton == 'Loading' && (
              <>
                <span>{t('modalBuyTicket.buyingTickets.loadingSpots')}</span> <br />
              </>
            )}
          </h5>
        </div>
      )
    } else {
      return (
        <>
          <BuyTicketsModal
            {...{
              valuesToPay,
              handleCalculateValuesToPay,
              spotsToBuy: listSpotsToBuy,
              raffleSelected,
              handleLoadingButton,
              setTextButton,
              positionToBuy,
              setpositionToBuy,
              checkApprovePoint,
              error,
              successMsg,
              handleDisableButton,
              allSpots: allSpotsHook
            }}
          />
        </>
      )
    }
  }

  return (
    <FullModal
      showModal={true}
      config={
        index == 'selectToken' || index == 'Approve'
          ? {
              ...configModalSelectToken,
              /*   hideElements: loading, */
              buttonTxt: t('selectToken.buttonText'),
              disableButton: error ? true : disableButton,
              width: isMobile && '90%',
              hideButton: disableButton || approvingToken
            }
          : {
              ...configModalBuyTicket,
              hideElements: loading,
              buttonTxt: index == 'email' ? t('sendEmail.buttonText') : t('buyNow.buttonText'),
              disableButton: error ? true : disableButton,
              width: isMobile && '90%',
              hideButton: success
            }
      }
    >
      {renderComponent()}
    </FullModal>
  )
}

export default ModalBuyTicket
