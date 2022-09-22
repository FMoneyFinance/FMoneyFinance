import React from 'react'
import { getColorOfStatus, getNameOfStatus } from '../../../utils/raffles'

function StatusRaffle({ raffleStatus }: any) {
  return (
    <div className="statusContainer">
      <h3>
        {' '}
        <div className="circleTitle" style={{ background: getColorOfStatus(raffleStatus) }} /> {getNameOfStatus(raffleStatus)}
      </h3>
      <h4>Status</h4>
    </div>
  )
}

export default StatusRaffle
