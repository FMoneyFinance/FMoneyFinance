import { Contract, utils } from 'ethers'
import React, { useState, useEffect, useContext } from 'react'

import Button from '../../../../components/Buttons'
import Copy from '../../../../assets/icons/copy.svg'
import Open from '../../../../assets/icons/open.svg'
import AppContext from '../../../../context/AppContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import LoaderComponent from '../../../../components/elements/loader'
import { getProvider, getWalletConnectProvider } from '../../../../web3/functions/providers'
import fmoneyRaffleManagerContract from '../../../../web3/contracts/interfaces/IFmoneyRaffleManager.json'
import { get_current_raffle_manager_smart_contract_address, update_manager_smart_contract_address } from '../../../../api/tickets-management'
import Popper from '../../../../components/Popper'
import { useTranslation } from 'react-i18next'
import AlertToast from '../../../../components/Alerts'

const contextWin: any = window

function NewAddress() {
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation(['adminTools'])
  const [valueAdmin, setValueAdmin] = useState('')
  const [alertAdmin, setAlertAdmin] = useState(false)
  const [errorManager, setErrorManager] = useState(false)
  const [changeContract, setChangeContract] = useState(false)
  const [loadingNewAdmin, setLoadingNewAdmin] = useState(false)
  const [loadingContract, setLoadingContract] = useState(false)
  const [alertSmartContract, setAlertSmartContract] = useState(false)
  const [currentManagerSmartContract, setCurrentManagerSmartContract] = useState('')

  const context: any = useContext(AppContext)

  useEffect(() => {
    handleGetCurrentRaffleManagerSmartContractAddress()
  }, [])

  const handleGetCurrentRaffleManagerSmartContractAddress = async () => {
    const response: any = await get_current_raffle_manager_smart_contract_address(context)
    setCurrentManagerSmartContract(response.currentRaffleManagerSmartContractAddress)
  }

  const handleCopied = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2500)
  }

  const handleNewAdmin = (value: any) => {
    if (!loadingNewAdmin) {
      setError(false)
      setValueAdmin(value)
    }
  }

  const handleAlertAdmin = () => {
    setAlertAdmin(true)
    setTimeout(() => {
      setAlertAdmin(false)
    }, 3500)
  }

  const handleNewContract = (value: any) => {
    if (!loadingContract) {
      setErrorManager(false)
      setCurrentManagerSmartContract(value)
    }
  }

  const handleAlertSmartContract = () => {
    setAlertSmartContract(true)
    setTimeout(() => {
      setAlertSmartContract(false)
    }, 3500)
  }

  const loaderContract = () => {
    if (loadingContract) {
      return (
        <div className="flex">
          <LoaderComponent xSmall /> <span id="loaderText">{t('newAddress.smartContract.loading')}</span>
        </div>
      )
    }

    if (changeContract) {
      return (
        <div className="ContainerButtons">
          <div className="flex TwoButton">
            <Button
              text={t('newAddress.smartContract.buttonChange')}
              onPress={() => {
                handleUpdateManagerSmartContractAddress(currentManagerSmartContract)
              }}
              applyStyle={{ width: '50%', marginRight: '2%' }}
            />
            <Button
              text={t('newAddress.smartContract.buttonCancel')}
              applyStyle={{ width: '50%', marginLeft: '2%  ' }}
              onPress={() => {
                setChangeContract(false), setErrorManager(false)
              }}
            />
          </div>
          {errorManager && <div style={{ color: 'red', fontWeight: '100', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>The address inserted is not valid</div>}
        </div>
      )
    }

    return (
      <div className="ContainerButtons">
        <Button
          text={t('newAddress.smartContract.buttonChange')}
          onPress={() => {
            setChangeContract(true)
          }}
        />
      </div>
    )
  }

  /* Update MANAGER  */
  const handleUpdateManagerSmartContractAddress = async (managerSmartContractAddress: string) => {
    setErrorManager(false)
    setLoadingContract(true)
    if (!utils.isAddress(managerSmartContractAddress)) {
      setLoadingContract(false)
      setErrorManager(true)
      return
    }

    const payload: object = {
      managerSmartContractAddress
    }

    const response: any = await update_manager_smart_contract_address(payload, context)
    setCurrentManagerSmartContract(response.managerSmartContractAddressSavedData)
    sessionStorage.setItem('currentManagerSmartContract', response.managerSmartContractAddressSavedData)
    context.socketConnection.emit('manager-smart-contract-changed', response.managerSmartContractAddressSavedData)
    console.log('socket emited')
    setChangeContract(false)
    handleAlertSmartContract()
    setLoadingContract(false)
  }

  /* Add new ADMINISTRATORS  */
  const handleAddAdminUser = async () => {
    setLoadingNewAdmin(true)
    setError(false)

    if (!utils.isAddress(valueAdmin)) {
      setError(true)
      setLoadingNewAdmin(false)
      return
    }

    const provider = contextWin.ethereum ? getProvider() : await getWalletConnectProvider()
    const userAccountSigner = provider.getSigner()
    console.log('provider', provider)

    const currentManagerSmartContract: string = sessionStorage.getItem('currentManagerSmartContract') || ''
    const raffleManagerInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, userAccountSigner)
    const currentAdminUsers = await raffleManagerInstance.addAdminUser(valueAdmin)
    handleAlertAdmin()
    setLoadingNewAdmin(false)
  }

  return (
    <>
      {alertAdmin && <AlertToast styles={alertSmartContract && { top: '22%' }} text={`${t('alertsToast.alertAdmin.text')} ${valueAdmin?.substring(0, 8) + '...'}" ${t('alertsToast.alertAdmin.text2')}`} />}
      {alertSmartContract && <AlertToast text={t('alertsToast.alertSmartContract.text')} />}
      <div className="containerNewAddress flex">
        <div className="newAddres">
          <div className="newAddresContainer">
            <h2>{t('newAddress.smartContract.title')}</h2>
            {changeContract ? (
              <input type="text" value={currentManagerSmartContract} className={`outline-${currentManagerSmartContract?.length > 1 && !errorManager} opacity-${loadingContract} error-${errorManager}`} placeholder={t('newAddress.smartContract.placeholder')} onChange={(e) => handleNewContract(e.target.value)} />
            ) : (
              <div className="flex relative containerInput">
                {copied && <Popper text="Copied!" />}
                <CopyToClipboard onCopy={() => handleCopied()} text={!currentManagerSmartContract ? '0x000000000000000000000000000000000000DeAd' : `${currentManagerSmartContract}`}>
                  <p className="Address pointer textEllipsis">{!currentManagerSmartContract ? '0x000000000000000000000000000000000000DeAd' : `${currentManagerSmartContract}`} </p>
                </CopyToClipboard>
                <CopyToClipboard onCopy={() => handleCopied()} text={!currentManagerSmartContract ? '0x000000000000000000000000000000000000DeAd' : `${currentManagerSmartContract}`}>
                  <img className="pointer" src={Copy} alt="Copy" />
                </CopyToClipboard>
                <a href={`${import.meta.env.VITE_ETHERSCAN_PREFIX}address/${!currentManagerSmartContract ? '0x000000000000000000000000000000000000DeAd' : `${currentManagerSmartContract}`}`} target="_blank" rel="noopener noreferrer">
                  <img className="pointer" src={Open} alt="Copy" />
                </a>
              </div>
            )}
            {loaderContract()}
          </div>
        </div>
        <div className="newAddres">
          <div className="newAddresContainer">
            <h2>{t('newAddress.newAdministrator.title')}</h2>
            <div className="containerInput">
              <input type="text" value={valueAdmin} className={`outline-${valueAdmin?.length > 1 && !error} opacity-${loadingNewAdmin} error-${error}`} placeholder={t('newAddress.newAdministrator.placeholder')} onChange={(e) => handleNewAdmin(e.target.value)} />
            </div>
            {loadingNewAdmin ? (
              <div className="flex">
                <LoaderComponent xSmall /> <span id="loaderText">{t('newAddress.newAdministrator.loading')}</span>
              </div>
            ) : (
              <>
                <Button
                  text={t('newAddress.newAdministrator.buttonAdd')}
                  disabled={valueAdmin?.length < 1}
                  onPress={() => {
                    handleAddAdminUser()
                  }}
                />
              </>
            )}
            {error && <div style={{ color: 'red', fontWeight: '100', fontSize: '12px', textAlign: 'left', paddingLeft: '20px', marginTop: '8px' }}>The address inserted is not valid</div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default NewAddress
