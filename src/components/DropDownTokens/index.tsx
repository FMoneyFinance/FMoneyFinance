import React, { useEffect, useRef, useContext, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../context/AppContext'
import './styles.scss'
import Exit from '../../assets/icons/exit.svg'
import ModalWalletInfo from '../modals/walletInfo'
import { disconnectWallet } from '../../web3/functions/accounts'
import { allowed_tokens_api } from '../../api/users-management'

function DropDownTokens({ setDropOptions, setToken }: any) {
  const { t } = useTranslation(['connectWallet'])
  const context: any = useContext(AppContext)
  const { state, changeContext } = context
  const [loading, setLoading] = useState(false)
  const [allowedTokens, setAllowedTokens] = useState([])
  const WindowContext: any = window
  let menuRef: any = useRef()

  useEffect(() => {
    let handler = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event?.target)) {
        setDropOptions(false)
      }
    }
    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  const getAllowedTokens = async () => {
    if (context?.state?.walletAddress?.length > 10 && context?.state?.userAccountSignature) {
      setLoading(true)

      if (sessionStorage.getItem('allowedTokensToTrade')) {
        setLoading(false)
        return setAllowedTokens(JSON.parse(sessionStorage.getItem('allowedTokensToTrade') || '[]'))
      }

      setLoading(false)
      return setAllowedTokens([])
    }
    setLoading(false)

    return null
  }

  useEffect((): any => {
    getAllowedTokens()
  }, [])

  const handleSetToken = (value: any) => {
    setToken(value)
    setDropOptions(false)
  }

  return (
    <>
      <div ref={menuRef} className="containerDropDownTokens">
        {allowedTokens?.map((token: any, index: number) => (
          <div key={index} className="pointer" onClick={() => handleSetToken(token)}>
            <p>{`${token?.tokenSymbol} (${token?.tokenName})`}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default DropDownTokens
