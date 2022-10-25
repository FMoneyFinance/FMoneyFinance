import React from 'react'
import ArrowLeft from '../../../assets/icons/arrowLeft.svg'
import ArrowRight from '../../../assets/icons/arrowRight.svg'
import './index.scss'

function ButtonsArrow({ onPress, right }: any) {
  return (
    <div className="buttonArrow pointer" onClick={onPress}>
      <img src={right ? ArrowRight : ArrowLeft} />
    </div>
  )
}

export default ButtonsArrow
