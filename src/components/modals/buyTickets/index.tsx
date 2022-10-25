import React, { useState, useEffect, useContext, useMemo } from 'react'

import './styles.scss'
import Divider from '../../elements/divider'
import RafflePoints from '../../raffle/points'
import { useTranslation } from 'react-i18next'
import ButtonsArrow from '../../Buttons/arrows'
import PointsGrid from '../../raffle/points/grid'
import { spotInterface } from '../../../interfaces/spot'
import deleteSVG from '../../../assets/icons/closeIcon.svg'

function BuyTicketsModal({ error, setTextButton, raffleSelected, handleDisableButton, checkApprovePoint, allSpots, positionToBuy, successMsg, setpositionToBuy, valuesToPay, handleCalculateValuesToPay }: any) {
  const { t } = useTranslation(['modalBuyTicket'])
  const spotsLength = allSpots?.length

  const [skip, setSkip] = useState(0)
  const [limit, setlimit] = useState(15)
  const [onlyAvailables, setOnlyAvailables] = useState(true)
  const [tokenQuantityToPay, setTokenQuantityToPay] = useState(0)
  const [quantityToPayInUSDC, setQuantityToPayInUSDC] = useState(0)
  const [selectedTokenToBuyTickets, setSelectedTokenToBuyTickets] = useState({ tokenSymbol: '', tokenSmartContract: '' })

  useEffect(() => {
    if (sessionStorage.getItem('defaultToken')) {
      setSelectedTokenToBuyTickets(JSON.parse(sessionStorage.getItem('defaultToken') || '{}'))
    } else if (localStorage.getItem('defaultToken')) {
      setSelectedTokenToBuyTickets(JSON.parse(localStorage.getItem('defaultToken') || '{}'))
    }
  }, [])

  useEffect(() => {
    calculateLimit()
  }, [, skip])

  useEffect(() => {
    getSpotsToMap()
  }, [allSpots, onlyAvailables])

  useEffect(() => {
    handleDisableButton(positionToBuy?.length == 0)
    handleCalculateValuesToPay()
  }, [positionToBuy])

  const calculateLimit = () => {
    setlimit(skip + 15 > spotsLength ? spotsLength : skip + 15)
  }

  const Header = () => {
    return (
      <div className="header">
        <h3 className="left">{t('modalBuyTickets.selectSpots')}</h3>
        <h3
          className="right pointer"
          onClick={() => {
            setSkip(0)
            setOnlyAvailables((val) => !val)
          }}
        >
          {onlyAvailables ? t('modalBuyTickets.showSpots.text2') : t('modalBuyTickets.showSpots.text1')}
        </h3>
      </div>
    )
  }

  const getFiltersSpots = () => {
    if (onlyAvailables) {
      const filtered = allSpots?.filter((spot: any) => spot.owner == false || spot.owner == '0x00000000')

      return filtered
    } else {
      return allSpots
    }
  }

  const getSpotsToMap = () => {
    let list = allSpots
    if (!Array.isArray(allSpots)) return []

    list = getFiltersSpots()

    if (list && skip == 0 && limit == 0) return list.slice(skip, 15)
    return list.slice(skip, limit)
  }

  const onSelectRafflePoint = (point: spotInterface) => {
    let newArrayPoints = [...positionToBuy]

    if (newArrayPoints.includes(point.position)) {
      newArrayPoints = newArrayPoints?.filter((pointFilter: any) => pointFilter != point.position)
    } else {
      newArrayPoints.push(point.position)
    }

    setpositionToBuy(newArrayPoints)
    checkApprovePoint(newArrayPoints)
  }

  const RowOfSelected = () => {
    return (
      <div className="container-row-select">
        <h5>{t('modalBuyTickets.selectedSposts.title')}</h5>
        {positionToBuy?.length > 0 ? (
          <div className="container-row-select-row">
            {positionToBuy
              ?.filter((position: any) => position)
              ?.map((position: any) => (
                <div key={position}>
                  <img className="pointer" src={deleteSVG} alt="delete" onClick={() => onSelectRafflePoint({ position, owner: '' })} />
                  <RafflePoints onPress={() => onSelectRafflePoint({ position, owner: '' })} active={positionToBuy.includes(position)} number={position} />
                </div>
              ))}
          </div>
        ) : (
          <h4 className="not-selected-yet">{t('modalBuyTickets.selectedSposts.noSelectedText')}</h4>
        )}
      </div>
    )
  }

  const Data = () => {
    return (
      <div className="dataContainer">
        <Divider />
        <div className="MainItem">
          <h3> {t('modalBuyTickets.selectedSposts.youPay')} </h3>
          {String(selectedTokenToBuyTickets.tokenSmartContract).toLowerCase() === String(import.meta.env.VITE_USDC_CONTRACT_ADDRESS).toLowerCase() ? (
            <h3 className="strong">
              <span>{valuesToPay ? valuesToPay.quantityExpressedInTokenUnits : 0}</span>
              {selectedTokenToBuyTickets?.tokenSymbol}
            </h3>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'right' }}>
              <h3 className="strong" style={{ margin: '0px 3px 8px' }}>
                <span>{valuesToPay ? valuesToPay.quantityExpressedInTokenUnits : 0}</span>
                {selectedTokenToBuyTickets?.tokenSymbol}
              </h3>
              <h6 className="strong" style={{ textAlign: 'right' }}>
                <span>{valuesToPay ? valuesToPay.quantityExpressedInUSDCUnits : 0}</span>
                USDC
              </h6>
            </div>
          )}
        </div>
        {successMsg && (
          <div className="flex">
            <div className="containerSuccessMsg">
              <h5 className="successMsg-input">{successMsg}</h5>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="modalBuyTicketsModal">
      <Header />
      <PointsGrid
        {...{
          skip,
          setSkip,
          positionToBuy,
          getFiltersSpots,
          allSpots: getSpotsToMap(),
          onSelectRafflePoint,
          getSpotsToMap
        }}
      />
      <RowOfSelected />
      {error && (
        <div className="flex">
          <div className="containerErrorInputs flex">
            <h5 className="error-input">{error.toString()?.length > 181 ? error.toString().substring(0, 180) : error.toString()}</h5>
          </div>
        </div>
      )}
      <Data />
    </div>
  )
}

export default BuyTicketsModal
