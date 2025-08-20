import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/user/Payment.css';
import Loader from '../../../components/common/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Checkout() {
  const { id } = useParams();
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutAmount, setCheckoutAmount] = useState(null);
  const navigate = useNavigate();

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

  const [errors, setErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    csv: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCardNumber = (cardNumber) => {
    if (!/^\d+$/.test(cardNumber)) {
      return 'Card number must contain only digits';
    }
    if (cardNumber.length < 14 || cardNumber.length > 15) {
      return 'Card number must be 14 or 15 digits';
    }
    return '';
  };

  const validateCardHolder = (cardHolder) => {
    if (cardHolder.trim().length < 10) {
      return 'Card holder name must be at least 10 characters';
    }
    return '';
  };

  const validateExpiryDate = (expiryDate) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      return 'Invalid date format. Use MM/YY';
    }
    const [month, year] = expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100; // Last two digits of current year
    const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
    
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return 'Card has expired';
    }
    return '';
  };

  const validateCsv = (csv) => {
    if (!/^\d{3}$/.test(csv)) {
      return 'CSV must be 3 digits';
    }
    return '';
  };

  // Fetch checkout amount on component mount
  useEffect(() => {
    async function fetchCheckoutAmount() {
      try {
        const response = await axios.get(`http://localhost:5000/checkout/${id}`, { withCredentials: true }); // Replace with your API endpoint
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
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    if (name === 'cardNumber') {
      setErrors(prev => ({
        ...prev,
        cardNumber: validateCardNumber(value)
      }));
    } else if (name === 'cardHolder') {
      setErrors(prev => ({
        ...prev,
        cardHolder: validateCardHolder(value)
      }));
    } else if (name === 'expiryDate') {
      setErrors(prev => ({
        ...prev,
        expiryDate: validateExpiryDate(value)
      }));
    } else if (name === 'csv') {
      setErrors(prev => ({
        ...prev,
        csv: validateCsv(value)
      }));
    }
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields again in case the user didn't type (e.g., pasted and didn't change)
    const newErrors = {
      cardNumber: validateCardNumber(paymentDetails.cardNumber),
      cardHolder: validateCardHolder(paymentDetails.cardHolder),
      expiryDate: validateExpiryDate(paymentDetails.expiryDate),
      csv: validateCsv(paymentDetails.csv)
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      setIsSubmitting(false);
      return;
    }
    
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

        const response = await axios.post(`http://localhost:5000/checkouts/pay/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });

      toast.success('Payment successful!');
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Error processing payment:', error);
    } finally {
      setIsSubmitting(false);
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
    <div className="container mt-4" style={{ minHeight: '70vh' }}>
      <ToastContainer />
      <h2 className="mb-4">Checkout</h2>
      <div className="row">
        {/* Billing Details */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title">Billing Details</h4>
              <form>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={billingDetails.fullName}
                    onChange={handleBillingChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    className="form-control"
                    value={billingDetails.address}
                    onChange={handleBillingChange}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-control"
                    value={billingDetails.phoneNumber}
                    onChange={handleBillingChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={billingDetails.email}
                    onChange={handleBillingChange}
                    placeholder="Enter your email address"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">Payment Details</h4>
              <div className="mb-3">
                <label className="form-label">Payment Methods</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="Online Payment"
                      checked={paymentMethod === 'Online Payment'}
                      onChange={handlePaymentMethodChange}
                      id="onlinePayment"
                    />
                    <label className="form-check-label" htmlFor="onlinePayment">
                      Online Payment
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="Bank Deposit"
                      checked={paymentMethod === 'Bank Deposit'}
                      onChange={handlePaymentMethodChange}
                      id="bankDeposit"
                    />
                    <label className="form-check-label" htmlFor="bankDeposit">
                      Bank Deposit
                    </label>
                  </div>
                </div>
              </div>

              {paymentMethod === 'Online Payment' ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      className="form-control"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="Enter card number"
                    />
                    {errors.cardNumber && <div className="text-danger">{errors.cardNumber}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Card Holder's Name</label>
                    <input
                      type="text"
                      name="cardHolder"
                      className="form-control"
                      value={paymentDetails.cardHolder}
                      onChange={handlePaymentChange}
                      placeholder="Enter card holder's name"
                    />
                    {errors.cardHolder && <div className="text-danger">{errors.cardHolder}</div>}
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        className="form-control"
                        value={paymentDetails.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <div className="text-danger">{errors.expiryDate}</div>}
                    </div>
                    <div className="col">
                      <label className="form-label">CSV</label>
                      <input
                        type="text"
                        name="csv"
                        className="form-control"
                        value={paymentDetails.csv}
                        onChange={handlePaymentChange}
                        placeholder="CSV"
                      />
                      {errors.csv && <div className="text-danger">{errors.csv}</div>}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Upload Payment Proof</label>
                    <input
                      type="file"
                      name="paymentProof"
                      className="form-control"
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentProof: e.target.files[0] })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
