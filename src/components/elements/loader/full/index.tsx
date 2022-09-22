import React from 'react'
import Logo from '../../../logo'
import { useTranslation } from 'react-i18next'

function ExpandedLoader({ applyStyle, text }: any) {
  const { t } = useTranslation(['ticket-details'])
  return (
    <div style={applyStyle ? applyStyle : {}} className="loading-container-expanded shine">
      <h3>{text}</h3>
      <h5>{t('raffleSpots.loading.text')}</h5>
    </div>
  )
}

export default ExpandedLoader
