import React, { Suspense, useContext, useEffect, useState } from 'react'
import { allowed_tokens_api } from '../../../../api/users-management'
import AppContext from '../../../../context/AppContext'
import { useTranslation } from 'react-i18next'
import LogoLoader from '../../../../assets/logos/main.webp'
import Button from '../../../Buttons'
import { has_to_approve_api } from '../../../../api/tickets-management'
import LoadingApprove from './loadingApprove'
import '../index.scss'

function DefaultToken({ setIndex, setToken, tokenSelected, alertHasToApprove, setAlertHasToApprove, setApprovingTokenState }: any) {
  const { t } = useTranslation(['modalWalletInfo'])
  const context: any = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [allowedTokens, setAllowedTokens] = useState([])
  const [loadingButton, setLoadingButton] = useState(false)
  const [loadingApprove, setLoadingApprove] = useState(false)

  useEffect((): any => {
    getAllowedTokens()
  }, [])

  const getAllowedTokens = async () => {
    if (context?.state?.walletAddress?.length > 10 && context?.state?.userAccountSignature) {
      setLoading(true)

      if (sessionStorage.getItem('allowedTokensToTrade')) {
        setLoading(false)
        return setAllowedTokens(JSON.parse(sessionStorage.getItem('allowedTokensToTrade') || '[]'))
      }

      setLoading(false)
      return setAllowedTokens([])
    }

    setLoading(false)

    return null
  }

  /* Set in LocalStorage function */
  const setLocalItems = (defaultToken: any) => {
    console.log('defaultToken', defaultToken)
    localStorage.setItem('defaultToken', JSON.stringify(defaultToken))
  }

  const handleLoadingButton = (newState: boolean) => {
    setLoadingButton(newState)
  }

  const handleClickSelected = async (tokenSelected: any) => {
    setApprovingTokenState(true)
    handleLoadingButton(true)
    setLoadingApprove(true)
    const payload: object = {
      tokenToApprove: tokenSelected?.tokenSmartContract
    }

    const response: any = await has_to_approve_api(payload, context)

    if (response.success && response.hasToApprove) {
      setIndex(2)
    }

    if (response.success && !response.hasToApprove) {
      setLocalItems(tokenSelected)
      setAlertHasToApprove(true)
      handleLoadingButton(false)
      setTimeout(() => {
        setAlertHasToApprove(false)
      }, 15000)
    }

    setApprovingTokenState(false)
    handleLoadingButton(false)
    setLoadingApprove(false)
  }

  const Loader = () => {
    return (
      <Suspense fallback="">
        <div className="container-load">
          <img src={LogoLoader} alt="Fmoney" />
        </div>
      </Suspense>
    )
  }

  /* alert component */
  const Alert = () => {
    return (
      <div className="alertContainerApprove defaulToken">
        <div className="alert-content">
          <p>{t('defaultTokenModal.approveSucces')}</p>
        </div>
      </div>
    )
  }

  const SelectDefault = () => {
    const Item = ({ title, token, address, img }: any) => {
      return (
        <Suspense fallback="">
          <div className="defaultToken">
            <div className="container">
              <div
                className="round"
                onClick={() => {
                  setToken({ tokenSymbol: token, tokenName: title, tokenSmartContract: address, tokenLogo: img })
                }}
              >
                <input type="checkbox" defaultChecked={String(address).toLowerCase() === String(tokenSelected?.tokenSmartContract).toLowerCase()} id={`checkbox-${token}`} />
                <label></label>
              </div>
              <span className="value textEllipsis">{title}</span>
            </div>
          </div>
        </Suspense>
      )
    }

    if (loadingApprove) {
      return <LoadingApprove />
    }

    return (
      <Suspense fallback="">
        <div className="containerTitle start">
          <h4>{t('defaultTokenModal.selectToken')}</h4>
        </div>
        <div className="containerSelectToken" style={{ marginTop: '15px' }}>
          {allowedTokens.map((item: any, index: number) => (
            <Item title={item?.tokenName} token={item?.tokenSymbol} address={item?.tokenSmartContract} img={item?.tokenLogo} key={index} />
          ))}
        </div>
      </Suspense>
    )
  }

  return (
    <Suspense fallback="">
      <div className="container-modal-wallet-info" style={{ marginBottom: '12vh' }}>
        {loading ? <Loader /> : <SelectDefault />}
        {alertHasToApprove && <Alert />}
      </div>
      {!loadingApprove && (
        <div className="ModalInfo_ContainerButton" style={{ position: 'relative', left: '0px', right: '0px', width: '90%', bottom: '0px', marginTop: '0px' }}>
          <Button applyStyle={{ padding: '20px', boxSizing: 'border-box', marginBottom: '20px' }} disabled={!tokenSelected.tokenSmartContract} loading={loadingButton} onPress={() => handleClickSelected(tokenSelected)} text={t('defaultTokenModal.buttonSelect')} />
        </div>
      )}
    </Suspense>
  )
}

export default DefaultToken
