import { utils } from 'ethers'
import JSConfetti from 'js-confetti'
import { useTranslation } from 'react-i18next'
import React, { useContext, useMemo, useState, useEffect } from 'react'

import Button from '../../../../components/Buttons'
import AppContext from '../../../../context/AppContext'
import { ThereAWallet } from '../../../../utils/wallet'
import { useInterval } from '../../../../hooks/useInterval'
import { sameWalletAddress } from '../../../../utils/validators'
import CalendarIcon from '../../../../assets/icons/calendar.svg'
import { raffleInterface } from '../../../../interfaces/raffles'
import { timeStampToString } from '../../../../utils/formater/date'
import StatusRaffle from '../../../../components/raffle/status/index'
import BuyTicketButton from '../../../../components/Buttons/buyTicket'
import { FormatWalletAddress } from '../../../../utils/formater/string'

function HeaderTicketDetailsScreen({ handleSeeMyRaffleSpots, handleBuyTicket, raffleSelected }: { handleSeeMyRaffleSpots: Function; handleBuyTicket: Function; raffleSelected: raffleInterface }) {
  const context: any = useContext(AppContext)
  const [winner, setWinner] = useState(false)
  const { t } = useTranslation(['ticket-details'])
  const raffling = raffleSelected?.raffleStatus === 'raffling'

  useInterval(() => {
    if (winner) {
      handleDisplayConfetti()
    }
  }, 15000)

  useEffect(() => {
    console.log(raffleSelected?.raffleStatus === 'closed', String(context?.state?.walletAddress).toLocaleLowerCase() === String(raffleSelected?.raffleWinnerPlayer).toLocaleLowerCase())
    if (raffleSelected?.raffleStatus === 'closed' && String(context?.state?.walletAddress).toLocaleLowerCase() === String(raffleSelected?.raffleWinnerPlayer).toLocaleLowerCase()) {
      setWinner(true)
    } else {
      setWinner(false)
    }
  }, [raffleSelected, context?.state?.walletAddress])

  useEffect(() => {
    if (winner) handleDisplayConfetti()
  }, [winner])

  const handleDisplayConfetti = () => {
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti({ confettiNumber: 1500 }).then(() => {
      console.log('Confetti animation completed!')
      jsConfetti.clearCanvas()
    })
  }

  const RafflingButton = () => {
    return (
      <div className="containerRafflingAlert pointer" onClick={() => window.open(import.meta.env.VITE_CHAINLINK_ORACLE_LINK, '_blank')}>
        <h3>See the draw process in the oracle pending transaction</h3>
      </div>
    )
  }

  const WinnerAlert = () => {
    if (!context?.state?.walletAddress || (context?.state?.walletAddress && !utils.isAddress(context?.state?.walletAddress))) {
      return (
        <div className="containerWinnerAlert ConnectWallet pointer" onClick={handleClick}>
          <h3>{t('winnerAlert.connect')}</h3>
        </div>
      )
    }

    if (winner) {
      // memoConffetiDisplay

      return (
        <div className="containerWinnerAlert Winner">
          <h3>{t('winnerAlert.winner')}</h3>
        </div>
      )
    }

    return (
      <div className="containerWinnerAlert">
        <h3>{t('winnerAlert.noWinner')}</h3>
      </div>
    )
  }

  const handleClick = () => {
    context.changeContext({ showModalConnectWallet: true })
  }

  return (
    <div className={raffling ? 'maxWidth header raffling' : 'maxWidth header'}>
      <div className="top">
        <div className="left">
          <div>
            <h3>{raffleSelected?.raffleName}</h3>
            <a target="_blank" href={`${import.meta.env.VITE_ETHERSCAN_PREFIX}address/${raffleSelected?.raffleSmartContractAddress}`}>
              <h4 className="pointer">
                {t('generalInfo.contractAddres')} {FormatWalletAddress(raffleSelected?.raffleSmartContractAddress)}
              </h4>
            </a>
          </div>
          <div className="dateOfDrawContainer">
            <div className="dateOfDrawSubtitle">
              <img src={CalendarIcon} />
              <span className="bold">{t('generalInfo.dateOfDraw')}</span>
            </div>
            <div className="dateOfDraw">{timeStampToString(raffleSelected?.timestampDateOfDraw * 1000, 1)} (CET)</div>
          </div>
        </div>
        <div className="center">
          <h3>${raffleSelected.currentPrizePot || 0} USD</h3>
          <h4>{t('generalInfo.prizePot')}</h4>
        </div>
        <div className="right">
          <div className="raffleStatus">
            {raffleSelected?.raffleStatus == 'open' && <BuyTicketButton className="buttonHeader" raffleSelected={raffleSelected} buttonProps={{ secondary: true, rounded: true }} />}
            <StatusRaffle raffleStatus={raffleSelected?.raffleStatus} />
          </div>
          {ThereAWallet(context) && raffleSelected?.raffleStatus == 'open' && (
            <div className="buttonRaffleSpots">
              <Button text={t('generalInfo.seeYourRaffleSpots')} rounded onPress={() => handleSeeMyRaffleSpots()} className="buttonSeeYourSpots" />
            </div>
          )}
          {raffleSelected?.raffleStatus == 'raffling' && <RafflingButton />}
          {raffleSelected?.raffleStatus == 'closed' && <WinnerAlert />}
        </div>
        <div className="actionButtonsMobile">
          {raffleSelected?.raffleStatus == 'open' && <BuyTicketButton className="buttonHeader" raffleSelected={raffleSelected} buttonProps={{ secondary: true, rounded: true }} />}
          {ThereAWallet(context) && raffleSelected?.raffleStatus == 'open' && (
            <div className="buttonRaffleSpots">
              <Button text={t('generalInfo.seeYourRaffleSpots')} rounded onPress={() => handleSeeMyRaffleSpots()} className="buttonSeeYourSpots" />
            </div>
          )}
          {raffleSelected?.raffleStatus == 'raffling' && <RafflingButton />}
          {raffleSelected?.raffleStatus == 'closed' && <WinnerAlert />}
        </div>
      </div>
      {/* <div className="bottom">
        {/* <div className="left">
          <h3>
            <div className="">
              <img src={CalendarIcon} />
              <span className="bold">{t('generalInfo.dateOfDraw')}</span>
            </div>
            <span>{timeStampToString(raffleSelected?.timestampDateOfDraw * 1000, 1)} (CET)</span>
          </h3>
  </div> */}

      {/* </div> */}
    </div>
  )
}

export default HeaderTicketDetailsScreen
