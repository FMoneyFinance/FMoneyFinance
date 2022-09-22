import React from 'react'
import { EventEmitter } from 'events'
import { getConnectorInstance } from '../web3/walletConnect'
import { CheckMetamaskInstalled } from '../web3/functions/metamask'

const AppContext = React.createContext({})

export const getInitialState = () => {
  const prevStateParsed = JSON.parse(localStorage.getItem('state') || '{}')

  if (prevStateParsed?.showModal) delete prevStateParsed.showModal

  const prevState = Object.keys(prevStateParsed || {})?.length ? prevStateParsed : {}

  return prevState
}

export const checkMetamaskConnection = async (changeContext: Function) => {
  if (CheckMetamaskInstalled()) {
    const winContext: any = window
    const chainId = await winContext?.ethereum?.request({ method: 'eth_chainId' })
    console.log('chainId', chainId)
    const accounts: Array<string> = (await winContext?.ethereum?.request({ method: 'eth_accounts' })) || []

    if (accounts?.length == 0) {
      changeContext({ walletAddress: null, userAccountSignature: null })
    }
  } else {
    const connectorInstance = getConnectorInstance()

    if (connectorInstance && !connectorInstance.connected) {
      changeContext({ walletAddress: null, userAccountSignature: null })
    }
  }
}

export default AppContext
