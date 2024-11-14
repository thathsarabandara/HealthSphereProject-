import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0); // Assuming coupon discount is Rs. 500.00

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cart', { withCredentials: true });
        const fetchedCartItems = response.data.cart || [];
        setCartItems(fetchedCartItems);
      } catch (err) {
        setError('Failed to load cart data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const subTotal = cartItems.reduce((total, item) => total + Number(item.totalPrice || 0), 0);
  const discountAmount = Number(couponDiscount);

  // Delete item function
  const handleDelete = async (id) => {
    try {
      await axios.put(`http://localhost:5000/cart/${id}`, {}, { withCredentials: true });
      setCartItems((prevItems) => prevItems.filter(item => item.id !== id)); // Remove item from state
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#D8E8FA', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <div className="row">

          {/* Cart Items Section */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow">
              <div className="card-header text-white" style={{ backgroundColor: '#112D4E' }}>
                <div className="row fw-bold">
                  <div className="col">Item ID</div>
                  <div className="col">Description</div>
                  <div className="col">Quantity</div>
                  <div className="col">Unit Price</div>
                  <div className="col">Total Price</div>
                  <div className="col">Action</div>
                </div>
              </div>
              <div className="card-body">
                {cartItems.length === 0 ? (
                  <div>No items in cart</div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="row align-items-center mb-2">
                      <div className="col">{item.id}</div>
                      <div className="col">{item.productName}</div>
                      <div className="col">{item.quantity}</div>
                      <div className="col">Rs. {item.unitPrice}</div>
                      <div className="col">Rs. {item.totalPrice}</div>
                      <div className="col">
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="col-lg-4">
            <div className="card shadow">
              <div className="card-body">
                <div className="mb-3">
                  <label>Coupon Code:</label>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter discount amount" 
                      onChange={(e) => setCouponDiscount(Number(e.target.value) || 0)} 
                    />
                    <button className="btn text-white" style={{ backgroundColor: '#2A5D9C' }}>Apply</button>
                  </div>
                </div>
                <p>Coupon Amount: <p className="float-end">Rs. {discountAmount.toFixed(2)}</p></p>
                <hr />
                <p>Total Summary:</p>
                <p>Sub Total: <p className="float-end">Rs. {subTotal.toFixed(2)}</p></p>
                <p>Coupon Discount: <p className="float-end">Rs. {discountAmount.toFixed(2)}</p></p>
                <hr />
                <p className="fw-bold">Total: <p className="float-end">Rs. {(subTotal - discountAmount).toFixed(2)}</p></p>
                <button className="btn btn-success w-100">Checkout</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;
