import React from 'react'
import SocialMediaList from '../../../components/socialMedia/socialMediaList'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'

function PartnersPart() {
  const Item = () => {
    return <div className="containerItem"></div>
  }

  const { t } = useTranslation(['home'])
  return (
    <div className="maxWidth PartnersPart">
      <h4>{t('partners.title')}</h4>
      <h2>{t('partners.description')}</h2>
      <div id="partners-slider" className="containerItems">
        <Swiper slidesPerView={window.screen.width > 700 ? 4 : 1.5}>
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
        </Swiper>
      </div>

      <div className="flex">
        <SocialMediaList />
      </div>
    </div>
  )
}

export default PartnersPart
