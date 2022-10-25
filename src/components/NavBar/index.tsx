import React, { useState, useEffect } from 'react'
import Mainlogo from '../../assets/logos/main.svg'
import Languague from '../../assets/icons/languague.svg'
import './styles.scss'
import Button from '../Buttons'
import Logo from '../logo'
import ConnectWallet from '../Buttons/connectWallet/index'
import { useTranslation } from 'react-i18next'
import DropDown from '../DropDown'
import { isMobile } from 'react-device-detect'

function NavBar({ hideConnect, tikcketDetails }: any) {
  const { t } = useTranslation(['home'])
  const [openDrop, setOpenDrop] = useState(false)
  const [mobileWidth, setMobileWidth] = useState(window.screen.width > 950)
  const openDropDown = () => {
    setOpenDrop(!openDrop)
  }

  const Item = (props: any) => {
    return (
      <div>
        <h4 className={'itemNavbar ' + props.text}>{props.text}</h4>
      </div>
    )
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleResize = () => {
    if (window.screen.width < 950) {
      setMobileWidth(true)
    } else {
      setMobileWidth(false)
    }
  }

  return (
    <div className="containerNavBar">
      <div className="containerNavBarChild">
        <Logo />

        <div className="containerItems">
          <div className="containerSelecLanguage">
            <div className="containerSelecLanguageImg" onClick={openDropDown}>
              <img src={Languague} />
            </div>
            <div>{openDrop && <DropDown setOpenDrop={setOpenDrop} />}</div>
          </div>
          {!hideConnect && <ConnectWallet tikcketDetails={tikcketDetails} />}
        </div>
      </div>
    </div>
  )
}

export default NavBar
