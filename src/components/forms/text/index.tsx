import React, { useMemo, useRef } from 'react'
import './styles.scss'

function InputText({ config, controller, value, error }: any) {
  const Input = () => {
    return (
      <input
        className="input"
        placeholder={config?.placeholder || '50'}
        defaultValue={value}
        onChange={(e: any) => {
          controller(e.target.value)
          if (config?.onChange) {
            config?.onChange(e.target.value)
          }
        }}
        onMouseLeave={() => {}}
        onBlur={(e) => controller(e.target.value)}
      />
    )
  }

  return (
    <>
      <div className="container-input" key={config?.suffixTxt}>
        <Input />
        {config?.suffixTxt && <span className="suffixTxt">{config?.suffixTxt}</span>}
        {config?.suffix && config.suffix}
      </div>
      {config?.error && <h5 className="error-input">{config.error}</h5>}
    </>
  )
}

export default InputText
