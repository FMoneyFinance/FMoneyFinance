import React from 'react'
import '../styles.scss'

function RafflePoints({ number, active, onPress, winner, block }: any) {
  return (
    <h4
      className={`containerRafflePoint pointer block-active-${active && !block} block-winner-${winner}`}
      onClick={() => {
        if (!block) onPress()
      }}
    >
      {number < 10 ? '0' + number : number}
    </h4>
  )
}

export default RafflePoints
