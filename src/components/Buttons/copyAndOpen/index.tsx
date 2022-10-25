import React from 'react'
import './styles.scss'
import Copy from '../../../assets/icons/copy.svg'
import Open from '../../../assets/icons/open.svg'
import CopyToClipboard from 'react-copy-to-clipboard'

function CopyAndOpen({ handleCopy, walletAddress, milisecons }: any) {
  const copyFunction = () => {
    handleCopy(true)
    timeOut
  }
  const timeOut = setTimeout(() => {
    handleCopy(false)
  }, milisecons || 2500)

  return (
    <div className="containerCopyAndOpen flex">
      <CopyToClipboard text={walletAddress} onCopy={copyFunction}>
        <div className="containerTextAddress ">
          <h5 className=" flex textEllipsis pointer">{walletAddress}</h5>
        </div>
      </CopyToClipboard>
      <CopyToClipboard text={walletAddress} onCopy={copyFunction}>
        <img src={Copy} className="pointer" />
      </CopyToClipboard>
      <a href={import.meta.env.VITE_ETHERSCAN_PREFIX + 'address/' + walletAddress} target="_blank" rel="noopener noreferrer">
        <img src={Open} className="pointer" />
      </a>
    </div>
  )
}

export default CopyAndOpen
