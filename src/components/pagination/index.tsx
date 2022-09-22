import React, { useEffect, useState } from 'react'
import ButtonsArrow from '../Buttons/arrows'
import './index.scss'
import { useTranslation } from 'react-i18next'
function PaginationComponent({ array, perPage, setArray, ButtonCenter }: any) {
  const [page, setPage] = useState(1)
  const [skip, setSkip] = useState(0)
  const { t } = useTranslation(['home'])
  const handleLeft = () => {
    if (page > 1) {
      setPage((val: number) => val - 1)
      setSkip(skip - perPage > 0 ? skip - perPage : 0)
      setArray(cutArray(skip - perPage > 0 ? skip - perPage : 0))
    }
  }
  const handleRight = () => {
    const sum: number = skip + perPage
    if (sum < array?.length) {
      setPage((val: number) => val + 1)
      setSkip(skip + perPage)
      setArray(cutArray(skip + perPage))
    }
  }

  const cutArray = (skip: number) => {
    if (!Array.isArray(array)) return []

    if (array?.length > perPage) {
      return array.slice(skip, skip + perPage)
    } else {
      return array
    }
  }

  useEffect(() => {
    setArray(cutArray(0))
  }, [])

  const Pagination = ({ hide }: any) => {
    const className = `containerPagination ${hide ? 'hidden' : ''}`
    return (
      <div className={className}>
        <h5>{`${t('tableWelcome.table.pages.page')} ${page} ${t('tableWelcome.table.pages.pageOf')} ${Math.ceil(array?.length / perPage) || 1}`}</h5>
        <ButtonsArrow onPress={handleLeft} />
        <ButtonsArrow onPress={handleRight} right />
      </div>
    )
  }

  return (
    <div className="flex-space containerPaginationFlex">
      <Pagination hide />
      {ButtonCenter && ButtonCenter}
      <Pagination />
    </div>
  )
}

export default PaginationComponent
