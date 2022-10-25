import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../../../components/Buttons/index'
import { addZeroToNumber } from '../../../../utils/formater/number'
import PaginationComponent from '../../../../components/pagination'
import { FormatWalletAddress } from '../../../../utils/formater/string'
import ExpandedLoader from '../../../../components/elements/loader/full/index'
import SquareSelector from '../../../../components/forms/selector/square/index'

function TableRaffleSpots({ loading, raffleSelected, spots, handleBuyTicket, setLoading, error }: any) {
  const [showWrongChainWarning, setShowWrongChainWarning] = useState(false)
  const [spotsToBuyMultiple, setSpotsToBuyMultiple] = useState<any>([])
  const [selectorMultiple, setSelectorMultiple] = useState(false)
  const [spotsPagination, setSpotsPagination] = useState(spots)
  const { t } = useTranslation(['ticket-details'])

  useEffect(() => {
    setLoading(true)
    setSpotsToBuyMultiple([])
    setSpotsPagination(spots)

    if (!loading) {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }, [spots])

  useEffect(() => {
    if (error === 'wrong-chain') setShowWrongChainWarning(true)
  }, [error])

  const Header = () => {
    return (
      <div className="headerTable">
        <div>
          <h3 className="left"># {t('raffleSpots.table.spotText')}</h3>
        </div>
        <div>
          <h3 className="center">{t('raffleSpots.table.playerText')}</h3>
        </div>
        <div>
          {raffleSelected.raffleStatus == 'open' && (
            <h3 className="right pointer" onClick={() => setSelectorMultiple(!selectorMultiple)}>
              {t('raffleSpots.table.buttonSelectSpots')}
            </h3>
          )}
        </div>
      </div>
    )
  }

  const Row = ({ spot }: any) => {
    const active = spot.owner

    const handleSetSquareActive = (newState: boolean) => {
      let spotsToBuyEdited: any = spotsToBuyMultiple

      if (newState) {
        spotsToBuyEdited.push(spot)
      } else {
        spotsToBuyEdited = spotsToBuyEdited?.filter((e: any) => e.position != spot.position)
      }

      setSpotsToBuyMultiple([...spotsToBuyEdited])
    }

    return (
      <div className="row">
        <div className={`left active-${active}`}>
          <h4>{addZeroToNumber(spot.position)}</h4>
        </div>
        <div className="center">
          <h4>{active ? (window.screen.width < 900 ? FormatWalletAddress(spot.owner) : spot.owner) : t('raffleSpots.table.available')}</h4>
        </div>
        <div
          className="right"
          style={{
            justifyContent: selectorMultiple ? 'space-between' : 'flex-start'
          }}
        >
          {!active && (
            <Button
              text={t('raffleSpots.table.buttonBuy')}
              className={'active-' + active}
              onPress={() => {
                handleBuyTicket([spot], spots)
              }}
              rounded
            />
          )}
          {selectorMultiple && !active && (
            <SquareSelector
              {...{
                squareActive: spotsToBuyMultiple?.map((e: any) => e.position).includes(spot.position),
                setSquareActive: handleSetSquareActive
              }}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`table ${loading ? 'without-padding' : ''}`}>
      {showWrongChainWarning ? (
        <>
          <div style={{ fontWeight: '500', color: 'red', fontSize: '1.2rem', padding: '30px', boxSizing: 'border-box', textAlign: 'center', width: '90%', display: 'inline-block', lineHeight: '150%' }}>{t('warningWrongChain')}</div>
        </>
      ) : (
        <>
          {loading || raffleSelected.raffleStatus == 'raffling' ? (
            <ExpandedLoader text={raffleSelected.raffleStatus == 'raffling' ? t('rafflingStatus') : t('raffleSpots.loading.title')} />
          ) : (
            <>
              <Header />
              {spotsPagination?.map((spot: any, i: number) => (
                <Row spot={spot} key={spot.position} number={i} />
              ))}
              <PaginationComponent
                setArray={setSpotsPagination}
                array={spots}
                perPage={15}
                ButtonCenter={
                  selectorMultiple && (
                    <Button
                      onPress={() => {
                        handleBuyTicket(spotsToBuyMultiple, spots)
                      }}
                      secondary
                      text={t('raffleSpots.table.buttonBuyTickets')}
                      className="button-buy-multiple-tickets"
                    />
                  )
                }
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default TableRaffleSpots
