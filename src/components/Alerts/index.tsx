import React from 'react'
import './styles.scss'

function AlertToast({ text, styles }: any) {
  return (
    <div className="containerAlertToast flex" style={styles ? styles : null}>
      <div className="divider"></div>
      <div className="text flex">
        <span> {text} </span>
      </div>
    </div>
  )
}

export default AlertToast
