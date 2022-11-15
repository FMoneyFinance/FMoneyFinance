import { useState, useContext, useEffect } from 'react'
import socketIo from 'socket.io-client'
import { Contract } from 'ethers'

import TableRaffleSpots from './table'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../../context/AppContext'
import { useInterval } from '../../../../hooks/useInterval'
import { handleGetAvailableSpots } from '../../../../web3/functions/ticket & spots'
import { get_current_raffles_tickets_info_hash } from '../../../../api/tickets-management'
import { getProvider, getWalletConnectProvider } from '../../../../web3/functions/providers'
import fmoneyRaffleOperatorContract from '../../../../web3/contracts/interfaces/IFmoneyRaffleOperator.json'

const io: any = socketIo
const contextWin: any = window

function RaffleSpots({ params, handleBuyTicket, raffleSelected }: any) {
  const [spots, setSpots] = useState([])
  const [error, setError] = useState('')
  const context: any = useContext(AppContext)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation(['ticket-details'])
  const [selectedRaffleSmartContract, setSelectedRaffleSmartContract] = useState('')

  useInterval(() => {
    handleGetCurrentRafflesTicketsInfoHash()
  }, 60000)

  useEffect(() => {
    const currentLocalRafflesTicketsInfoHash = sessionStorage.getItem(`currentRafflesTicketsInfoHash-${raffleSelected.raffleSmartContractAddress}`)

    if (!currentLocalRafflesTicketsInfoHash) {
      const handleGetInitialRafflesInfoHash = async () => {
        const response: any = await get_current_raffles_tickets_info_hash(raffleSelected.raffleSmartContractAddress)
        const rafflesTicketsInfoHashUpdated = response.currentRafflesTicketsInfoHash
        sessionStorage.setItem(`currentRafflesTicketsInfoHash-${raffleSelected.raffleSmartContractAddress}`, rafflesTicketsInfoHashUpdated)
      }
    }

    context.socketConnection.on('current-raffles-spots-info', (raffleTicketsInfo: any) => {
      setSelectedRaffleSmartContract((currentSelectedRaffleSmartContract) => {
        if (String(raffleTicketsInfo.raffleSmartContractAddress).toLowerCase() === String(currentSelectedRaffleSmartContract).toLowerCase()) {
          sessionStorage.setItem(`currentRafflesTicketsInfoHash-${currentSelectedRaffleSmartContract}`, raffleTicketsInfo.rafflesTicketsInfoHashUpdated)
          handleUpdateSpotsInfo(raffleTicketsInfo.ticketsCurrentFullInfo)
        }

        return currentSelectedRaffleSmartContract
      })
    })

    return () => {
      context.socketConnection.off('current-raffles-spots-info')
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    if (raffleSelected.raffleSmartContractAddress) {
      getraffleSpots()
      setSelectedRaffleSmartContract(raffleSelected.raffleSmartContractAddress)
    }
  }, [raffleSelected.raffleSmartContractAddress])

  const getraffleSpots = async () => {
    setLoading(true)
    const { success, spots: spotList, message }: any = await handleGetAvailableSpots(raffleSelected.raffleSmartContractAddress)

    if (success) {
      // await context.changeContext({ spotList: [...spotList] });
      setSpots(spotList)
      setLoading(false)
    }

    if (!success && message === 'wrong-chain') {
      setError('wrong-chain')
      setLoading(false)
    }

    setLoading(false)
  }

  const handleGetCurrentRafflesTicketsInfoHash = async () => {
    const response: any = await get_current_raffles_tickets_info_hash(selectedRaffleSmartContract)
    const rafflesTicketsInfoHashUpdated = response.currentRafflesTicketsInfoHash
    const currentLocalRafflesTicketsInfoHash = sessionStorage.getItem(`currentRafflesTicketsInfoHash-${selectedRaffleSmartContract}`)

    if (currentLocalRafflesTicketsInfoHash && String(currentLocalRafflesTicketsInfoHash) !== String(rafflesTicketsInfoHashUpdated)) {
      console.log('entro a cambiar tickets info hash', 'selectedRaffleSmartContract', selectedRaffleSmartContract)
      sessionStorage.setItem(`currentRafflesTicketsInfoHash-${selectedRaffleSmartContract}`, rafflesTicketsInfoHashUpdated)

      /* const provider = contextWin.ethereum ? getProvider() : await getWalletConnectProvider()
      const fmoneyRaffleOperatorContractInstance = new Contract(selectedRaffleSmartContract, fmoneyRaffleOperatorContract.abi, provider)
      const maxNumberOfPlayers = await fmoneyRaffleOperatorContractInstance.maxNumberOfPlayers()
      const raffleTicketOwners = await fmoneyRaffleOperatorContractInstance.getRaffleTicketOwners()
      const rafflePlayerNumbers = raffleTicketOwners[1].map((numberData: any) => Number(numberData))
      const ticketOwnersAddresses = raffleTicketOwners[0]

      const ticketsCurrentFullInfo = { maxNumberOfPlayers: Number(maxNumberOfPlayers), rafflePlayerNumbers, ticketOwnersAddresses }
      handleUpdateSpotsInfo(ticketsCurrentFullInfo) */
      setLoading(true)
      const { success, spots: spotList, message }: any = await handleGetAvailableSpots(raffleSelected.raffleSmartContractAddress)

      if (success) {
        setSpots(spotList)
        setLoading(false)
      }

      setLoading(false)
    }
  }

  const handleUpdateSpotsInfo = async (updatedSpotsInfo: any) => {
    const raffleSpotsDataUpdated: any = []
    const maxNumberOfPlayers = updatedSpotsInfo.maxNumberOfPlayers
    const rafflePlayerNumbers = updatedSpotsInfo.rafflePlayerNumbers
    const ticketOwnersAddresses = updatedSpotsInfo.ticketOwnersAddresses
    let ticketOwnersAddressesCounter = 0

    for (let i = 1; i <= maxNumberOfPlayers; i++) {
      if (rafflePlayerNumbers.includes(i)) {
        const ticketOwnerSpot = rafflePlayerNumbers.map((playerNumber: any, index: any) => {
          if (playerNumber === i) return index
        })

        raffleSpotsDataUpdated.push({ position: i, owner: ticketOwnersAddresses[ticketOwnerSpot] })
        /* ticketOwnersAddressesCounter++ */
      } else {
        raffleSpotsDataUpdated.push({ position: i, owner: '' })
      }
    }

    setSpots(raffleSpotsDataUpdated)
  }

  return (
    <div className="maxWidth RaffleSpots">
      <h2>{t('raffleSpots.title')}</h2>
      <h4>{t('raffleSpots.text')}</h4>
      <TableRaffleSpots {...{ handleBuyTicket, spots, loading, raffleSelected, setLoading, error }} />
    </div>
  )
}

export default RaffleSpots
