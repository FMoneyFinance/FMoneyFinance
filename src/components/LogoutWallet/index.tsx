import React, { useEffect, useRef, useContext, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteWalletAddressFromStorage } from '../../utils/storage'
import AppContext from '../../context/AppContext'
import './styles.scss'
import Exit from '../../assets/icons/exit.svg'
import ModalInfoWallet from '../modals/walletInfo'
import ModalWalletInfo from '../modals/walletInfo'
import { disconnectWallet } from '../../web3/functions/accounts'
import { useNavigate } from 'react-router-dom'

function LogoutWallet({ setOpenDropOptions }: any) {
  const { t } = useTranslation(['connectWallet'])
  const context: any = useContext(AppContext)
  const { state, changeContext } = context
  const WindowContext: any = window
  let menuRef: any = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    let handler = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event?.target)) {
        setOpenDropOptions(false)
      }
    }
    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  useEffect(() => {
    if (WindowContext.ethereum) {
      WindowContext.ethereum.on('disconnect', onRemoveAccount)
    }

    return () => {
      if (WindowContext.ethereum) {
        WindowContext.ethereum?.removeListener('disconnect', onRemoveAccount)
      }
    }
  }, [])

  const onRemoveAccount = () => {
    disconnectWallet(changeContext)
    setOpenDropOptions(false)
  }

  const handleOpenModalWallet = () => {
    changeContext({
      showModal: (
        <Suspense fallback="">
          <ModalWalletInfo />
        </Suspense>
      )
    })
  }

  const handleNavigateUserHistory = () => {
    navigate(`/user-raffle-history/${context?.state?.walletAddress}`)
  }
  const handleNavigateAdminTools = () => {
    navigate(`/admin-tools`)
  }

  return (
    <>
      <div ref={menuRef} className="containerLogoutWallet">
        {context.state?.isAdminUser && (
          <div className="pointer">
            <p onClick={handleNavigateAdminTools}>{t('options.adminTools')}</p>
          </div>
        )}
        <div className="pointer">
          <p onClick={handleOpenModalWallet}>{t('options.wallet')}</p>
        </div>
        <div className="pointer">
          <p onClick={handleNavigateUserHistory}>{t('options.raffleHistory')}</p>
        </div>
        <div className="pointer" onClick={onRemoveAccount}>
          <p className="withicon">
            <span>{t('options.disconnect')}</span>
            <img src={Exit} />
          </p>
        </div>
      </div>
    </>
  )
}

export default LogoutWallet
