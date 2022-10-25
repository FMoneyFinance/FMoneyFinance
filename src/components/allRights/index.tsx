import './styles.scss'
import { useTranslation } from 'react-i18next'
function AllRights() {
  const { t } = useTranslation(['home'])
  return (
    <div className="containerAllRights">
      <h2>Fmoney | {t('allRightsReserved.text')} ©</h2>
    </div>
  )
}

export default AllRights
