import React, { Suspense, useContext, useEffect, useState } from 'react'
import FullModal from '../base/full'
import './index.scss'

import AppContext from '../../../context/AppContext'
import ModalInfoWalletContent from './parts/info'
import { disconnectWallet } from '../../../web3/functions/accounts'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import DefaultToken from './parts/defaultToken'
import ApproveToken from './parts/approveToken'

const ModalWalletInfo = () => {
  const context: any = useContext(AppContext)
  const { t } = useTranslation(['modalWalletInfo'])
  const [index, setIndex] = useState(0)
  const [tokenSelected, setTokenSelected] = useState({})
  const [approvingToken, setApprovingToken] = useState(false)
  const [alertHasToApprove, setAlertHasToApprove] = useState(false)

  useEffect(() => {
    setTokenSelected(JSON.parse(localStorage.getItem('defaultToken') || '{}'))
  }, [])

  const renderComponent = () => {
    switch (index) {
      case 0:
        return <ModalInfoWalletContent setIndex={setIndex} />
      case 1:
        return <DefaultToken setIndex={setIndex} setToken={setTokenSelected} tokenSelected={tokenSelected} setAlertHasToApprove={setAlertHasToApprove} alertHasToApprove={alertHasToApprove} setApprovingTokenState={(approvingState: any) => setApprovingToken(approvingState)} />
      case 2:
        return <ApproveToken setIndex={setIndex} tokenSelected={tokenSelected} setAlertHasToApprove={setAlertHasToApprove} alertHasToApprove={alertHasToApprove} setApprovingTokenState={(approvingState: any) => setApprovingToken(approvingState)} />
      default:
        return (
          <Suspense fallback="">
            <div></div>
          </Suspense>
        )
    }
  }

  const closeWallet = () => {
    disconnectWallet(context.changeContext)
    context.changeContext({ showModal: false })
  }

  return (
    <Suspense fallback="">
      <FullModal
        showModal={true}
        config={{
          title: t('title'),
          buttonTxt: index == 0 ? t('buttons.disconnect') : t('buttons.cancel'),
          onPressButton: index == 0 ? closeWallet : () => setIndex(0),
          width: isMobile ? '90%' : '25%',
          height: '60%',
          classButton: 'buttonModalBuyTickets',
          hideButton: approvingToken,
          setShowModal: () => {
            context.changeContext({ showModal: null })
          }
        }}
      >
        {renderComponent()}
      </FullModal>
    </Suspense>
  )
}

export default ModalWalletInfo
