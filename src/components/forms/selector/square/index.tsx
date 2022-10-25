import React from 'react'
import '../index.scss'
import Check from '../../../../assets/icons/check.svg'

function SquareSelector({ squareActive, setSquareActive, disabled }: any) {
  return (
    <div
      className={`square pointer square-active-${squareActive}`}
      onClick={() => {
        if (!disabled) setSquareActive(!squareActive)
      }}
    >
      {squareActive && <img src={Check} />}
    </div>
  )
}

export default SquareSelector
