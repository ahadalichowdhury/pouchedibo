import React from 'react'
import Home from '../Components/Home'
import Header from '../Components/Header'

function HomePage() {
  return (
    <div>
      <Header >
        <div className='ms-4'>
        <Home />
        </div>
        </Header>
    </div>
  )
}

export default HomePage