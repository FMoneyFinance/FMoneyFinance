import React, { useRef, useState } from 'react'
import 'swiper/css'
import SliderRaffles from '../../../../components/tickets/slider/slider'
import { useTranslation } from 'react-i18next'

function MiniPools(props: any) {
  const { t } = useTranslation(['ticket-details'])
  const deleteTheActualTicket = (listOfTickets: Array<any>): Array<any> => {
    listOfTickets = listOfTickets?.filter((ticket: any) => ticket.raffleSmartContractAddress != props.raffleSmartContractAddress)
    return listOfTickets
  }

  return (
    <div className="minipoolScreen">
      <div className="maxWidth containerMiniPoolText">
        <h2>{t('otherMiniRaffles.title')}</h2>
        <div className="rowTitle">
          <h4>{t('otherMiniRaffles.text')}</h4>
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <SliderRaffles params={props.params} raffleSmartContractAddress={props.raffleSmartContractAddress} setList={deleteTheActualTicket} />
      </div>
    </div>
  )
}

export default MiniPools
