import React, { useState, useEffect, useRef, useContext, Suspense } from 'react'
import { Contract, utils } from 'ethers'
import threeDots from '../../../../assets/icons/threeDots.svg'
import { getProvider, getWalletConnectProvider } from '../../../../web3/functions/providers'
import fmoneyRaffleManagerContract from '../../../../web3/contracts/interfaces/IFmoneyRaffleManager.json'
import { useTranslation } from 'react-i18next'
import CopyAndOpen from '../../../../components/Buttons/copyAndOpen'
import Popper from '../../../../components/Popper'
import PaginationComponent from '../../../../components/pagination'
import AppContext from '../../../../context/AppContext'
import LoaderComponent from '../../../../components/elements/loader'
import ModalDeleteAdmin from '../../../../components/modals/deleteAdmin'
const contextWin: any = window

function AdminList() {
  const context: any = useContext(AppContext)
  const { state, changeContext } = context
  const { t } = useTranslation(['adminTools'])

  const [adminUsers, setAdminUsers] = useState([])

  useEffect(() => {
    handleGetCurrentAdminUsers()
  }, [])

  const handleOpenModalDelete = (address: any) => {
    console.log(address)

    changeContext({
      showModal: (
        <Suspense fallback={<LoaderComponent />}>
          <ModalDeleteAdmin walletAddress={address} onDelete={handleDeleteAdminUser} />
        </Suspense>
      )
    })
  }

  const handleGetCurrentAdminUsers = async () => {
    const provider = contextWin.ethereum ? getProvider() : await getWalletConnectProvider()
    const userAccountSigner = provider.getSigner()
    const currentManagerSmartContract: string = sessionStorage.getItem('currentManagerSmartContract') || ''
    const raffleManagerInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, userAccountSigner)
    const currentAdminUsers = await raffleManagerInstance.getCurrentAdminUsers()
    setAdminUsers(currentAdminUsers)
  }

  const handleDeleteAdminUser = async (adminUserToRemove: string) => {
    if (!utils.isAddress(adminUserToRemove)) {
      console.log('The address is not valid')
      return
    }

    const provider = contextWin.ethereum ? getProvider() : await getWalletConnectProvider()
    const userAccountSigner = provider.getSigner()
    const currentManagerSmartContract: string = sessionStorage.getItem('currentManagerSmartContract') || ''
    const raffleManagerInstance = new Contract(currentManagerSmartContract, fmoneyRaffleManagerContract.abi, userAccountSigner)

    const adminUserDeleted = await raffleManagerInstance.removeAdminUser(adminUserToRemove)
    changeContext({
      showModal: null
    })
  }

  const Item = ({ address, date, owner, options }: any) => {
    let optionsRef: any = useRef()
    const [active, setActive] = useState(false)
    const [copy, setCopy] = useState(false)
    useEffect(() => {
      let handler = (event: any) => {
        if (optionsRef.current && !optionsRef.current.contains(event?.target)) {
          setActive(false)
        }
      }
      document.addEventListener('mousedown', handler)

      return () => {
        document.removeEventListener('mousedown', handler)
      }
    }, [])

    const selectDelete = () => {
      if (address?.toLowerCase() === owner?.toLowerCase()) {
        return (
          <div className="OwnerAddres">
            <span>{t('adminList.owner')}</span>
          </div>
        )
      }
      if (active) {
        return (
          <div ref={optionsRef} className="DropDownOptions pointer" onClick={() => handleOpenModalDelete(address)}>
            <span>{t('adminList.deleteAdmin')}</span>
          </div>
        )
      }
      return (
        <div className={`AdminThreeDots pointer active-${active}`} onClick={() => setActive(!active)}>
          <img ref={optionsRef} src={threeDots} alt="options" />
        </div>
      )
    }

    return (
      <div className="ContainerItemsTable">
        <div className="flex">
          {copy && <Popper text={t('popper.text')} />}
          <CopyAndOpen walletAddress={address} handleCopy={setCopy} />
        </div>
        <div className="AdminDate">
          <h5>{date}</h5>
        </div>
        <div></div>

        {selectDelete()}
      </div>
    )
  }

  return (
    <div className="ContainerAdminList relative">
      <div className="ContainerTitles flex">
        <h2>{t('adminList.titles.adminAddress')}</h2>
        <h2 id="textAdded"> {t('adminList.titles.added')}</h2>
        <span></span>
      </div>
      <div className="ContainerBodyTable  textEllipsis">
        {adminUsers?.map((data, idx) => (
          <Item address={data} date="July 22, 2022" key={idx} owner={context?.state?.walletAddress} />
        ))}
        <PaginationComponent array={adminUsers} setArray={setAdminUsers} perPage={10} />
      </div>
    </div>
  )
}

export default AdminList
