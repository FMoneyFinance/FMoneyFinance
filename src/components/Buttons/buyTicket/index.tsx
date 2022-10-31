import React, { Suspense, useContext, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { utils } from 'ethers'

import './styles.scss'
import Button from '../index'
import { useState } from 'react'
import FullModal from '../../modals/base/full'
import ModalBuyTicket from '../../modals/buyTicket'
import AppContext from '../../../context/AppContext'
import { ThereAWallet } from '../../../utils/wallet'
import Metamask from '../../../assets/icons/metamask.svg'
import ModalConnectWallet from '../../modals/connectWallet'
import { CheckMetamaskInstalled } from '../../../web3/functions/metamask'
import { handleGetAvailableSpots } from '../../../web3/functions/ticket & spots'

function BuyTicketButton({ style, className, raffleSelected, buttonProps }: any) {
  const { t } = useTranslation(['home'])
  const context: any = useContext(AppContext)
  const buyingTicket = useRef(false)
  const [spots, setspots] = useState([])
  const [loading, setLoading] = useState(false)
  const [availabeSpots, setAvailabeSpots] = useState([])
  const [raffleSelectedFromParams, setRaffleSelectedFromParams] = useState(null)
  const params = useParams()

  useEffect(() => {
    if (context.state?.walletAddress?.length > 10 && buyingTicket.current) {
      buyingTicket.current = false
      SetModal()
      return
    }

    if (context.state?.walletAddress && utils.isAddress(context.state?.walletAddress) && context.state?.buyingATicket) {
      setspots(context.state?.listSpotsToBuy)

      setTimeout(() => {
        context.changeContext({ buyingATicket: false, listSpotsToBuy: [] })
        SetModal()
      }, 500)
    }
  }, [context.state?.walletAddress])

  useEffect(() => {
    if (params?.raffleSmartContractAddress) {
      const rafflesInfo = context.state?.rafflesInfo
      const raffleSelectedInfo = rafflesInfo.filter((raffleInfo: any) => String(raffleInfo.raffleSmartContractAddress) === String(params?.raffleSmartContractAddress))
      setRaffleSelectedFromParams(raffleSelectedInfo[0])
    }
  }, [params?.raffleSmartContractAddress])

  const onCloseModal = () => {
    buyingTicket.current = false
  }

  useEffect(() => {
    if (context.state?.walletAddress?.length > 10 && buyingTicket.current) {
      buyingTicket.current = false
      SetModal()
    }
  }, [availabeSpots])

  const getraffleSpots = async () => {
    setLoading(true)
    buyingTicket.current = true

    const selectedRaffleSmartContractAddress = raffleSelectedFromParams ? params?.raffleSmartContractAddress : raffleSelected?.raffleSmartContractAddress
    const { success, spots: spotList }: any = await handleGetAvailableSpots(selectedRaffleSmartContractAddress)

    setLoading(false)
    if (success) {
      setAvailabeSpots(spotList)

      return spotList
    }
  }

  const SetModal = async () => {
    context.changeContext(
      {
        showModal: (
          <Suspense fallback="">
            <ModalBuyTicket
              {...{
                listSpotsToBuy: spots,
                getraffleSpots,
                onCloseModal,
                raffleSelected: raffleSelectedFromParams ? raffleSelectedFromParams : raffleSelected,
                allSpots: availabeSpots
              }}
            />
          </Suspense>
        )
      },
      true
    )
  }

  const handleClick = async (e: any) => {
    e.stopPropagation()
    buyingTicket.current = true

    if (!ThereAWallet(context)) {
      context.changeContext({ showModalConnectWallet: true })
    } else {
      SetModal()
    }
  }

  return (
    <>
      <Button text={t('tickets.buyTicket')} onPress={handleClick} loading={loading} {...buttonProps} className={className} applyStyle={style} />
    </>
  )
}

export default BuyTicketButton
