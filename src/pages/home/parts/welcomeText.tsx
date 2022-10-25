import React, { useContext, useMemo, useEffect, Suspense } from 'react'

import Countdown from 'react-countdown'
import Money1 from '../../../assets/ilustrations/landingpage/moneys/money1.svg'
import Money2 from '../../../assets/ilustrations/landingpage/moneys/money2.svg'
import Money3 from '../../../assets/ilustrations/landingpage/moneys/money3.svg'
import Money3b from '../../../assets/ilustrations/landingpage/moneys/money3b.svg'
import Money4 from '../../../assets/ilustrations/landingpage/moneys/money4.svg'

import AppContext from '../../../context/AppContext'
import Button from '../../../components/Buttons'
import { useState } from 'react'
import ModalCreateRaffle from '../../../components/modals/createRaffle'
import SliderRaffles from '../../../components/tickets/slider/slider'
import { useTranslation } from 'react-i18next'
import { getNextDraw } from '../../../utils/raffles'
import { getTimeToDate } from '../../../utils/maths'
import { ThereAWallet } from '../../../utils/wallet'

function WelcomeText(props: any) {
  const { t } = useTranslation(['home'])
  const context: any = useContext(AppContext)
  const [raffles, setRaffles] = useState([])

  const openModalCreateRaffle = () => {
    context.changeContext({ showModal: ModalCreateRaffleFunct })
  }

  const ModalCreateRaffleFunct = () => {
    return (
      <Suspense fallback="">
        <ModalCreateRaffle />
      </Suspense>
    )
  }

  const ItemNextDraw = ({ number }: any) => {
    return <div>{number}</div>
  }

  const Moneys = () => {
    return (
      <div className="ContainerMoneys ">
        <img src={Money1} className="Money1" />
        <img src={Money2} className="Money2" />
        <img src={Money3} className="Money3" />
        <img src={Money4} className="Money4" />
      </div>
    )
  }

  const handleClickConnectWallet = () => {
    context.changeContext({ showModalConnectWallet: true })
  }

  const MoneysMemo = useMemo(Moneys, [])

  const CountDownNextDraw = () => {
    const [nextDrawTimeStamp, setNextDraw] = useState(getNextDraw(context))

    return (
      <div className="nextDraw">
        <h4>{t('welcomeText.nextDraw')}</h4>
        <Countdown date={Date.now() + getTimeToDate(new Date(nextDrawTimeStamp * 1000))} renderer={renderer} />
      </div>
    )
  }

  const renderer: any = ({ hours, minutes, days, completed }: any) => {
    return (
      <div className="containerItemNextDraw">
        <ItemNextDraw number={days.toString() + 'd'} />
        <ItemNextDraw number={hours.toString() + 'h'} />
        <ItemNextDraw number={minutes.toString() + 'm'} />
      </div>
    )
  }

  return (
    <div className="welcomeText">
      <h4>{t('welcomeText.subTitle')}</h4>
      <h1 className="">{t('welcomeText.title')}</h1>

      {ThereAWallet(context) ? (
        <>{context.state?.isAdminUser && <Button outlined onPress={openModalCreateRaffle} text={t('buttonCreateNewRaffle')} className="create-new-raffle" />}</>
      ) : (
        <h3 onClick={handleClickConnectWallet} className="pointer">
          {t('welcomeText.connectYourWallet')}
        </h3>
      )}
      <div className="sliderContainer">
        <SliderRaffles setRaffles={setRaffles} />
      </div>
      {context?.state?.rafflesInfo && context?.state?.rafflesInfo.length > 0 && <CountDownNextDraw />}
      {MoneysMemo}
    </div>
  )
}

export default WelcomeText
