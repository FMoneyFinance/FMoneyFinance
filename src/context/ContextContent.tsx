import React, { useContext, useEffect, Suspense, useRef } from 'react'
import ModalConnectWallet from '../components/modals/connectWallet'
import AppContext from './AppContext'
import { useNavigate } from 'react-router-dom'
import { connectToSocket } from '../api/socket'
import { getConnectorInstance } from '../web3/walletConnect'
import { deleteWalletAddressFromStorage } from '../utils/storage'
import { handleAccountWalletChange, handleAccountWalletChangeWalletConnect, disconnectWallet } from '../web3/functions/accounts'

const timeout = (millis: number) => new Promise((resolve) => setTimeout(resolve, millis))

function ContextContent({ children }: any) {
  const WindowContext: any = window
  const context: any = useContext(AppContext)
  const { state, changeContext } = context
  const stateRef: any = useRef()

  const handleGetRafflesInfoSocket = async (payload: any) => {
    if (payload) {
      let fakeRaffles: any = []
      if (state.rafflesInfo) {
        fakeRaffles = state.rafflesInfo.filter((raffle: any) => raffle.fake)
      }

      changeContext({ rafflesInfo: [...fakeRaffles, ...payload] })
    }
  }

  useEffect(() => {
    stateRef.state = context.state
  }, [context])

  const saveState = () => {
    localStorage.setItem('state', JSON.stringify(stateRef.state))
    return false
  }

  useEffect(() => {
    if (WindowContext.ethereum) {
      WindowContext.ethereum.on('accountsChanged', (accounts: any) => {
        if (accounts?.length == 0) {
          deleteWalletAddressFromStorage()
          changeContext({ ...state, walletAddress: null })
        }
      })
    }

    handleWalletConnectProvider()
  }, [])

  useEffect(() => {
    WindowContext.ethereum?.on('accountsChanged', (props: any) => {
      handleAccountWalletChange(props, context)
    })
    WindowContext.ethereum?.on('chainChanged', (_chainId: any) => {
      if (!context.state.isAdminUser) {
        disconnectWallet(changeContext)
        setTimeout(() => window.location.reload(), 500)
      }
    })

    return () => {
      WindowContext.ethereum?.removeListener('accountsChanged', (props: any) => {
        handleAccountWalletChange(props, context)
      })

      if (!context.state.isAdminUser) WindowContext.ethereum?.on('chainChanged', (_chainId: any) => window.location.reload())
    }
  }, [])

  useEffect(() => {
    window.onbeforeunload = function (event: any) {
      event.preventDefault()
      saveState()
    }

    context.socketConnection.on('current-raffles-info', handleGetRafflesInfoSocket)

    return () => {
      window.onbeforeunload = null
      context.socketConnection.off('current-raffles-info')
      context.socketConnection.emit('diconnect-from-general-socket')
    }
  }, [])

  const handleWalletConnectProvider = async () => {
    const connectorInstance = getConnectorInstance()

    if (connectorInstance && connectorInstance.connected) {
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
        console.log('currentWalletConnectSelectedWallet', String(currentWalletConnectSelectedWallet).toLowerCase(), 'currentLocalSelectedWallet', String(currentLocalSelectedWallet).toLowerCase())

        if (String(currentLocalSelectedWallet).toLowerCase() === 'null' || String(currentWalletConnectSelectedWallet).toLowerCase() !== String(currentLocalSelectedWallet).toLowerCase()) {
          handleAccountWalletChangeWalletConnect(currentWalletConnectSelectedWallet, context)
          location.reload()
        }
      })
    }
  }

  return (
    <>
      {context.state?.showModalConnectWallet && (
        <Suspense fallback="">
          <ModalConnectWallet
            {...{
              showModal: context.state?.showModalConnectWallet,
              setShowModal: (newValue: boolean) => {
                changeContext({ showModalConnectWallet: newValue })
              }
            }}
          />
        </Suspense>
      )}
      {context.state?.showModal && typeof context.state.showModal === 'function' ? context.state.showModal() : context.state.showModal}
      {children}
    </>
  )
}

export default ContextContent
