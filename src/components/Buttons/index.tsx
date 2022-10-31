import React from 'react'
import BasicSpinner from '../elements/loader/basic'
import './styles.scss'

function Button({ style, text, className, onPress, secondary, loading, outlined, disabled, hidden, applyStyle }: any) {
  return (
    <div
      className={`button ${className} hidden-${hidden} secondary-button-${secondary} rounder-true button-loading-${loading} button-disabled-${disabled} button-outlined-${outlined}`}
      onClick={(e) => {
        if (!disabled && !loading) {
          onPress(e)
        }
      }}
      style={applyStyle ? applyStyle : {}}
    >
      {loading ? <BasicSpinner /> : <span>{text}</span>}
    </div>
  )
}

export default Button
