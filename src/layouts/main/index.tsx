import React from 'react'
import NavBar from '../../components/NavBar'
import './styles.scss'

function MainLayout({ hideConnect, children, tikcketDetails, ...other }: any) {
  return (
    <div className="container">
      <NavBar tikcketDetails={tikcketDetails} hideConnect={hideConnect} />

      {children}
    </div>
  )
}

export default MainLayout
