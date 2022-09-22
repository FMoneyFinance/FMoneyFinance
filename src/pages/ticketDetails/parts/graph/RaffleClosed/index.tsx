import React, { useState, useContext, useMemo, useEffect } from 'react'
import { utils } from 'ethers'
import Countdown from 'react-countdown'
import JSConfetti from 'js-confetti'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../../../context/AppContext'
import { sameWalletAddress } from '../../../../../utils/validators'
import clockSVG from '../../../../../assets/icons/clockRaffleClosed.svg'
import Button from '../../../../../components/Buttons'
import BuyTicketButton from '../../../../../components/Buttons/buyTicket'
import { getNextDraw } from '../../../../../utils/raffles'
import { getTimeToDate } from '../../../../../utils/maths'
import { useNavigate } from 'react-router-dom'

export default function RaffleClosed({ raffleSelected }: any) {
  const context: any = useContext(AppContext)
  const navigate = useNavigate()
  const { t } = useTranslation(['ticket-details'])
  const [copied, setCopied] = useState(false)
  const [winner, setWinner] = useState(sameWalletAddress(context?.state?.walletAddress, raffleSelected?.raffleWinnerPlayer))
  const [nextDrawTimeStamp, setNextDraw] = useState(getNextDraw(context))
  const [minRaffle, setMinRaffle] = useState<any>([])

  const confettiDisplay = () => {
    if (winner) {
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti()
    }
  }

  const memoConffetiDisplay = useMemo(confettiDisplay, [])

  const handleClick = () => {
    context.changeContext({ showModalConnectWallet: true })
  }

  const WinnerSpots = ({ num }: any) => {
    return (
      <div className="winnerSport">
        <h3>{num}</h3>
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
      memoConffetiDisplay

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

  const timeOut = setTimeout(() => {
    setCopied(false)
  }, 2500)

  const handleCopy = () => {
    setCopied(true)
    timeOut
  }

  useEffect(() => {
    const minTimeStamp = getNextDraw(context)
    const found = context?.state?.rafflesInfo?.find((data: any) => data?.timestampDateOfDraw == minTimeStamp)
    setMinRaffle(found)
  }, [])

  const ItemNextDraw = ({ number }: any) => {
    return <h2>{number}</h2>
  }

  const redirectRaffle = () => {
    console.log('MINRAFFLE', minRaffle)

    navigate(`/ticket-details-screen/${minRaffle?.raffleSmartContractAddress}`)
  }

  const renderer: any = ({ hours, minutes, days, completed }: any) => {
    return (
      <div className="containerCountdown">
        <ItemNextDraw number={days.toString() + 'd'} />

        <ItemNextDraw number={hours.toString() + 'h'} />

        <ItemNextDraw number={minutes.toString() + 'm'} />
      </div>
    )
  }

  return (
    <div>
      <WinnerAlert />
      <div className={'containerTable Closed'}>
        <div className="containerClosed">
          <div className="flex">
            <img src={clockSVG} alt="clockClosed" />
          </div>
          <div className="flex Texts">
            <h4>{t('winnerAlert.nextDrawTitle')}</h4>
            <h2>
              <Countdown date={Date.now() + getTimeToDate(new Date(nextDrawTimeStamp * 1000))} renderer={renderer} />
            </h2>
            <br />
            <h4>{context?.state?.walletAddress && winner ? `${t('winnerAlert.nextDrawSubtitleWinner')}` : context?.state?.walletAddress && `${t('winnerAlert.nextDrawSubtitleNotWinner')}`}</h4>
          </div>
          <div className="containerButton">
            <Button text={t('raffleSpots.table.buttonBuyTickets')} className="buttonImgContainer" secondary onPress={() => redirectRaffle()} />
          </div>
        </div>
      </div>
    </div>
  )
}
