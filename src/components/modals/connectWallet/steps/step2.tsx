import { useTranslation } from 'react-i18next'
import React, { useState, useEffect, useContext } from 'react'

import SwitchComponent from '../../../forms/switch'
import LoaderComponent from '../../../elements/loader'
import Check from '../../../../assets/icons/check.svg'
import Error from '../../../../assets/icons/error.svg'
import AppContext from '../../../../context/AppContext'
import Help from '../../../../assets/icons/question.svg'
import { getConnectorInstance } from '../../../../web3/walletConnect'
import { handleAccountWalletChangeWalletConnect } from '../../../../web3/functions/accounts'
import { handleConnectMetaMask, handleConnectWalletConnect, CheckMetamaskInstalled } from '../../../../web3/functions/metamask'

const timeout = (millis: number) => new Promise((resolve) => setTimeout(resolve, millis))

function Step2ConnectWallet(props: any) {
  const { t } = useTranslation(['modalConnectWallet'])
  const context: any = useContext(AppContext)
  const [rememberSwitch, setRememberSwitch] = useState(false)
  const [error, setError] = useState('')
  const [showHelpRemember, setShowHelpRemember] = useState<any>(false)
  const [loading, setLoading] = useState<any | any>({})
  const WindowContext: any = window

  useEffect(() => {
    if (WindowContext.ethereum) {
      WindowContext.ethereum.on('accountsChanged', onChangeAccounts)
    }
  }, [])

  useEffect(() => {
    props.changeFunctionButton(onSubmit)
  }, [rememberSwitch])

  const onChangeAccounts = (accounts: any) => {
    if (accounts && accounts?.length) {
      setError('')
    } else {
      context.changeContext({ showModalConnectWallet: null })
    }
  }

  const onSubmit = async () => {
    let stateOfContext = context
    setLoading({ firstLoading: true })

    let lastResponse: any = {}

    if (CheckMetamaskInstalled()) {
      const firstResponse: any = await handleConnectMetaMask(context)

      setLoading({
        lastLoading: true,
        firstLoading: false,
        firstSuccess: firstResponse.error != true,
        firstError: firstResponse.error
      })

      if (firstResponse?.error != true) {
        lastResponse = await handleConnectMetaMask(context)
        setLoading({
          lastLoading: false,
          lastSuccess: lastResponse.error != true,
          firstSuccess: firstResponse.error != true,
          firstError: firstResponse.error,
          lastError: lastResponse.error
        })
      }

      if (firstResponse.error || lastResponse.error) {
        setLoading((prevVal: any) => {
          return {
            ...prevVal,
            lastLoading: false,
            firstLoading: false
          }
        })
        props.setButtonTxt('Try again')

        setError(firstResponse.msg || lastResponse.msg)
      } else {
        const { userAccountSignature, ...userData } = firstResponse

        if (rememberSwitch) {
          context.changeContext({
            ...firstResponse,
            showModalConnectWallet: false
          })
        } else {
          stateOfContext = {
            ...userData,
            showModalConnectWallet: false
          }

          context.changeContext(stateOfContext)
          context.changeContext(
            {
              ...stateOfContext,
              userAccountSignature
            },
            true
          )

          sessionStorage.setItem('state', JSON.stringify({ userAccountSignature }))
        }
      }
    } else {
      const connectorInstance = getConnectorInstance()
      const firstResponse: any = await handleConnectWalletConnect(context, connectorInstance)

      setLoading({
        lastLoading: true,
        firstLoading: false,
        firstSuccess: firstResponse.error != true,
        firstError: firstResponse.error
      })

      if (firstResponse?.error != true) {
        await timeout(2000)

        setLoading({
          lastLoading: false,
          lastSuccess: true,
          firstSuccess: true,
          firstError: false,
          lastError: false
        }) // Esto mientras encontramos mejor forma de solucionarlo
      }

      if (firstResponse.error || lastResponse.error) {
        setLoading((prevVal: any) => {
          return {
            ...prevVal,
            lastLoading: false,
            firstLoading: false
          }
        })
        props.setButtonTxt('Try again')

        setError(firstResponse.msg || lastResponse.msg)
      } else {
        const { userAccountSignature, ...userData } = firstResponse

        if (rememberSwitch) {
          context.changeContext({
            ...firstResponse,
            showModalConnectWallet: false
          })
        } else {
          stateOfContext = {
            ...userData,
            showModalConnectWallet: false
          }

          context.changeContext(stateOfContext)
          context.changeContext(
            {
              ...stateOfContext,
              userAccountSignature
            },
            true
          )

          sessionStorage.setItem('state', JSON.stringify({ userAccountSignature }))
        }

        connectorInstance.on('session_update', async (error: any, payload: any) => {
          console.log('connector.on("session_update")')

          if (error) {
            throw error
          }

          const newWalletToSet = payload.params[0].accounts[0]
          await timeout(500)
          const currentWalletConnectState: string = localStorage.getItem('walletconnect') || '{"walletAddress":""}'
          const currentWalletConnectSelectedWallet = JSON.parse(currentWalletConnectState).accounts[0]
          const currentLocalState: string = localStorage.getItem('state') || '{"walletAddress":""}'
          const currentLocalSelectedWallet = JSON.parse(currentLocalState).walletAddress

          if (String(currentLocalSelectedWallet).toLowerCase() === 'null' || String(currentWalletConnectSelectedWallet).toLowerCase() !== String(currentLocalSelectedWallet).toLowerCase()) {
            handleAccountWalletChangeWalletConnect(currentWalletConnectSelectedWallet, context)
            location.reload()
          }
        })
      }
    }
  }

  useEffect(() => {
    props.changeFunctionButton(onSubmit)
  }, [])

  const Item = ({ title, number, text, loading, success, error }: any) => {
    const [icon, setIcon] = useState(number)

    useEffect(() => {
      if (loading) {
        setIcon(<LoaderComponent white />)
      } else if (success) {
        setIcon(<img src={Check} />)
      } else if (error) {
        setIcon(<img src={Error} />)
      }
    }, [])

    return (
      <div className={'item item-success-' + success + ' item-error-' + error}>
        <div className="circle">{icon}</div>
        <div className="right">
          <h3>{title}</h3>
          <h5>{text}</h5>
        </div>
      </div>
    )
  }

  const loadingVar: any = loading
  return (
    <>
      <h4 className="advicestep2">{t('step2.advicestep2')}</h4>
      <Item title={t('step2.items.VerifyOwnership.title')} number="1" success={loadingVar.firstSuccess} error={loadingVar.firstError} loading={loading.firstLoading} text={t('step2.items.VerifyOwnership.text')} />
      <Item title={t('step2.items.EnableTrading.title')} error={loadingVar.lastError} loading={loadingVar.lastLoading} success={loadingVar.lastSuccess} number="2" text={t('step2.items.EnableTrading.text')} />
      <div className="rowRemember">
        <h4 className="rememberme pointer">
          {t('step2.rememberMe.title')}
          <img className="pointer" onMouseEnter={() => setShowHelpRemember(true)} onMouseLeave={() => setShowHelpRemember(false)} src={Help} />
        </h4>
        <SwitchComponent
          value={rememberSwitch}
          handleChange={(state: boolean) => {
            setRememberSwitch(!rememberSwitch)
          }}
        />

        <div className={`helpRemember helpRemember-${showHelpRemember}`}>{t('step2.rememberMe.rememberMeText')}</div>
      </div>
      {error && <h5 className="error-container">{error}</h5>}
    </>
  )
}

export default Step2ConnectWallet
