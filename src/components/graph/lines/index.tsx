import { Area, Axis, Chart, Geom, Line, LineAdvance, Tooltip } from 'bizcharts'
import React, { useState, useEffect, useMemo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import './index.scss'
import AllEqualsGraphLine from './allEquals'
import AppContext from '../../../context/AppContext'
import LogoLoader from '../../../assets/logos/main.webp'
import { useInterval } from '../../../hooks/useInterval'
import { timeStampToString } from '../../../utils/formater/date'
import { raffleGraphReferencesToGraphDate } from '../../../utils/graph'
import { get_graphs_references_info } from '../../../api/users-management'

const label = {
  offset: -10,
  rotate: 0,
  formatter(text: any, item: any, index: any) {
    const arr = text.split(' ')
    return `${arr[0]}`
  }
}

function GraphLines({ config, keyValue, raffleSelected, handleRemoveGraphLoader }: { keyValue: string; config: any; raffleSelected: any; handleRemoveGraphLoader: any }) {
  const params = useParams()
  const context: any = useContext(AppContext)
  const { t } = useTranslation(['ticket-details'])
  const [priceSelected, setPriceSelected] = useState(0)
  const [dateSelected, setDateSelected] = useState('')
  const [allEqueals, setAllEqueals] = useState(false)
  const [currentScale, setCurrentScale] = useState({
    prize: {
      type: 'linear',
      min: 0,
      max: 20
    }
  })
  const [dataLoaded, setDataLoaded] = useState(false)
  const [graphData, setGraphData] = useState<Array<any>>([])
  const [indexDateSelected, setIndexDateSelected] = useState(1)
  const [loadingGraphData, setLoadingGraphData] = useState(false)
  const [dataToRender, setDataToRender] = useState<Array<any>>([])
  const [selectedRaffleSmartContract, setSelectedRaffleSmartContract] = useState<any>()

  const width = window.innerWidth
  const height = window.innerHeight
  const widthgraph = config?.width || width * 0.6
  const raffling = raffleSelected?.raffleStatus == 'raffling'

  useInterval(() => {
    handleGetGraphsReferencesInfo(selectedRaffleSmartContract)
  }, 60000)

  useEffect(() => {
    handleGetGraphsReferencesInitialInfo(params?.raffleSmartContractAddress)
    setSelectedRaffleSmartContract(params?.raffleSmartContractAddress)

    context.socketConnection.on('graph-price-changed-response', (raffleSmartContractAddress: any) => {
      setSelectedRaffleSmartContract((currentSelectedRaffleSmartContract: any) => {
        if (String(raffleSmartContractAddress).toLowerCase() === String(currentSelectedRaffleSmartContract).toLowerCase()) {
          handleGetGraphsReferencesInfo(raffleSmartContractAddress)
        }

        return currentSelectedRaffleSmartContract
      })
    })

    return () => {
      context.socketConnection.off('graph-price-changed-response')
    }
  }, [])

  useEffect(() => {
    setSelectedRaffleSmartContract(params?.raffleSmartContractAddress)
  }, [params?.raffleSmartContractAddress])

  useEffect(() => {
    if (graphData.length > 0) {
      setDataToRender(graphData)
      setPriceSelected(graphData[graphData.length - 1].prize)
      setDateSelected(timeStampToString(graphData[graphData.length - 1].timestamp, 1))
      checkIfAllAreEquals(indexDateSelected)

      if (dataLoaded) handleRemoveGraphLoader(true)
    }
  }, [graphData])

  const handleGetGraphsReferencesInitialInfo = async (raffleSmartContractAddress: any) => {
    const response: any = await get_graphs_references_info(raffleSmartContractAddress)
    sessionStorage.setItem(`graphReferences-${raffleSmartContractAddress}`, JSON.stringify({ raffleGraphReferencesLastHour: response.raffleGraphReferencesLastHour, raffleGraphReferencesByHour: response.raffleGraphReferencesByHour }))
    handleSetGraphReferences({ raffleGraphReferences: response.raffleGraphReferencesLastHour })
    if (!dataLoaded) setDataLoaded(true)
  }

  const handleGetGraphsReferencesInfo = async (raffleSmartContractAddress: any) => {
    const response: any = await get_graphs_references_info(raffleSmartContractAddress)
    setIndexDateSelected((currentIndexDateSelected: any) => {
      sessionStorage.setItem(`graphReferences-${raffleSmartContractAddress}`, JSON.stringify({ raffleGraphReferencesLastHour: response.raffleGraphReferencesLastHour, raffleGraphReferencesByHour: response.raffleGraphReferencesByHour }))

      const raffleGraphReferences = currentIndexDateSelected === 1 ? { raffleGraphReferences: response.raffleGraphReferencesLastHour } : { raffleGraphReferences: response.raffleGraphReferencesByHour }
      handleSetGraphReferences(raffleGraphReferences)

      return currentIndexDateSelected
    })
  }

  const handleSetGraphReferences = (raffleGraphReferencesInfo: any) => {
    const data = raffleGraphReferencesToGraphDate(raffleGraphReferencesInfo.raffleGraphReferences)
    setGraphData(data)
  }

  const handleChangeToolTip = (e: any) => {
    const values = e.data.items[0] || {}
    setPriceSelected(Math.round(values.data.prize) || 0)
    setDateSelected(timeStampToString(values.data.timestamp, 1))
  }

  const ItemDate = ({ txt, index }: any) => {
    const handleChangeTemporally = () => {
      setIndexDateSelected(index)
      checkIfAllAreEquals(index)
    }

    return (
      <div className={indexDateSelected == index ? 'active' : 'inactive'} onClick={handleChangeTemporally}>
        {txt}
      </div>
    )
  }

  const checkIfAllAreEquals = (indexDateSelected: number) => {
    let dataToRender = []
    const localGraphReferences = JSON.parse(sessionStorage.getItem(`graphReferences-${params?.raffleSmartContractAddress}`) || '{}')
    console.log('indexDateSelected', indexDateSelected)

    if (indexDateSelected === 1) {
      dataToRender = raffleGraphReferencesToGraphDate(localGraphReferences.raffleGraphReferencesLastHour)

      if (dataToRender.length < 60) {
        const quantityOfValuesToAdd = 60 - dataToRender.length
      }
    } else {
      dataToRender = raffleGraphReferencesToGraphDate(localGraphReferences.raffleGraphReferencesByHour)
      console.log('dataToRender.length', dataToRender.length, indexDateSelected)
      if (dataToRender.length > indexDateSelected) {
        dataToRender = dataToRender.slice(dataToRender.length - indexDateSelected, dataToRender.length)
      }
    }

    const values: any = []

    setDataToRender(dataToRender)
    dataToRender.map((graphReference: any) => {
      values.push(graphReference[keyValue])
    })

    if (values.length == 0 || values.every((val: number) => val === 0)) {
      const graphScaleUpdated = { ...currentScale }
      graphScaleUpdated.prize.min = -10
      graphScaleUpdated.prize.max = 10
      setCurrentScale(graphScaleUpdated)
      return
    }

    if (values.every((val: number) => val === values[0] && val > 0)) {
      const graphScaleUpdated = { ...currentScale }
      graphScaleUpdated.prize.min = 0
      graphScaleUpdated.prize.max = values[0] * 2
      setCurrentScale(graphScaleUpdated)
      return
    }

    const max = Math.max(...values)
    const maxIndex = values.indexOf(max)
    const maxValue = values[maxIndex]

    const min = Math.min(...values)
    const minIndex = values.indexOf(min)
    const minValue = values[minIndex]

    const graphScaleUpdated = { ...currentScale }
    graphScaleUpdated.prize.min = minValue > 0 ? minValue - minValue / 4 : 0
    graphScaleUpdated.prize.max = maxValue
    setCurrentScale(graphScaleUpdated)
  }

  const renderGraph = () => {
    return (
      <div className="graphComponent">
        {loadingGraphData && (
          <div className="graphLoader">
            <div className="container-ApproveLoadingBuy">
              <img src={LogoLoader} alt="Fmoney" style={{ width: '50%', maxWidth: '120px', marginTop: '0px' }} />
            </div>
            <div>{t('loadingGraphData')}</div>
          </div>
        )}
        <div className="indicators">
          <div className="left">
            <h2>${priceSelected}</h2>
            <h5>{dateSelected}</h5>
          </div>
          <div className="flex right">
            <ItemDate index={1} txt="1 H" />
            <ItemDate index={6} txt="6 H" />
            <ItemDate index={12} txt="12 H" />
            <ItemDate index={24} txt="24 H" />
          </div>
        </div>
        <div className="dividor"></div>
        {allEqueals && <AllEqualsGraphLine />}
        <Chart scale={currentScale} padding={config?.padding || [0, width * -0, 0, width * -0]} autoFit height={300} width={widthgraph} data={dataToRender}>
          <LineAdvance shape="smooth" point={false} area position="date*prize" color={raffling ? 'rgba(213, 213, 234, 0.7)' : 'rgba(98, 154, 72, 0.14)'}>
            <Area shape="smooth" position="date*prize" color="l (270) 0:rgba(98, 154, 72, 0.05)  1:rgba(98, 154, 72, 0.14)" />
          </LineAdvance>
          <Tooltip
            onChange={handleChangeToolTip}
            visible={true}
            showCrosshairs
            showContent={false}
            showMarkers={false}
            domStyles={{
              'g2-tooltip': {
                'background-color': 'red',
                'g2-tooltip': 'red',
                'g2-tooltip-title': 'red',
                'g2-tooltip-list': 'red',
                'g2-tooltip-list-item': 'red',
                'g2-tooltip-marker': 'red',
                'g2-tooltip-value': 'red',
                'g2-tooltip-name': 'red'
              }
            }}
            crosshairs={{
              line: {
                style: {
                  stroke: '#629a48',
                  fillOpacity: 1
                }
              }
            }}
          />
          <Axis name="prize" visible={true} label={label} grid={{ line: { style: { lineWidth: 0.3 } } }} />
          <Axis name="date" visible={false} />
        </Chart>
      </div>
    )
  }

  const memoRenderGraph = useMemo(renderGraph, [dataToRender, indexDateSelected, graphData, dateSelected, allEqueals, priceSelected])

  return memoRenderGraph
}

export default GraphLines
