import React from 'react'
import Header from '../Components/Header'
import StripeForDriver from '../Components/StripeForDriver'

function BecomeDriverPage() {
  return (
    <div>
      <Header >
        <div className='ms-4'>
        <StripeForDriver />
        </div>
        </Header>
    </div>
  )
}

export default BecomeDriverPage