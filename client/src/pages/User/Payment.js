import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/user/Payment.css';
import Loader from '../../components/common/Loader';
import { useParams } from 'react-router-dom';

function Payment() {
  const { id }= useParams();
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutAmount, setCheckoutAmount] = useState(null);

  const [billingDetails, setBillingDetails] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    csv: '',
    paymentProof: null,
  });

  // Fetch checkout amount on component mount
  useEffect(() => {
    async function fetchCheckoutAmount() {
      try {
        const response = await axios.get(`http://localhost:5000/checkout/${id}`, {withCredentials: true}); // Replace with your API endpoint
        console.log(response.data);
        setCheckoutAmount(response.data.amount);
      } catch (error) {
        console.error('Error fetching checkout amount:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCheckoutAmount();
  }, []);

  const handleBillingChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    if (e.target.name === 'paymentProof') {
      setPaymentDetails({
        ...paymentDetails,
        paymentProof: e.target.files[0],
      });
    } else {
      setPaymentDetails({
        ...paymentDetails,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData();
        formData.append('fullName', billingDetails.fullName);
        formData.append('address', billingDetails.address);
        formData.append('phoneNumber', billingDetails.phoneNumber);
        formData.append('email', billingDetails.email);
        formData.append('paymentMethod', paymentMethod);

        if (paymentMethod === 'Online Payment') {
            formData.append('cardNumber', paymentDetails.cardNumber);
            formData.append('cardHolder', paymentDetails.cardHolder);
            formData.append('expiryDate', paymentDetails.expiryDate);
            formData.append('csv', paymentDetails.csv);
        } else {
            formData.append('paymentProof', paymentDetails.paymentProof);
        }

        const response = await axios.post(`http://localhost:5000/checkout/pay/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });

      alert('Payment Successful!');
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f4f8',
          zIndex: 9999,
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="billing-container">
      <div className="billing-details ms-5 mt-5 mb-5">
        <h3>
          <span className="icon">▣</span> Billing Details
        </h3>
        <form>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={billingDetails.fullName}
            onChange={handleBillingChange}
            placeholder="Enter your full name"
          />

          <label>Address</label>
          <textarea
            name="address"
            value={billingDetails.address}
            onChange={handleBillingChange}
            placeholder="Enter your address"
          ></textarea>

          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={billingDetails.phoneNumber}
            onChange={handleBillingChange}
            placeholder="Enter your phone number"
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={billingDetails.email}
            onChange={handleBillingChange}
            placeholder="Enter your email address"
          />
        </form>
      </div>

      <div className="payment-details me-5 mt-5 mb-5">
        <div className="subtotal">
          <h5>
            <b>Sub Total:</b>
          </h5>
          <strong>Rs. {checkoutAmount ? checkoutAmount : '0.00'}</strong>
        </div>

        <div className="payment-methods">
          <label>Payment Methods</label>
          <div>
            <label>
              <input
                type="radio"
                value="Online Payment"
                checked={paymentMethod === 'Online Payment'}
                onChange={handlePaymentMethodChange}
              />
              Online Payment
            </label>
            <label>
              <input
                type="radio"
                value="Bank Deposit"
                checked={paymentMethod === 'Bank Deposit'}
                onChange={handlePaymentMethodChange}
              />
              Bank Deposit
            </label>
          </div>
        </div>

        {paymentMethod === 'Online Payment' ? (
          <div className="card-details">
            <form onSubmit={handleSubmit}>
              <label>Card Number:</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentChange}
                placeholder="Enter card number"
              />

              <label>Card Holder's Name:</label>
              <input
                type="text"
                name="cardHolder"
                value={paymentDetails.cardHolder}
                onChange={handlePaymentChange}
                placeholder="Enter card holder's name"
              />

              <label>Card Valid Date:</label>
              <input
                type="text"
                name="expiryDate"
                value={paymentDetails.expiryDate}
                onChange={handlePaymentChange}
                placeholder="MM/YY"
              />

              <label>CSV:</label>
              <input
                type="text"
                name="csv"
                value={paymentDetails.csv}
                onChange={handlePaymentChange}
                placeholder="CSV"
              />

              <button type="submit" className="pay-btn">
                Pay Now
              </button>
            </form>
          </div>
        ) : (
          <div className="file-upload">
            <form onSubmit={handleSubmit}>
              <label>Upload Payment Proof:</label>
              <input
                type="file"
                name="paymentProof"
                onChange={handlePaymentChange}
              />

              <button className="btn1 btn-outline mt-3" type="submit">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
