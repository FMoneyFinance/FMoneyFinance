import React, { Suspense, useContext, useEffect, useState } from 'react'
import FullModal from '../base/full'
import './index.scss'
import AppContext from '../../../context/AppContext'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import Button from '../../Buttons'

const ModalDeleteAdmin = ({ walletAddress, onDelete }: any) => {
  const context: any = useContext(AppContext)

  const { t } = useTranslation(['modalDeleteAdmin'])

  const renderComponent = () => {
    return (
      <>
        <div className="container-modal-delete-admin">
          <p>{t('text1')}</p>
          <h4 className="walletAddress">{walletAddress ? walletAddress : '0x000000000000000000000000000000000000DeAd'}</h4>
          <div>
            <h4>{t('text2')}</h4>
          </div>
          <div className="buttonsContainer">
            <Button text={t('buttonDelete')} onPress={() => onDelete(walletAddress)} />
          </div>
        </div>
      </>
    )
  }

  const closeWallet = () => {
    context.changeContext({ showModal: false })
  }

  return (
    <Suspense fallback="">
      <FullModal
        showModal={true}
        config={{
          title: t('title'),
          buttonTxt: t('buttonCancel'),
          onPressButton: closeWallet,
          width: isMobile ? '90%' : '25%',
          height: '60%',
          classButton: 'buttonModalDeleteAdmin',
          setShowModal: () => {
            context.changeContext({ showModal: null })
          }
        }}
      >
        {renderComponent()}
      </FullModal>
    </Suspense>
  )
}

export default ModalDeleteAdmin
