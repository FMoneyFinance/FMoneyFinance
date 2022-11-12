import React, { useContext, useState, useEffect, Suspense } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

import './index.scss'
import FullModal from '../base/full'
import Step2ConnectWallet from './steps/step2'
import SwitchComponent from '../../forms/switch'
import WalletConnect from '@walletconnect/client'
import AppContext from '../../../context/AppContext'
import QRCodeModal from '@walletconnect/qrcode-modal'
import Metamask from '../../../assets/icons/metamask.svg'
import WalletConnectLogo from '../../../assets/icons/walletConnect.svg'
import { handleConnectMetaMask, CheckMetamaskInstalled } from '../../../web3/functions/metamask'
import { getConnectorInstance, handleConnectWallet, handleKillSessionConnector } from '../../../web3/walletConnect'

function ModalConnectWallet({ showModal, setShowModal }: any) {
  const [index, setIndex] = useState(0)
  const context: any = useContext(AppContext)
  const { t } = useTranslation(['modalConnectWallet'])
  const [showWarning, setShowWarning] = useState(false)
  const [errorWalletConnect, setErrorWalletConnect] = useState('')
  const [buttonTxt, setButtonTxt] = useState(t('buttonLearnHowConnect'))
  const [allowWalletConnection, setAllowWalletConnection] = useState(true)

  useEffect(() => {
    if (context.state?.ModalConnectWalletIndex) {
      setIndex(context.state.ModalConnectWalletIndex)
      setButtonTxt(t('buttonSend'))
      context.changeContext({
        ModalConnectWalletIndex: null
      })
    }

    handleGetChainIdData()
  }, [])

  const handleGetChainIdData = async () => {
    const winContext: any = window

    if (!CheckMetamaskInstalled()) {
      const connectorInstance = getConnectorInstance()
      console.log(connectorInstance.connected)

      if (connectorInstance.connected && String(connectorInstance.chainId) !== import.meta.env.VITE_CHAIN_ID_WALLETCONNECT) {
        handleKillSessionConnector()
        setShowWarning(true)
        setAllowWalletConnection(false)
      }
    } else {
      const isConnected = winContext?.ethereum?.isConnected()
      const chainId = await winContext?.ethereum?.request({ method: 'eth_chainId' })

      if (isConnected && chainId !== import.meta.env.VITE_CHAIN_ID_METAMASK) {
        try {
          await winContext?.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: import.meta.env.VITE_CHAIN_ID_METAMASK }]
          })
        } catch (error) {
          console.log('error', error)
          setShowWarning(true)
          setAllowWalletConnection(false)
        }
      }
    }
  }

  const handleChangeChainId = async () => {
    const winContext: any = window

    try {
      await winContext?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: import.meta.env.VITE_CHAIN_ID_METAMASK }]
      })
    } catch (error) {
      console.log('error', error)
      setShowWarning(true)
      setAllowWalletConnection(false)
    }
  }

  const handleClick = () => {
    switch (index) {
      case 0:
        setIndex(1)
        setButtonTxt(t('buttonSend'))
        break
      default:
        break
    }
  }

  const [functionModal, setFunctionModal] = useState({
    funct: () => {
      window.open('https://metamask.zendesk.com/hc/en-us/articles/360045901112-Manually-connecting-to-a-dapp', '_blank')
    }
  })

  const handleWalletConnectConnection = async () => {
    const connectorInstance = getConnectorInstance()
    console.log(connectorInstance)
    console.log(connectorInstance.connected)

    if (!connectorInstance.connected) {
      const walletConnectionResponse = await handleConnectWallet(connectorInstance)
      console.log('walletConnectionResponse.payload.params[0].chainId', walletConnectionResponse.payload.params[0].chainId)

      if (connectorInstance.connected && String(walletConnectionResponse.payload.params[0].chainId) !== import.meta.env.VITE_CHAIN_ID_WALLETCONNECT) {
        handleKillSessionConnector()
        setShowWarning(true)
        setAllowWalletConnection(false)
        return
      }

      if (walletConnectionResponse?.success === false) {
        setErrorWalletConnect(walletConnectionResponse?.message)
        return
      }

      setIndex(1)
      setButtonTxt(t('buttonSend'))
    } else {
      setIndex(1)
      setButtonTxt(t('buttonSend'))
    }
  }

  const Step1 = (props: any) => {
    if (!CheckMetamaskInstalled()) {
      return (
        <div className="modalConnectWallet">
          <div
            className="walletContainer pointer"
            onClick={() => {
              if (showWarning) {
                console.log('not allowed')
                return
              }

              handleWalletConnectConnection()
            }}
          >
            <img src={WalletConnectLogo} id="imgWalletConnect" />
            <h5>WalletConnect</h5>
            {errorWalletConnect && (
              <h4 style={{ textAlign: 'center', marginTop: '20px' }} className="error-container">
                {t('requestCancelled')}
              </h4>
            )}
            {showWarning && (
              <h4 style={{ textAlign: 'center', marginTop: '20px' }} className="error-container">
                {t('warningNotAllowedWalletConnect')}
              </h4>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="modalConnectWallet">
        <div className="walletContainer pointer" onClick={allowWalletConnection ? handleClick : handleChangeChainId}>
          <img src={Metamask} />
          <h5>Metamask</h5>
          {showWarning && (
            <h4 style={{ textAlign: 'center', marginTop: '20px' }} className="error-container">
              {t('warningNotAllowed')}
            </h4>
          )}
        </div>
      </div>
    )
  }

  const Footer = () => {
    return (
      <div className="footer">
        <h5>{t('haventGot')}</h5>
      </div>
    )
  }

  const changeFunctionButton = (funct: any) => {
    setFunctionModal({ funct })
  }

  const renderComponent = () => {
    const propsSteps = { changeFunctionButton, setButtonTxt }

    switch (index) {
      case 0:
        return (
          <Suspense fallback="">
            <Step1 {...propsSteps} />
          </Suspense>
        )
      case 1:
        return (
          <Suspense fallback="">
            <Step2ConnectWallet {...propsSteps} />
          </Suspense>
        )
    }
  }

  return (
    <FullModal
      showModal={showModal}
      config={{
        title: t('title'),

        buttonTxt,
        classButton: 'classButtonConnectWalletModal',
        onPressButton: () => {
          functionModal.funct()
        },
        setShowModal,
        footer: index == 0 && Footer,
        height: isMobile && '45vh',
        width: isMobile && '90%'
      }}
    >
      {renderComponent()}
    </FullModal>
  )
}

export default ModalConnectWallet
