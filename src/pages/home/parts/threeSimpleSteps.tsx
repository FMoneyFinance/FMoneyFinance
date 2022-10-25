import React from 'react'
import { useTranslation } from 'react-i18next'

import { isMobile } from 'react-device-detect'
import Ilustration from '../../../assets/ilustrations/landingpage/ticketanddivider.svg'
import IlustrationMobile from '../../../assets/ilustrations/landingpage/ticketanddividerMobile.svg'

function ThreeSimpleSteps() {
  const { t, i18n } = useTranslation(['home'])
  const Item = ({ title, description, icon }: any) => {
    return (
      <div className="containerItem">
        <div className="icon">{icon}</div>
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    )
  }

  return (
    <div className="maxWidth ThreeSimpleSteps">
      <h4>{t('threeSimpleSteps.title')}</h4>
      <h2>{t('threeSimpleSteps.subtitle')}</h2>
      <div className="containerItems">
        <Item title={t('threeSimpleSteps.1.title')} description={t('threeSimpleSteps.1.description')} icon="1" />
        <Item title={t('threeSimpleSteps.2.title')} description={t('threeSimpleSteps.2.description')} icon="2" />
        <Item title={t('threeSimpleSteps.3.title')} description={t('threeSimpleSteps.3.description')} icon="3" />
      </div>

      <img src={isMobile ? IlustrationMobile : Ilustration} />
    </div>
  )
}

export default ThreeSimpleSteps
