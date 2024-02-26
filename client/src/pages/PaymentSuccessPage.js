import React from 'react';
import { Button } from 'react-bootstrap';

function PaymentSuccessPage() {
    const handleGoHome = () => {
        window.location.href = "/"
      };
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1>Payment is successful</h1>
        <Button className='mt-5' onClick={handleGoHome}>Go to Home</Button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Use 100vh for full viewport height
  },
  content: {
    textAlign: 'center',
  },
};

export default PaymentSuccessPage;
