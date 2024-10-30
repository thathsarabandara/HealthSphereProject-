import React from 'react'

function Cart() {
  return (
    <div style={{ backgroundColor: '#D8E8FA' }}>
        <div className="container p-5" >
            <div className="row">
                
                {/* Items Table Section */}
                <div className="col-lg-8 col-md-12 mb-4">
                <div className="card">
                    <div className="card-header  text-white" style={{ background: '#112D4E'}}>
                    <div className="row">
                        <div className="col">Item ID</div>
                        <div className="col">Item Descriptions</div>
                        <div className="col">Quantity</div>
                        <div className="col">Unit Price</div>
                        <div className="col">Price</div>
                        <div className="col">Details</div>
                    </div>
                    </div>
                    <div className="card-body">
                    <div className="row align-items-center mb-2">
                        <div className="col">I001</div>
                        <div className="col">Doctor Reservation</div>
                        <div className="col">01</div>
                        <div className="col">Rs.3000</div>
                        <div className="col">Rs.3000</div>
                        <div className="col">
                        <button className="btn btn-secondary btn-sm">View</button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>

                {/* Summary Section */}
                <div className="col-lg-4 col-md-12">
                <div className="card">
                    <div className="card-body">
                    <div className="mb-3">
                        <label>Coupon Code:</label>
                        <div className="input-group">
                        <input type="text" className="form-control" />
                        <button className="btn text-white" style={{background: '#2A5D9C'}}>Enter</button>
                        </div>
                    </div>
                    <p>Coupon ID: <span className="float-end" style={{ backgroundColor: 'transparent' }}>C001</span></p>
                    <p>Coupon Description: <span className="float-end" style={{ backgroundColor: 'transparent' }}>Description</span></p>
                    <p>Coupon Amount: <span className="float-end" style={{ backgroundColor: 'transparent' }}>Rs.500.00</span></p>
                    <hr />
                    <p>Total Summary:</p>
                    <p>Sub Total: <span className="float-end" style={{ backgroundColor: 'transparent' }}>Rs.2500.00</span></p>
                    <p>Coupon Discount: <span className="float-end" style={{ backgroundColor: 'transparent' }}>Rs.500.00</span></p>
                    <hr />
                    <p className="fw-bold">Total: <span className="float-end" style={{ backgroundColor: 'transparent' }}>Rs.2000.00</span></p>
                    <button className="btn btn-success w-100">CheckOut</button>
                    </div>
                </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Cart