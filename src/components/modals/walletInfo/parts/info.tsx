import React, { Suspense, useEffect, useState } from 'react'
import { useContext } from 'react'
import AppContext from '../../../../context/AppContext'
import '../index.scss'
import Copy from '../../../../assets/icons/copy.svg'
import Open from '../../../../assets/icons/open.svg'
import { handleGetBalances } from '../../../../web3/functions/accounts'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import LoaderComponent from '../../../elements/loader'
import Popper from '../../../Popper'
import { useTranslation } from 'react-i18next'
import LogoLoader from '../../../../assets/logos/main.webp'
import Button from '../../../Buttons'

function ModalInfoWalletContent({ setIndex }: any) {
  const { t } = useTranslation(['modalWalletInfo'])
  const context: any = useContext(AppContext)
  const [balances, setBalances] = useState<{
    usdc: number
    fmon: number
    eth: number
  }>()

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const getBalances = async () => {
    setLoading(true)
    const response: any = await handleGetBalances(context)
    console.log('handleGetBalances', response)

    setBalances(response)
    setLoading(false)
  }

  const timeOut = setTimeout(() => {
    setCopied(false)
  }, 3500)

  const handleCopy = () => {
    setCopied(true)
    timeOut
  }

  useEffect(() => {
    getBalances()
  }, [])

  return (
    <Suspense fallback="">
      <div className="container-modal-wallet-info" style={{ position: 'relative' }}>
        <Header />
        {loading ? <Loader /> : <Balances />}
      </div>
      <div className="ModalInfo_ContainerButton" style={{ width: '90%', position: 'relative', left: '0px', right: '0px', marginBottom: '20px' }}>
        <Button applyStyle={{ padding: '20px', boxSizing: 'border-box' }} onPress={() => setIndex(1)} text={t('buttons.buttonSelectDefault')} />
      </div>
    </Suspense>
  )

  function Loader() {
    return (
      <Suspense fallback="">
        <div className="container-load">
          <img src={LogoLoader} alt="Fmoney" />
        </div>
      </Suspense>
    )
  }

  function Header() {
    return (
      <Suspense fallback="">
        {copied && <Popper text={t('popper')} walletModal />}
        <div className="header">
          <h3>{t('yourAddress')}</h3>
          <h5>
            <CopyToClipboard text={context.state.walletAddress} onCopy={handleCopy}>
              <span className="pointer textEllipsis">{context?.state?.walletAddress}</span>
            </CopyToClipboard>
            <div className="flex">
              <CopyToClipboard text={context.state.walletAddress} onCopy={handleCopy}>
                <img src={Copy} className="pointer" />
              </CopyToClipboard>
              <a href={import.meta.env.VITE_ETHERSCAN_PREFIX + 'address/' + context.state.walletAddress} target="_blank" rel="noopener noreferrer">
                <img src={Open} className="pointer" />
              </a>
            </div>
          </h5>
        </div>
      </Suspense>
    )
  }

  function Balances() {
    const Item = ({ title, value }: any) => {
      return (
        <Suspense fallback="">
          <div className="flex-space itemBalance">
            <span className="title">{title}</span>
            <span className="value">{value}</span>
          </div>
        </Suspense>
      )
    }

    return (
      <Suspense fallback="">
        <div className="containerItemsBalance">
          <Item title={t('containerItemsBalance.ETH')} value={balances?.eth} />
          <Item title={t('containerItemsBalance.USDC')} value={balances?.usdc} />
          <Item title={t('containerItemsBalance.FMON')} value={balances?.fmon} />
        </div>
      </Suspense>
    )
  }
}

export default ModalInfoWalletContent
