import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import './styles.scss'

function DropDown({ setOpenDrop }: any) {
  const { i18n } = useTranslation()

  const changeLanguageES = () => {
    i18n.changeLanguage('es')
    setOpenDrop(false)
  }
  const changeLanguageEN = () => {
    i18n.changeLanguage('en')
    setOpenDrop(false)
  }

  let menuRef: any = useRef()

  useEffect(() => {
    let handler = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event?.target)) {
        setOpenDrop(false)
      }
    }
    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  return (
    <>
      <div ref={menuRef} className="containerDropDown">
        <div onClick={changeLanguageEN}>
          <p>{i18n.language === 'en' ? <strong>English (EN)</strong> : 'English (EN)'}</p>
        </div>
        <div onClick={changeLanguageES}>
          <p>{i18n.language === 'es' ? <strong>Español (ES)</strong> : 'Español (ES)'}</p>
        </div>
      </div>
    </>
  )
}

export default DropDown
