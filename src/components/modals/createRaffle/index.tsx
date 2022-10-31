import React, { useContext, useRef, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isMobile } from 'react-device-detect'

import './index.scss'
import FullModal from '../base/full'
import InputText from '../../forms/text'
import { getErrorCreateRaffle } from './errors'
import LoaderComponent from '../../elements/loader'
import AppContext from '../../../context/AppContext'
import InputSelect from '../../forms/selector/input'
import { monthsEn, monthsEs, years } from '../../../utils/jsons/index'
import { CreateRaffleFunct } from '../../../web3/functions/raffles'
import { AMPM, days, hours, hoursPM, minutes } from '../../../utils/jsons'
import ticketanddivider from '../../../assets/ilustrations/landingpage/ticketanddivider.svg'

function ModalCreateRaffle() {
  const currentLanguage = localStorage.getItem('i18nextLng')
  const { t } = useTranslation(['modalCreateRaffle'])
  const context: any = useContext(AppContext)
  const [index, setIndex] = useState(1)
  const [raffleName, setRaffleName] = useState('')
  const [monthSelected, setMonthSelected] = useState(currentLanguage === 'en' ? monthsEn[0] : monthsEs[0])
  const [daySelected, setDaySelected] = useState(days[10])
  const [yearSelected, setYearSelected] = useState(years[0])
  const [minuteSelected, setMinuteSelected] = useState(minutes[5])
  const [hourSelected, setHourSelected] = useState(hours[3])
  const [AMPMSelected, setAMPMSelected] = useState('AM')
  const [priceOfTicket, setPriceOfTicket] = useState('')
  const [percentageOfPrizeOperator, setPercentageOfPrizeOperator] = useState('20')
  const [maxNumberOfPlayer, setMaxNumberOfPlayer] = useState('')
  const [error, setError] = useState({})
  const [errorDate, setErrorDate] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const stateRef: any = useRef()
  const onChangeMonth = (value: any) => {
    setMonthSelected(value)
  }

  const handleGetRafflesInfoSocket = (data: Array<any>) => {
    const someCreating = data.some((val: any) => val.raffleStatus == 'creating')

    if (stateRef.state && someCreating) setIndex(3)
  }

  const handleCreateRaffle = async () => {
    setGeneralError('')
    setError({})
    const date = `${currentLanguage === 'en' ? monthsEn.indexOf(monthSelected) + 1 : monthsEs.indexOf(monthSelected) + 1}/${daySelected}/${yearSelected} ${hourSelected}:${minuteSelected}:00`

    const payload: object = {
      errorDate,
      translation: t,
      selectedRaffleName: raffleName,
      selectedDateOfDraw: Date.parse(date),
      selectedPriceOfTheRaffleTicket: priceOfTicket,
      selectedPercentageOfPrizeToOperator: percentageOfPrizeOperator,
      selectedMaxNumberOfPlayers: maxNumberOfPlayer
    }

    setIndex(2)

    const response: any = await CreateRaffleFunct(payload)
    if (response.success) {
      const newRaffle = {
        priceOfTheRaffleTicketInUSDC: Number(priceOfTicket),
        raffleStatus: 'creating',
        selectedPercentageOfPrizeToOperator: percentageOfPrizeOperator,
        selectedMaxNumberOfPlayers: maxNumberOfPlayer,
        fake: true
      }

      context.changeContext({
        rafflesInfo: [newRaffle, ...context.state.rafflesInfo]
      })
      setIndex(3)
    } else {
      if (response.error?.code) {
        setGeneralError(getErrorCreateRaffle(response.error?.code || ''))
      } else {
        setError(response.errors)
      }
      setIndex(1)
    }
  }

  const handleClick = () => {
    switch (index) {
      case 1:
        handleCreateRaffle()
        break
      case 3:
        context.changeContext({ showModal: null })
        break
      default:
        break
    }
  }

  const Title = ({ title }: any) => {
    return <h5 className="title">{title}</h5>
  }

  const Forms = () => {
    const errorList: any = error

    const indexMonth = currentLanguage === 'en' ? monthsEn.indexOf(monthSelected) + 1 : monthsEs.indexOf(monthSelected) + 1
    const daysInMonth = new Date(yearSelected, indexMonth, 0).getDate()

    const pleaceHolderDays = () => {
      if (daySelected) {
        return Number(daySelected) < daysInMonth ? daySelected : daysInMonth
      }
      return '23'
    }

    return (
      <div className="modalCretaeRaffle">
        <Title title={t('inputs.raffleName')} />
        <InputText
          config={{
            placeholder: t('inputs.raffleNamePlaceholder'),
            error: errorList?.selectedRaffleName
          }}
          controller={setRaffleName}
          value={raffleName}
        />
        <Title title={t('inputs.dateOfDraw')} />
        <div className="gridInputs">
          <InputSelect
            config={{
              placeholder: monthSelected,
              options: currentLanguage === 'en' ? monthsEn : monthsEs,
              value: monthSelected,
              onChange: onChangeMonth
            }}
          />
          <InputSelect
            config={{
              placeholder: pleaceHolderDays(),
              options: days,
              value: Number(daySelected) < daysInMonth ? daySelected : daysInMonth,
              daysInMonth: daysInMonth,
              onChange: (val: any) => setDaySelected(val)
            }}
          />
          <InputSelect
            config={{
              placeholder: yearSelected,
              options: years,
              value: yearSelected,
              onChange: (val: any) => setYearSelected(val)
            }}
          />
        </div>
        {errorList?.selectedDateOfDraw && <h5 className="error-input">{errorList?.selectedDateOfDraw}</h5>}
        <Title title={t('inputs.hourOfDraw')} />
        <div className="gridInputs50">
          <InputSelect
            config={{
              placeholder: hourSelected || '07',
              // options: AMPMSelected === 'AM' ? hours : hoursPM,
              options: hours,
              value: hourSelected,
              onChange: (val: any) => setHourSelected(val)
            }}
          />
          <InputSelect
            config={{
              placeholder: minuteSelected || '01',
              options: minutes,
              value: minuteSelected,
              onChange: (val: any) => setMinuteSelected(val)
            }}
          />
          {/* <InputSelect
            config={{
              placeholder: AMPMSelected,
              value: AMPMSelected,
              options: AMPM,
              onChange: (val: any) => setAMPMSelected(val)
            }}
          /> */}
        </div>
        <Title title={t('inputs.PriceTicket')} />
        <InputText
          config={{
            placeholder: '20',
            suffixTxt: 'USDC',
            error: errorList?.selectedPriceOfTheRaffleTicket
          }}
          controller={setPriceOfTicket}
          value={priceOfTicket}
        />
        <Title title={t('inputs.maxPlayers')} />
        <InputText
          controller={setMaxNumberOfPlayer}
          config={{
            placeholder: '10',
            error: errorList?.selectedMaxNumberOfPlayers
          }}
          value={maxNumberOfPlayer}
        />
        {/* <Title title={t('inputs.percentageOfPrice')} />
        <InputText
          config={{
            placeholder: '40',
            suffixTxt: '%',
            error: errorList?.selectedPercentageOfPrizeToOperator
          }}
          value={percentageOfPrizeOperator}
          controller={setPercentageOfPrizeOperator}
        /> */}
        {generalError && <h5 className="error-input">{generalError}</h5>}
      </div>
    )
  }

  const Loader = () => {
    return (
      <div className="loaderCreateRaffle">
        <LoaderComponent logo />
        <h4>{t('loader')}</h4>
      </div>
    )
  }

  const Successs = () => {
    return (
      <div className="successCreateRaffle">
        <img src={ticketanddivider} />
        <h4>{t('success')}</h4>
      </div>
    )
  }

  const renderComponent = (): any => {
    switch (index) {
      case 1:
        return <Forms />
      case 2:
        return <Loader />
      case 3:
        return <Successs />
      default:
        return <div></div>
    }
  }
  const RenderComponentMemo = useMemo(renderComponent, [index, AMPMSelected, hourSelected, minuteSelected, yearSelected, monthSelected, daySelected])

  return (
    <FullModal
      showModal={true}
      config={{
        title: t('title'),
        buttonTxt: index == 3 ? t('buttonTexts.done') : t('buttonTexts.createRaffle'),
        hideElements: index == 2,
        onPressButton: handleClick,
        classButton: 'buttonModalBuyTickets',
        styles: {},
        width: isMobile && '90%',
        setShowModal: () => {
          context.changeContext({ showModal: null })
        }
      }}
    >
      {RenderComponentMemo}
    </FullModal>
  )
}

export default React.memo(ModalCreateRaffle)
