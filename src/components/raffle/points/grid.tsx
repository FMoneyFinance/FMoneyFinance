import React, { useEffect } from 'react'
import RafflePoints from '.'
import ButtonsArrow from '../../Buttons/arrows'
import { useState } from 'react'

interface props {
  skip: number
  positionToBuy: Array<any>
  allSpots: Array<any>
  setSkip: Function
  getFiltersSpots: Function
  getSpotsToMap: Function
  onSelectRafflePoint: Function
}

function PointsGrid({ skip, allSpots, setSkip, positionToBuy, getFiltersSpots, onSelectRafflePoint, getSpotsToMap }: props) {
  const Points = () => {
    return (
      <div className="gridPoints" style={allSpots.length < 5 ? { display: 'flex', justifyContent: 'center' } : {}}>
        {allSpots.map((point: any) => {
          return (
            <div key={point.position}>
              <RafflePoints onPress={() => onSelectRafflePoint(point)} active={!positionToBuy.includes(point?.position)} block={point.owner != false && point.owner != '0x00000000'} number={point?.position} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className="grid-points-buttons">
        <Points />
      </div>
      <div className="grid-points-buttons" style={{ marginTop: '20px' }}>
        <div className={skip == 0 ? `hidden left` : 'left'} style={getFiltersSpots()?.length <= 15 ? { display: 'none' } : {}}>
          <ButtonsArrow
            onPress={() => {
              if (skip != 0) {
                setSkip(skip - 15)
              }
            }}
          />
        </div>
        <div className={skip + 15 >= getFiltersSpots()?.length ? 'hidden' : ''} style={getFiltersSpots()?.length <= 15 ? { display: 'none' } : {}}>
          <ButtonsArrow
            right
            onPress={() => {
              if (skip + 15 >= getFiltersSpots()?.length == false) {
                setSkip(skip + 15)
              }
            }}
          />
        </div>
      </div>
    </>
  )
}

export default PointsGrid
