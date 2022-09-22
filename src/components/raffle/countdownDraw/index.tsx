import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Countdown from 'react-countdown'
import ClockIcon from '../../../assets/icons/clock.svg'
import ClockIconGreen from '../../../assets/icons/clockGreen.svg'
import { addZeroToNumber } from '../../../utils/formater/number'
import { getTimeToDate } from '../../../utils/maths'

function CountDownRaffle({ timestampDateOfDraw, green }: any) {
  const startDate = React.useRef(Date.now())
  const [test, setTest] = useState(false)
  const { t } = useTranslation(['home'])

  useEffect(() => {
    setTimeout(() => {
      setTest(true)
    }, 2000)
  }, [])

  const RenderCountDown = ({ days, hours, minutes }: any) => {
    return (
      <div className="containerItemToDraw">
        <div>{addZeroToNumber(days)}d </div>
        <span> </span>
        <div>{addZeroToNumber(hours)}h </div>
        <span> </span>
        <div>{addZeroToNumber(minutes)}m </div>
      </div>
    )
  }

  if (green) {
    return (
      <h4>
        <img src={ClockIconGreen} /> {newFunction()}
        {t('untilTheDraw')}
      </h4>
    )
  }
  return (
    <h4>
      <img src={ClockIcon} /> {newFunction()}
      {t('untilTheDraw')}
    </h4>
  )

  function newFunction() {
    return timestampDateOfDraw ? <Countdown date={Date.now() + getTimeToDate(new Date(timestampDateOfDraw * 1000))} renderer={RenderCountDown} /> : <div></div>
  }
}

export default CountDownRaffle
