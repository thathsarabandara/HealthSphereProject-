import React, { useState , useEffect} from 'react';
import '../../styles/user/Payment.css';
import Loader from '../../components/common/Loader';

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
        zIndex: 9999
      }}>
        <Loader />
      </div>
    );
  };


  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  

  return (
    <div className="billing-container ">
      <div className="billing-details ms-5 mt-5 mb-5">
        <h3><span className="icon">▣</span> Billing Details</h3>
        <form>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />

          <label>Address</label>
          <textarea placeholder="Enter your address"></textarea>

          <label>Phone Number</label>
          <input type="tel" placeholder="Enter your phone number" />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email address" />
        </form>
      </div>

      <div className="payment-details me-5 mt-5 mb-5">
        <div className="subtotal">
          <h5><b>Sub Total:-</b></h5>
          <strong>Rs.2000.00</strong>
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
            <form>
              <label>Card Number:</label>
              <input type="text" placeholder="Enter card number" />

              <label>Card Holder's Name:</label>
              <input type="text" placeholder="Enter card holder's name" />

              <label>Card Valid Date:</label>
              <input type="text" placeholder="MM/YY" />

              <label>CSV:</label>
              <input type="text" placeholder="CSV" />

              <button type="submit" className="pay-btn">Pay Now</button>
            </form>
          </div>
        ) : (
          <div className="file-upload">
            <form>
              <label>Upload Payment Proof:</label>
              {/*<input type="file" />*/}
              <div className="mt-3" style={{ background: '#C8D8F6', borderRadius: '11px', padding: '0px' }}>
                    <input
                      type="file"
                      
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#112D4E',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                      }}
                    />
                  </div>
              
              
              
              <button className='btn1 btn-outline mt-3' type="submit">
                    <div  style={{ textDecoration: 'none', color: 'inherit' }}>Submit</div>
                  </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;



