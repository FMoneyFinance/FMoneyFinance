import React, { useState, useEffect, useContext, Suspense, useLayoutEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useTranslation } from 'react-i18next'
import { Navigation } from 'swiper'

import ItemTicket from '../item'
import AppContext from '../../../context/AppContext'
import { useInterval } from '../../../hooks/useInterval'
import { deleteFakeRaffles } from '../../../utils/raffles'
import { raffleInterface } from '../../../interfaces/raffles'
import arrowLeftSlider from '../../../assets/icons/arrowLeftSlider.svg'
import arrowRightSlider from '../../../assets/icons/arrowRightSlider.svg'
import TicketOff from '../../../assets/ilustrations/landingpage/ticketOff.svg'
import { get_current_raffles_info_hash, get_current_raffles_list_api } from '../../../api/tickets-management'

const timeout = (millis: number) => new Promise((resolve) => setTimeout(resolve, millis))

function SliderRaffles(props: any) {
  const { t } = useTranslation(['home'])
  const [loading, setLoading] = useState(true)
  const [raffles, setRaffles] = useState<any>([])
  const [numOfTcketsInSlider, setNumOfTcketsInSlider] = useState(6)
  const [showSliderControls, setShowSliderControls] = useState(true)
  const { state: context, changeContext }: any = useContext(AppContext)
  const [rafflesInfoHashInterval, setRafflesInfoHashInterval] = useState<any>()

  const IsEmpty = () => {
    return (
      <div className="container-90vw-width">
        <div className="empty-container-slider">
          <h3>{t('slider.empty')}</h3>
          <h5>{context.state?.isAdminUser ? t('slider.createOne') : t('slider.wait')}</h5>
          <img src={TicketOff} />
        </div>
      </div>
    )
  }

  useInterval(() => {
    handleGetCurrentRafflesInfoHash()
  }, 60000)

  const handleGetCurrentRafflesInfoHash = async () => {
    const response: any = await get_current_raffles_info_hash()
    const rafflesInfoHashUpdated = response.currentRafflesInfoHash
    const currentLocalRafflesInfoHash = sessionStorage.getItem('currentRafflesInfoHash')

    if (!currentLocalRafflesInfoHash || String(currentLocalRafflesInfoHash) !== String(rafflesInfoHashUpdated)) {
      const currentContext = context
      sessionStorage.setItem('currentRafflesInfoHash', rafflesInfoHashUpdated)
      const response: any = await get_current_raffles_list_api()

      changeContext({
        ...currentContext,
        rafflesInfo: response?.currentRafflesInfo
      })
    }
  }

  useEffect(() => {
    setLoading(true)
    if (context?.rafflesInfo) {
      setLoading(false)

      const AllRafflesPrev = raffles.map((raffle: raffleInterface) => raffle?.raffleStatus).join('')
      const allStatesNew = context.rafflesInfo.map((raffle: raffleInterface) => raffle?.raffleStatus).join('')

      if (AllRafflesPrev == allStatesNew) {
        setLoading(false)
        return
      }

      let raffleList = context?.rafflesInfo?.filter((raffle: any) => raffle?.raffleStatus != 'closed')

      if (props.params && props.params.raffleSmartContractAddress) {
        raffleList = raffleList.filter((raffle: any) => String(raffle?.raffleSmartContractAddress).toLowerCase() !== String(props.params.raffleSmartContractAddress).toLowerCase())
      }

      raffleList = deleteFakeRaffles(raffleList)

      if (props?.setList) {
        raffleList = props.setList(raffleList)
      }

      setRaffles(raffleList)
      setLoading(false)
    }
  }, [context?.rafflesInfo, props?.raffleSmartContractAddress])

  useLayoutEffect(() => {
    const handleUpdateSlider = () => {
      const currentScreenWidth = window.screen.width
      const numOfTcketsInSliderUpdated = Math.floor(currentScreenWidth / 250) // --> 250 max width per ticket

      setNumOfTcketsInSlider(numOfTcketsInSliderUpdated)
    }

    window.addEventListener('resize', handleUpdateSlider)

    handleUpdateSlider()

    return () => window.removeEventListener('resize', handleUpdateSlider)
  }, [])

  useEffect(() => {
    handleSliderDisplay()
  }, [numOfTcketsInSlider, raffles])

  const handleSliderDisplay = async () => {
    const slider = document.getElementsByClassName('swiper-wrapper')
    if (slider && slider[0]) {
      if (raffles?.length <= numOfTcketsInSlider) {
        await timeout(500)
        slider[0].className = 'swiper-wrapper justify-content-center'
        setShowSliderControls(false)
      } else if (raffles?.length > numOfTcketsInSlider) {
        await timeout(500)
        slider[0].className = 'swiper-wrapper'
        setShowSliderControls(true)
      }
    }
  }

  return loading ? (
    <Suspense fallback="">
      <div className="container-90vw-width">
        <div className="loading-container-slider shine">
          <h3>{t('slider.title')}</h3>
          <h5>{t('slider.text')}</h5>
        </div>
      </div>
    </Suspense>
  ) : raffles?.length ? (
    <Suspense fallback="">
      <div id="swiper-container" className={'SwiperContainer'}>
        <Swiper modules={[Navigation]} slidesPerView={numOfTcketsInSlider} navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}>
          {raffles?.map((raffle: any, idx: number) => {
            if (raffle?.raffleSmartContractAddress || raffle?.raffleStatus == 'creating') {
              return (
                <SwiperSlide key={idx}>
                  <ItemTicket {...props} raffle={raffle} />
                </SwiperSlide>
              )
            }
            return <SwiperSlide key={idx}></SwiperSlide>
          })}
        </Swiper>
      </div>
      <div className="containerButtonsSlider flex " style={showSliderControls ? { display: 'flex' } : { display: 'none' }}>
        <img className="swiper-button-prev pointer" src={arrowLeftSlider} />
        <img className="swiper-button-next pointer" src={arrowRightSlider} />
      </div>
    </Suspense>
  ) : (
    <IsEmpty />
  )
}

export default SliderRaffles
