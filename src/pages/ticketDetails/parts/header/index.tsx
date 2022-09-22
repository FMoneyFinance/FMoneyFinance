import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../../../components/Buttons'
import AppContext from '../../../../context/AppContext'
import { ThereAWallet } from '../../../../utils/wallet'
import CalendarIcon from '../../../../assets/icons/calendar.svg'
import { raffleInterface } from '../../../../interfaces/raffles'
import { timeStampToString } from '../../../../utils/formater/date'
import StatusRaffle from '../../../../components/raffle/status/index'
import BuyTicketButton from '../../../../components/Buttons/buyTicket'
import { FormatWalletAddress } from '../../../../utils/formater/string'

function HeaderTicketDetailsScreen({ handleSeeMyRaffleSpots, handleBuyTicket, raffleSelected }: { handleSeeMyRaffleSpots: Function; handleBuyTicket: Function; raffleSelected: raffleInterface }) {
  const { t } = useTranslation(['ticket-details'])

  const context: any = useContext(AppContext)
  const raffling = raffleSelected?.raffleStatus == 'raffling'
  return (
    <div className={raffling ? 'maxWidth header raffling' : 'maxWidth header'}>
      <div className="top">
        <div className="left">
          <h3>{raffleSelected?.raffleName}</h3>
          <a target="_blank" href={`${import.meta.env.VITE_ETHERSCAN_PREFIX}address/${raffleSelected?.raffleSmartContractAddress}`}>
            <h4 className="pointer">
              {t('generalInfo.contractAddres')} {FormatWalletAddress(raffleSelected?.raffleSmartContractAddress)}
            </h4>
          </a>
        </div>
        <div className="center">
          <h3>${raffleSelected.currentPrizePot || 0} USDC</h3>
          <h4>{t('generalInfo.prizePot')}</h4>
        </div>
        <div className="right">
          {raffleSelected?.raffleStatus == 'open' ? <BuyTicketButton className={ThereAWallet(context) ? 'buttonHeader' : 'buttonHeader full'} raffleSelected={raffleSelected} buttonProps={{ secondary: true, rounded: true }} /> : <div></div>}
          <StatusRaffle raffleStatus={raffleSelected?.raffleStatus} />
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <h3>
            <div className="">
              <img src={CalendarIcon} />
              <span className="bold">{t('generalInfo.dateOfDraw')}</span>
            </div>
            <span>{timeStampToString(raffleSelected?.timestampDateOfDraw * 1000, 1)} (CET)</span>
          </h3>
        </div>
        <div className="right">{ThereAWallet(context) && raffleSelected?.raffleStatus == 'open' && <Button text={t('generalInfo.seeYourRaffleSpots')} rounded onPress={() => handleSeeMyRaffleSpots()} className="buttonSeeYourSpots" />}</div>
      </div>
    </div>
  )
}

export default HeaderTicketDetailsScreen
