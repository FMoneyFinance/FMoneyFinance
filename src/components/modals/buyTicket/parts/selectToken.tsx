import React from 'react'

import { useState, useEffect } from 'react'
import ArrowDown from '../../../../assets/icons/ArrowDown.svg'
import DropDownTokens from '../../../DropDownTokens'
import CheckBoxGreen from '../../../CheckBoxs/checkBoxGreen'
import LoadingApprove from './loadingApprove'
import { useTranslation } from 'react-i18next'

function SelectToken({ tokenDefault, setToken, setTextButton, check, setCheck, loading, errorSelectedToken }: any) {
  const { t } = useTranslation(['modalBuyTicket'])
  const [dropOptions, setDropOptions] = useState(false)
  const openDropOptionsDown = () => {
    setDropOptions(!dropOptions)
  }

  const handleCheckTokenDefault = () => {
    setCheck(!check)
    setToken(tokenDefault)
  }

  useEffect(() => {
    setTextButton(t('buttonStateTexts.selectToken'))
  }, [])

  const renderModal = () => {
    return (
      <>
        {loading ? (
          <LoadingApprove tokenDefault={tokenDefault} />
        ) : (
          <div className="containerSelectToken">
            <div className="containerSelectDropDown">
              <h4>{t('selectToken.title')}</h4>
              <div className="select-token pointer" onClick={openDropOptionsDown}>
                <h5>{tokenDefault?.token || tokenDefault.tokenName ? tokenDefault?.token || tokenDefault.tokenName : t('selectToken.selectOption')} </h5> <img src={ArrowDown} className={`arrowUp-${dropOptions}`} alt="arrow" />
              </div>
              {dropOptions && <DropDownTokens setToken={setToken} setDropOptions={setDropOptions} />}
              {errorSelectedToken && <div style={{ color: 'red', fontWeight: '100', fontSize: '12px', textAlign: 'left', paddingLeft: '20px', marginTop: '8px' }}>{t('selectToken.errorMessage')}</div>}
            </div>
            <div className="CheckboxContainer">
              <CheckBoxGreen check={check} text={t('selectToken.checkbox')} onPress={handleCheckTokenDefault} />
            </div>
          </div>
        )}
      </>
    )
  }

  return <>{renderModal()}</>
}

export default SelectToken
