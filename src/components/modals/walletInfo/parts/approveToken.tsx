import React, { Suspense, useEffect, useState } from 'react'
import { useContext } from 'react'
import AppContext from '../../../../context/AppContext'
import '../index.scss'

import { handleApproveTransfer } from '../../../../web3/functions/transactions'

import { useTranslation } from 'react-i18next'
import LogoLoader from '../../../../assets/logos/main.webp'
import Button from '../../../Buttons'

import LoadingApprove from './loadingApprove'

function ApproveToken({ setIndex, tokenSelected, setAlertHasToApprove, setApprovingTokenState }: any) {
  const { t } = useTranslation(['modalWalletInfo'])
  const context: any = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(false)
  const [alertMsg, setAlertMsg] = useState<any>(t('approveTokenModal.alert'))

  /* Set in LocalStorage */
  const setLocalItems = (defaultToken: any) => {
    localStorage.setItem('defaultToken', JSON.stringify(defaultToken))
  }

  const handleApprove = async () => {
    const empty: any = ''

    setLoading(true)
    setApprovingTokenState(true)

    const selectedTokenToBuyTickets = tokenSelected?.tokenSmartContract
    const response: any = await handleApproveTransfer(selectedTokenToBuyTickets)

    setLoading(false)
    if (response.success) {
      setLocalItems(tokenSelected)
      setIndex(1)
      setAlertHasToApprove(true)
      setTimeout(() => {
        setAlertHasToApprove(false)
      }, 15000)
      setLoading(false)
      setApprovingTokenState(false)
    } else {
      setLoading(false)
      setError(true)
      setAlertMsg(response.error?.message || response.error)
      setApprovingTokenState(false)
    }
  }

  function ApproveDefault() {
    /* alert component */
    const Alert = () => {
      return (
        <div className={`alertContainerApprove error-${error}`}>
          <div className="alert-content">
            <p>{alertMsg}</p>
          </div>
        </div>
      )
    }

    return (
      <Suspense fallback="">
        <div className="containerTitle start">
          <h4>{t('approveTokenModal.noApproveToken')}</h4>
        </div>
        <div className="containerApproveToken">
          <img src={tokenSelected.tokenLogo} alt={tokenSelected.tokenName} />
          <div>
            <h3>{tokenSelected.tokenName}</h3>
          </div>
        </div>
        <div className="containerSelectToken"></div>
        <Alert />
      </Suspense>
    )
  }

  return (
    <Suspense fallback="">
      <div className="container-modal-wallet-info" style={{ marginBottom: '12vh' }}>
        {loading ? <LoadingApprove /> : <ApproveDefault />}
      </div>
      {!loading && (
        <div className="ModalInfo_ContainerButton" style={{ position: 'relative', left: '0px', right: '0px', width: '90%', bottom: '0px', marginTop: '0px' }}>
          <Button applyStyle={{ padding: '20px', boxSizing: 'border-box', marginBottom: '20px' }} disabled={loading} text={t('approveTokenModal.buttonApprove')} onPress={() => handleApprove()} />
        </div>
      )}
    </Suspense>
  )
}

export default ApproveToken
