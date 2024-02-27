import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function PaymentSuccessPage() {
  const navigate = useNavigate();
    const handleGoHome = () => {
        navigate("/");
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
