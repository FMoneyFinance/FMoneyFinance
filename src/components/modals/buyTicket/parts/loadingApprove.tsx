import React, { Suspense, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import LogoLoader from '../../../../assets/logos/main.webp'

function LoadingApprove({ setIndex, tokenSelected, setAlertHasToApprove }: any) {
  const { t } = useTranslation(['modalBuyTicket'])

  function Loader() {
    return (
      <Suspense fallback="">
        <div className="container-ApproveLoadingBuy">
          <img src={LogoLoader} alt="Fmoney" style={{ width: '50%', maxWidth: '120px' }} />
        </div>
        <div>
          <span>{t('modalBuyTicket.buyingTickets.approvingTransfer')}</span> <br />
          <span>
            {t('modalBuyTicket.buyingTickets.dontReload.text1')} <br /> {t('modalBuyTicket.buyingTickets.dontReload.text2')}
          </span>
        </div>
      </Suspense>
    )
  }

  return (
    <Suspense fallback="">
      <div className="container-modal-wallet-info">
        <Loader />
      </div>
    </Suspense>
  )
}

export default LoadingApprove
