import React, { Suspense, useEffect, useState } from 'react'
import { useContext } from 'react'
import AppContext from '../../../../context/AppContext'
import { handleApproveTransfer } from '../../../../web3/functions/transactions'
import { useTranslation } from 'react-i18next'
import LogoLoader from '../../../../assets/logos/main.webp'
import Button from '../../../Buttons'
import LoadingApprove from './loadingApprove'

function ApproveTokenBuy({ isCheckEnabled, tokenSelected, setIndex, approvingState }: any) {
  const { t } = useTranslation(['modalWalletInfo'])
  const context: any = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(false)
  const [alertMsg, setAlertMsg] = useState<any>(t('approvingWarning'))

  /* Set in LocalStorage */
  const setLocalItems = (defaultToken: any) => {
    localStorage.setItem('defaultToken', JSON.stringify(defaultToken))
  }

  const handleApprove = async () => {
    const empty: any = ''

    setLoading(true)
    approvingState(true)

    const selectedTokenToBuyTickets = tokenSelected?.tokenSmartContract
    const response: any = await handleApproveTransfer(selectedTokenToBuyTickets)

    setLoading(false)
    if (response.success) {
      if (isCheckEnabled) {
        setLocalItems(tokenSelected)
      } else {
        sessionStorage.setItem('defaultToken', JSON.stringify(tokenSelected || {}))
      }

      setIndex('')
      setLoading(false)
      approvingState(false)
    } else {
      setLoading(false)
      setError(true)
      approvingState(false)
      setAlertMsg(response.error?.message || response.error)
    }
    setLoading(false)
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
          <h4>{t('hasToBeApproved')}</h4>
        </div>
        <div className="containerApproveToken">
          <img src={tokenSelected.tokenLogo} alt={tokenSelected.tokenName} />
          <div>
            <h3>{tokenSelected.tokenSymbol}</h3>
          </div>
        </div>
        <div className="containerSelectToken"></div>
        <Alert />
      </Suspense>
    )
  }

  return (
    <Suspense fallback="">
      <div className="container-modal-wallet-info modalBuy" style={{ marginBottom: '12vh' }}>
        {loading ? <LoadingApprove /> : <ApproveDefault />}
      </div>
      <div className="ModalInfo_ContainerButton" style={{ position: 'relative', left: '0px', right: '0px', width: '90%', bottom: '0px', marginTop: '0px' }}>
        <Button applyStyle={{ padding: '20px', boxSizing: 'border-box', marginBottom: '20px' }} hidden={loading} text={t('buttonText')} onPress={() => handleApprove()} />
      </div>
    </Suspense>
  )
}

export default ApproveTokenBuy
