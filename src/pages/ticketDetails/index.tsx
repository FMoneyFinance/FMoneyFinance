import React, { useContext, useState, useEffect, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { utils } from 'ethers'

import './styles.scss'
import MainLayout from '../../layouts/main'
import RaffleSpots from './parts/raffleSpots'
import GraphTicketDetails from './parts/graph'
import AppContext from '../../context/AppContext'
import SplashScreen from '../../components/Splash'
import AllRights from '../../components/allRights'
import MiniPools from './parts/minipools/minipools'
import HeaderTicketDetailsScreen from './parts/header'
import { getRaffleOfSocket } from '../../utils/raffles'
import ModalBuyTicket from '../../components/modals/buyTicket'
import ModalSeeMyRaffles from '../../components/modals/seeMyRaffles'

function BannerAdd() {
  const { t } = useTranslation(['ticket-details'])
  return (
    <div className="maxWidth adBannerContainer">
      <h3>{t('bannerAd')}</h3>
    </div>
  )
}

function TicketDetailsScreen() {
  const context: any = useContext(AppContext)
  const [raffleSelected, setRaffleSelected] = useState<any>({})
  const params = useParams()

  const handleSeeMyRaffleSpots = () => {
    context.changeContext({
      showModal: (
        <Suspense fallback="">
          <ModalSeeMyRaffles raffleSelected={raffleSelected} />
        </Suspense>
      )
    })
  }

  const handleOpenModalTicket = (listSpotsToBuy: any, allSpots: any) => {
    if (!context.state?.walletAddress || (context.state?.walletAddress && !utils.isAddress(context.state?.walletAddress))) {
      context.changeContext({ showModalConnectWallet: true, buyingATicket: true, listSpotsToBuy })
    } else {
      context.changeContext(
        {
          showModal: (
            <Suspense fallback="">
              <ModalBuyTicket {...{ listSpotsToBuy, raffleSelected, allSpots }} />
            </Suspense>
          )
        },
        true
      )
    }
  }

  useEffect(() => {
    if (context?.state?.rafflesInfo && params?.raffleSmartContractAddress) {
      setRaffleSelected(getRaffleOfSocket(context?.state?.rafflesInfo, params?.raffleSmartContractAddress || ''))
    }
  }, [params.raffleSmartContractAddress, context?.state?.rafflesInfo])

  return (
    <Suspense fallback={<SplashScreen />}>
      <MainLayout tikcketDetails>
        <div className="TicketDetailsScreen">
          <BannerAdd />
          <HeaderTicketDetailsScreen
            {...{
              handleSeeMyRaffleSpots,
              handleBuyTicket: handleOpenModalTicket,
              raffleSelected: raffleSelected || {}
            }}
          />
          <GraphTicketDetails {...{ raffleSelected: raffleSelected || {} }} />
          {raffleSelected && raffleSelected?.raffleStatus !== 'closed' && (
            <RaffleSpots
              {...{
                params,
                handleBuyTicket: handleOpenModalTicket,
                raffleSelected: raffleSelected || {}
              }}
            />
          )}
          <MiniPools
            {...{
              params,
              handleBuyTicket: handleOpenModalTicket,
              raffleSmartContractAddress: raffleSelected?.raffleSmartContractAddress
            }}
          />
          <BannerAdd />
          <div className="dividerBottom" />
          <AllRights />
        </div>
      </MainLayout>
    </Suspense>
  )
}

export default TicketDetailsScreen
