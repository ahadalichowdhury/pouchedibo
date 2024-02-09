import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';
import Carsteering from '../assets/images/carImage.jpg';



function StripeForDriver() {
  const [stripe, setStripe] = useState(null);
  const userDetailsString = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetailsString);

  const email = userDetails.email;
  console.log(email);

  useEffect(() => {
    const loadStripe = async () => {
      const stripeModule = await import('@stripe/stripe-js');
      const stripeObject = await stripeModule.loadStripe('pk_test_51OEnDEE7CJNVLFNH7NY5UAy4dvnMbmcQufcniFdAJLq66B1Qy9dZhIOzqsNooORfpUhOGKQEiEhde9fKG0sIrItV00hQp8a0kZ'); // Replace with your actual publishable key
      setStripe(stripeObject);
    };

    loadStripe();
  }, []);

  const handlePaymentClick = async () => {
    try {
      if (!stripe) {
        console.error('Stripe.js has not been loaded.');
        return;
      }

      const response = await axios.post("http://localhost:8000/api/v1/make-instructor", {
        email: email,
      });

      const sessionId = response.data.sessionId;

      // Use the dynamically loaded stripe object
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='become-driver'>
      <div>
      <a href="#" className='car-logo'>
       <img src={Carsteering} alt="carsteering" />
      </a>
      </div>
    
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error eius, nesciunt fugiat beatae soluta ratione consequuntur nisi quam omnis architecto eos quae assumenda fuga, tempore alias est modi, doloremque at.</p>
      
         <button className='btn w-10 float-center btn-primary ' onClick={handlePaymentClick}>Click Here</button> 
      </div>
    
  );
}

export default StripeForDriver;