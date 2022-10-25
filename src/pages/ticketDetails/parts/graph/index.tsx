import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Raffling from './Raffling'
import RaffleOpen from './RaffleOpen'
import RaffleClosed from './RaffleClosed'
import GraphLinesClosed from './GraphLinesClosed'
import GraphLines from '../../../../components/graph/lines'
import { raffleInterface } from '../../../../interfaces/raffles'
import CountDownRaffle from '../../../../components/raffle/countdownDraw'
import ExpandedLoader from '../../../../components/elements/loader/full/index'
import { raffleGraphReferencesToGraphDate } from '../../../../utils/graph'
import { getColorOfStatus, getNameOfStatus } from '../../../../utils/raffles'
import Money5 from '../../../../assets/ilustrations/landingpage/moneys/money5.svg'

function GraphTicketDetails({ raffleSelected }: any) {
  const { t } = useTranslation(['ticket-details'])
  const [showGraph, setShowGraph] = useState(true)
  const [removeGraphLoader, setRemoveGraphLoader] = useState(false)

  useEffect(() => {
    setShowGraph(false)
    setTimeout(() => {
      setShowGraph(true)
    }, 500)
  }, [, raffleSelected?.raffleSmartContractAddress])

  useEffect(() => {
    setShowGraph(false)
    setRemoveGraphLoader(false)

    if (raffleSelected?.raffleStatus == 'raffling' || raffleSelected?.raffleStatus == 'closed') {
      setRemoveGraphLoader(true)
    }

    if (raffleSelected?.raffleStatus == 'closed') {
      setShowGraph(true)
    }

    setTimeout(() => {
      setShowGraph(true)
    }, 500)
  }, [raffleSelected?.raffleStatus])

  const Moneys = () => {
    return (
      <div className="ContainerMoneys">
        <img src={Money5} className="Money5" />
      </div>
    )
  }

  const Table = () => {
    /* Raffling */
    if (raffleSelected?.raffleStatus == 'raffling') {
      return <Raffling />
    }
    /* Closed */
    if (raffleSelected?.raffleStatus == 'closed') {
      return <RaffleClosed raffleSelected={raffleSelected} />
    }
    /* Open to buy */
    return <RaffleOpen raffleSelected={raffleSelected} />
  }

  return (
    <div className={raffleSelected?.raffleStatus == 'raffling' ? 'graphContainer raffling' : 'graphContainer'}>
      <div className="maxWidth graphFather">
        <div className="container-left">
          {showGraph ? (
            <>
              {!removeGraphLoader && <ExpandedLoader applyStyle={{ width: '90%', maxWidth: '725px', marginLeft: '0px', position: 'absolute', zIndex: 1, maxHeight: '415px' }} text={raffleSelected?.raffleStatus == 'raffling' ? t('rafflingStatus') : t('loadingGraph')} />}
              <div className="graph">{raffleSelected?.raffleStatus == 'closed' ? <GraphLinesClosed raffleSelected={raffleSelected} /> : <GraphLines keyValue="prize" config={{ width: window.innerWidth * 0.7 }} raffleSelected={raffleSelected} handleRemoveGraphLoader={(stateToSet: any) => setRemoveGraphLoader(stateToSet)} />}</div>
              {raffleSelected.raffleStatus == 'open' && (
                <div className="dateToExpire">
                  <CountDownRaffle timestampDateOfDraw={raffleSelected.timestampDateOfDraw} />
                </div>
              )}
            </>
          ) : (
            <ExpandedLoader applyStyle={{ width: '100%', maxWidth: '715px', marginLeft: '0px' }} text={raffleSelected?.raffleStatus == 'raffling' ? t('rafflingStatus') : t('loadingGraph')} />
          )}
        </div>
        <Table />
      </div>
      <Moneys />
    </div>
  )
}

export default GraphTicketDetails
