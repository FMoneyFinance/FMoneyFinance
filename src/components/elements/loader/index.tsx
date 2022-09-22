import React from 'react'
import Spinner from '../../../assets/ilustrations/loader.webp'
import SpinnerWhite from '../../../assets/icons/loadingWhite.png'
import LogoGIF from '../../../assets/logos/main.webp'
import './index.scss'

function LoaderComponent({ logo, white, small, xSmall }: any) {
  if (logo) {
    return <img className={`LoaderComponent logo small-${small} xSmall-${xSmall}`} src={LogoGIF} style={{ width: '50%', maxWidth: '120px' }} />
  }
  return <img className={`LoaderComponent rotate small-${small}  xSmall-${xSmall}`} src={white ? SpinnerWhite : Spinner} />
}

export default LoaderComponent
