import React from 'react'
import { useTranslation } from 'react-i18next'

import LogoLoader from '../../../../../assets/logos/main.webp'
import BasicSpinner from '../../../../../components/elements/loader/basic'

function Raffling() {
  const { t } = useTranslation(['raffleStatus'])

  return (
    <>
      <div className="containerTable Raffling">
        <div className="containerRaffling flex" style={{ flexDirection: 'column' }}>
          {/* <BasicSpinner green /> */}
          <div className="container-ApproveLoadingBuy">
            <img src={LogoLoader} alt="Fmoney" style={{ width: '50%', marginTop: '0px', maxWidth: '120px' }} />
          </div>
          <h5 style={{ color: '#3c6132', fontSize: '20px' }}>{t('raffling')}</h5>
        </div>
      </div>
    </>
  )
}

export default Raffling
