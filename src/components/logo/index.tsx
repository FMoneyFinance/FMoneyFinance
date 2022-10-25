import React from 'react'
import { Link } from 'react-router-dom'
import LogoMin from '../../assets/logos/main.webp'
import './styles.scss'

function Logo({ hideLabel, hideLink }: any) {
  const Content = () => {
    return (
      <div className="ContainerLogo">
        <img src={LogoMin} />
        {!hideLabel && <span>Money</span>}
      </div>
    )
  }

  return hideLink ? (
    <Content />
  ) : (
    <Link to="/">
      <Content />
    </Link>
  )
}

export default Logo
