import React from 'react'
import { useTranslation } from 'react-i18next'

function RaffleOpen({ raffleSelected }: any) {
  const { t } = useTranslation(['ticket-details'])

  const Item = ({ title, txt, style }: any) => {
    return (
      <div className="itemTable">
        <h4 style={style ? style : {}}>{title}</h4>
        <h3>{txt}</h3>
      </div>
    )
  }

  return (
    <div className="containerTable">
      <Item title={t('infoGraph.acumulatedPrize')} txt={raffleSelected?.currentPrizePot ? '$' + raffleSelected?.currentPrizePot + ' USD' : '$0 USD'} />
      <Item title={t('infoGraph.priceTicket')} txt={raffleSelected?.priceOfTheRaffleTicketInUSDC ? '$' + raffleSelected?.priceOfTheRaffleTicketInUSDC + ' USD' : '$0 USD'} />
      <Item title={t('infoGraph.maximunPlayers')} txt={raffleSelected?.maxNumberOfPlayers ? raffleSelected?.maxNumberOfPlayers : '0'} />
      <Item title={t('infoGraph.currentPlayers')} txt={raffleSelected?.currentNumOfPlayers || 0} />
      <Item title={t('infoGraph.percentajePrice')} txt={raffleSelected?.percentageOfPrizeToOperator ? raffleSelected?.percentageOfPrizeToOperator + '%' : '0%'} />
      <Item style={{ fontSize: '10px' }} title={t('infoGraph.warningPrize')} txt="" />
    </div>
  )
}

export default RaffleOpen
