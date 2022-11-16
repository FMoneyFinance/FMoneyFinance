import EventEmitter from 'events'
import socketIo from 'socket.io-client'
import { useState, createContext, useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './assets/scss/index.scss'
import './assets/scss/variables.scss'
import HomeScreen from './pages/home'
import AdminTools from './pages/adminTools'
import UserHistory from './pages/userHistory'
import ComingSoonScreen from './pages/coming-soon'
import ScrollOnTop from './utils/router/scrollOnTop'
import ContextContent from './context/ContextContent'
import TicketDetailsScreen from './pages/ticketDetails'
import { allowed_tokens_api } from './api/users-management'
import AppContext, { checkMetamaskConnection, getInitialState } from './context/AppContext'
import { get_current_raffles_list_api, get_current_raffle_manager_smart_contract_address, get_current_raffle_cashier_smart_contract_address } from './api/tickets-management'
import SplashScreen from './components/Splash'

const io: any = socketIo
const socketConnection = io.connect(import.meta.env.VITE_URL_SOCKET, {
  transports: ['websocket'],
  secure: true
})

function App() {
  const [context, setContext] = useState(getInitialState())
  const ee = new EventEmitter()

  socketConnection.on('connect', () => {
    console.log('connected to socket')
  })

  socketConnection.on('connect_error', (error: any) => {
    console.log('connect error', error)
  })

  const addEvent = (name: string, payload: any) => {
    ee.on(name, payload)
  }

  const emitEvent = (name: string, data: any) => {
    ee.emit(name, data)
  }

  const changeContext = (newState: any) => {
    setContext((val: any) => {
      return { ...val, ...newState }
    })
  }

  const handleGetRafflesInfo = async () => {
    const response: any = await get_current_raffles_list_api()

    setContext((currentContext: any) => {
      const contextUpdated = { ...currentContext, rafflesInfo: response?.currentRafflesInfo }
      return contextUpdated
    })
  }

  const handleGetAllowedTokens = async () => {
    const response: any = await allowed_tokens_api()
    sessionStorage.setItem('allowedTokensToTrade', JSON.stringify(response.currentAllowedTokens))

    setContext((currentContext: any) => {
      const contextUpdated = { ...currentContext, allowedTokensToTrade: response.currentAllowedTokens }
      return contextUpdated
    })
  }

  const handleGetCurrentManagerSmartContract = async () => {
    const response: any = await get_current_raffle_manager_smart_contract_address(context)
    sessionStorage.setItem('currentManagerSmartContract', response.currentRaffleManagerSmartContractAddress)

    setContext((currentContext: any) => {
      const contextUpdated = { ...currentContext, currentManagerSmartContract: response.currentRaffleManagerSmartContractAddress }
      return contextUpdated
    })
  }

  const handleGetCurrentCashierSmartContract = async () => {
    const response: any = await get_current_raffle_cashier_smart_contract_address(context)
    sessionStorage.setItem('currentCashierSmartContract', response.currentRaffleCashierSmartContractAddress)

    setContext((currentContext: any) => {
      const contextUpdated = { ...currentContext, currentCashierSmartContract: response.currentRaffleCashierSmartContractAddress }
      return contextUpdated
    })
  }

  useEffect(() => {
    checkMetamaskConnection(changeContext)
    handleGetRafflesInfo()
    handleGetAllowedTokens()
    handleGetCurrentManagerSmartContract()
    handleGetCurrentCashierSmartContract()

    socketConnection.on('manager-smart-contract-changed-response', (managerSmartContractAddress: any) => {
      console.log('manager-smart-contract-changed-response', managerSmartContractAddress)
      sessionStorage.setItem('currentManagerSmartContract', managerSmartContractAddress)
    })

    return () => {
      socketConnection.off('manager-smart-contract-changed-response')
    }
  }, [])

  return (
    <AppContext.Provider value={{ state: context, changeContext, addEvent, emitEvent, socketConnection }}>
      <ContextContent>
        <Router>
          <ScrollOnTop>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/coming-soon" element={<ComingSoonScreen />} />
              <Route path="/ticket-details-screen/:raffleSmartContractAddress" element={<TicketDetailsScreen />} />
              <Route path="/user-raffle-history/:walletAddress" element={<UserHistory />} />
              <Route
                path="/admin-tools"
                element={
                  <Suspense fallback={<SplashScreen />}>
                    <AdminTools />
                  </Suspense>
                }
              />
            </Routes>
          </ScrollOnTop>
        </Router>
      </ContextContent>
    </AppContext.Provider>
  )
}

export default App
