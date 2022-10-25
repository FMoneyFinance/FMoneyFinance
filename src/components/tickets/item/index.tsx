import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TicketRaffling from '../../../assets/ilustrations/landingpage/TicketRaffling.svg'
import TicketCreating from '../../../assets/ilustrations/landingpage/TicketCreating.svg'
import TicketMin from '../../../assets/ilustrations/landingpage/TicketMin.svg'
import DotLine from '../../../assets/ilustrations/dotline.svg'
import BuyTicketButton from '../../Buttons/buyTicket'
import '../styles.scss'
import AppContext from '../../../context/AppContext'
import { useTranslation } from 'react-i18next'
import { isMobile } from 'react-device-detect'
import BasicSpinner from '../../elements/loader/basic'
import { raffleInterface, raffleStatusEnum } from '../../../interfaces/raffles'

function ItemTicket({ raffle, handleBuyTicket }: { raffle: raffleInterface; handleBuyTicket: Function }) {
  const { t } = useTranslation(['home'])
  const context: any = useContext(AppContext)
  const navigate = useNavigate()

  const loading = ['creating', 'raffling'].includes(raffle?.raffleStatus)

  const handleClickBuyTicket = () => {
    if (raffle?.raffleStatus != raffleStatusEnum.creating) {
      window.scrollTo({ top: 0, behavior: 'smooth' })

      navigate(`/ticket-details-screen/${raffle?.raffleSmartContractAddress}`)
    }
  }

  const getConfig = () => {
    let img = TicketMin
    // let subtitle = raffle?.raffleSymbol
    let subtitle = raffle?.raffleName ? raffle?.raffleName.toUpperCase() : 'PENDING'

    switch (raffle?.raffleStatus) {
      case 'creating':
        img = TicketCreating
        subtitle = t('tickets.subtitles.creating')
        break
      case 'raffling':
        subtitle = t('tickets.subtitles.raffling')
        img = TicketRaffling
        break
    }

    return {
      img,
      subtitle
    }
  }

  return (
    <div onClick={handleClickBuyTicket} className="containerCard containerItemTicket pointer">
      <div style={{ position: 'relative' }}>
        <img src={getConfig().img} />
        <div className="dotline-ticket">
          <img src={DotLine} className="" />
        </div>
      </div>
      <h4>{t('tickets.title')}</h4>
      <h3>${raffle?.priceOfTheRaffleTicketInUSDC}</h3>
      <h5>{getConfig().subtitle}</h5>
      <div style={loading && isMobile ? { bottom: '0px' } : {}} className="grid-button-ticket containerButtonBuyTicket">
        {loading ? (
          <BasicSpinner />
        ) : (
          <>
            <BuyTicketButton className="buttonImgContainer" handleBuyTicket={handleBuyTicket} raffleSelected={raffle} />
            {context.state?.walletAddress?.length > 10 && context.state?.isAdminUser && <span>{t('tickets.playRaffle')}</span>}
          </>
        )}
      </div>
    </div>
  )
}

export default ItemTicket
