import React from 'react'

import './styles.scss'
import copy from '../../assets/icons/copied.svg'

function Popper({ applyStyle, text, walletModal }: any) {
  return (
    <div style={applyStyle ? applyStyle : {}} className={walletModal ? 'containerPopper walletModal' : 'containerPopper'}>
      <div className="flex">
        <h5 style={{ margin: '0px' }}>{text}</h5>
        <img src={copy} alt="copy" />
      </div>
    </div>
  )
}

export default Popper
