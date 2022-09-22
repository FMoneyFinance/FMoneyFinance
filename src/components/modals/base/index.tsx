import React, { Suspense } from 'react'
import './index.scss'
import Close from '../../../assets/icons/close.svg'
import Divider from '../../elements/divider'
import Button from '../../Buttons'

function BaseModal({ showModal, children, config }: any) {
  const styleActive = {
    opacity: showModal ? 1 : 0,
    minWidth: showModal ? config?.width || '25%' : 0,
    zIndex: showModal ? config?.zIndex || 1 : -5000
  }

  const Header = () => {
    return (
      <div className="header">
        <h4 id="titleHeader">
          <img className="hidden" src={Close} /> {config?.title} <img src={Close} onClick={() => config?.setShowModal(false)} />
        </h4>
        <Divider config={{ width: '90%' }} />
      </div>
    )
  }

  return (
    <Suspense fallback="">
      <div className="containerModal" style={{ ...styleActive, ...config?.offset, ...config?.styles }}>
        {config?.hideElements != true && <Header />}
        {children}
        {config?.hideElements != true && (
          <div className="containerButtonModal">
            {config?.footer && config?.footer()}
            {config?.hideButton != true && <Button text={config?.buttonTxt} disabled={config?.disableButton} loading={config?.loadingButton} onPress={config?.onPressButton} className={'buttonModalFooter ' + config?.classButton} />}
          </div>
        )}
      </div>
    </Suspense>
  )
}

export default BaseModal
