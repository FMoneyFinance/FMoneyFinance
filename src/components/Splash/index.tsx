import React from 'react'
import Logo from '../logo/index'
import './styles.scss'
import { isMobile } from 'react-device-detect'

function SplashScreen() {
  return (
    <div className="splash-container">
      <Logo hideLabel={isMobile} />
    </div>
  )
}

export default SplashScreen
