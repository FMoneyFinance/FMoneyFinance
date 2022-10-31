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
      {/* <div className="containerNavBarChild"> */}
      <div className="containerNavBarLogoLang">
        <div>
          <Logo />
        </div>
        <div className="containerSelecLanguage">
          <div className="containerSelecLanguageImg" onClick={openDropDown}>
            <img src={Languague} />
          </div>
          <div>{openDrop && <DropDown setOpenDrop={setOpenDrop} />}</div>
        </div>
      </div>
      <div className="containerNavBarActionButtons">
        <div className="buyButtonContainer">
          <div
            className="buyButtonDesktop"
            onClick={() => {
              window.open('https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xD283EC9db7B3094ED5a2c87Eb48D54f5FA96e96D', '_blank')
            }}
          >
            {`${t('buyButton')}`}
          </div>
        </div>
        <div className="connectWalletButtonContainer">{!hideConnect && <ConnectWallet tikcketDetails={tikcketDetails} />}</div>
      </div>
      {/* <div className="containerItems">
        {!mobileWidth && (
          <div
            className="buyButtonDesktop"
            onClick={() => {
              window.open('https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xD283EC9db7B3094ED5a2c87Eb48D54f5FA96e96D', '_blank')
            }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: '#D38500', marginLeft: '1vw', color: '#fff', padding: '0.6vw 1vw', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold' }}
          >
            Buy FMON
          </div>
        )}
        <div className="containerSelecLanguage">
          <div className="containerSelecLanguageImg" onClick={openDropDown}>
            <img src={Languague} />
          </div>
          <div>{openDrop && <DropDown setOpenDrop={setOpenDrop} />}</div>
        </div>
      </div>
      {mobileWidth && (
        <div
          className="buyButtonMobile"
          onClick={() => {
            window.open('https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xD283EC9db7B3094ED5a2c87Eb48D54f5FA96e96D', '_blank')
          }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: '#D38500', marginLeft: '1vw', color: '#fff', padding: '0.6vw 1vw', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Buy FMON
        </div>
        )} */}
      {/* </div> */}
    </div>
  )
}

export default NavBar
