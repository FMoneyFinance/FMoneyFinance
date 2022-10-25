import React, { useMemo } from 'react'
import InputText from '../../../forms/text'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { validateEmail } from '../../../../utils/validators'

function FormSendEmailTickets({ error, setDisableButton, email, setEmail }: any) {
  const { t } = useTranslation(['modalBuyTicket'])

  useEffect(() => {
    setDisableButton(true)
  }, [])

  const onChange = (emailEvent: any) => {
    setEmail(emailEvent)
    setDisableButton(validateEmail(emailEvent) == null)
  }

  const renderModal = () => {
    return (
      <div className="success-buy-tickets-form-email">
        <h5>{t('sendEmail.subheader')}</h5>
        <InputText
          config={{
            placeholder: 'example@gmail.com',
            onChange
          }}
          controller={setEmail}
          value={email}
        />
        {error && <div style={{ color: 'red', fontWeight: '100', fontSize: '12px', textAlign: 'left', paddingLeft: '20px', marginTop: '8px' }}>{error}</div>}
      </div>
    )
  }

  const memoRenderModal = useMemo(renderModal, [InputText])

  return <>{memoRenderModal}</>
}

export default FormSendEmailTickets
