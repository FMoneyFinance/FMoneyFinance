import React, { useState, useEffect, useRef } from 'react'

import './styles.scss'
import ChevronDown from '../../../../assets/icons/chevron-down.svg'

function InputSelect({ config }: any) {
  const dropDownRef: any = useRef()
  const [openOptions, setOpenOptiosn] = useState(false)

  useEffect(() => {
    let handler = (event: any) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event?.target)) {
        setOpenOptiosn(false)
      }
    }
    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  const handleClick = (option: any) => {
    config.onChange(option)
  }

  const Menu = () => {
    const Item = ({ option }: any) => {
      return <p onClick={() => handleClick(option)}>{option}</p>
    }

    return (
      <div ref={dropDownRef} className="container-menu-options">
        {config?.options?.length > 15
          ? config?.options.slice(0, config.daysInMonth ? config?.daysInMonth + 1 : config?.options?.length).map((option: any, idx: number) => {
              return <Item option={option} key={idx} />
            })
          : config?.options.map((option: any, idx: number) => {
              return <Item option={option} key={idx} />
            })}
      </div>
    )
  }

  return (
    <>
      <div className="container-selector pointer" onClick={() => setOpenOptiosn(!openOptions)}>
        <p className="input">{config?.placeholder || config.options[0]}</p>
        {config?.suffixTxt && <span className="suffixTxt">{config?.suffixTxt}ddd</span>}
        {config?.suffix ? config.suffix : <img className="ChevronDown" src={ChevronDown} />}
        {openOptions && <Menu />}
      </div>
    </>
  )
}

export default InputSelect
