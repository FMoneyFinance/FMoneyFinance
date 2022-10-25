import React, { Suspense } from 'react'
import { isMobile } from 'react-device-detect'

import './index.scss'
import BaseModal from './index'

export default function FullModal({ showModal, children, config }: any) {
  config.styles = {
    ...config?.styles,
    position: 'relative',
    right: 'inherit',
    top: 'inherit',
    maxHeight: '88vh',
    width: isMobile && '90%'
  }

  return (
    <Suspense fallback="">
      <div className="fullModalContainer">
        <BaseModal {...{ showModal, children, config }} />
      </div>
    </Suspense>
  )
}
