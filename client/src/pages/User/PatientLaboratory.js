import React, { useState,useEffect } from 'react';
import Rectangle82 from '../../assets/images/Rectangle 82.svg'
import rectangle90 from '../../assets/images/Rectangle 90.svg'
import rectangle91 from '../../assets/images/Rectangle 90 (1).svg'
import rectangle92 from '../../assets/images/Rectangle 90 (2).svg'
import rectangle93 from '../../assets/images/Rectangle 90 (3).svg'
import rectangle94 from '../../assets/images/Rectangle 90 (4).svg'
import rectangle95 from '../../assets/images/Rectangle 90 (5).svg'
import Loader from '../../components/common/Loader'


function Laboratory() {
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleAddToCart = () => {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Popup will disappear after 3 seconds
    };
    
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
    
  return (
    <div>
      <section className="section1">
        <div className="img-container position-relative">
          <img
            src={Rectangle82}
            className="img-fluid w-100"
            alt="Home"
            style={{ objectFit: 'cover', height: 'auto', maxHeight: '100vh' }}
          />
          
          {/* Centered Text */}
          <div className="container position-absolute start-50 top-50 translate-middle text-white text-center">
            <div style={{ color: 'white', fontSize: 34, fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
              <div className="col-12 fs-3 fs-md-2 fs-lg-1">Health Sphere Labs</div>
            </div>
          </div>
        </div>
      </section>

      {/*-------------------section2---------------------------*/}
      <section className='section2 text-center' style={{background: '#C8D8F6'}}>
        <div className='d-flex justify-content-center'>
            <div className='container text-center '>
                {/*------Complete Blood Count (CBC)--------------*/}
                <div className='row mt-5 justify-content-center' style={{ background: '#2A5D9C', borderRadius: 19 }}>
                    <div className='col-2 col-sm-1 col-md-1 col-lg-1 mt-3 d-flex justify-content-center align-items-center'>
                        <img src={rectangle90} alt='rectangle90' style={{ width: '100%', height: 'auto', background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%)', borderRadius: 9 }} />
                    </div>
                    <div className='col-5 col-sm-6 col-md-5 col-lg-5 mt-4'>
                        <div style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 'calc(16px + 1vw)', fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
                            Complete Blood Count (CBC)
                        </div>
                    </div>
                    <div className='col-2 col-sm-3 col-md-2 col-lg-2 mt-4'>
                        <button className='btn w-100' style={{ height: 'auto', backgroundColor: '#4EEC50', borderRadius: 23, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black' }}>
                            Available
                        </button>
                    </div>
                    <div className='col-3 col-sm-4 col-md-3 col-lg-4 mt-4'>
                        <button className='btn w-auto' style={{ height: 'auto', backgroundColor: '#C8D8F6', borderRadius: 12, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black', boxShadow: '0px 4px 10px rgba(17, 45, 78, 0.5)' }} onClick={handleAddToCart}>
                            Make a Booking
                        </button>
                    </div>
                </div>

                {/* Popup Message */}
            {showPopup && (
              <div style={{position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#C8F6D8', padding: '20px',width: '300px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', textAlign: 'center', zIndex: 1000,
              }}>
                <h3 style={{color: '#2A5D9C', fontSize: '20px', fontFamily: 'Sansation', fontWeight: '700'
                }}>
                  🎉 Successfully Added to Cart!
                </h3>
                <p style={{color: '#504E4E', fontSize: '14px', fontFamily: 'Sans Serif Collection'
                }}>
                  Your Essential Health Checkup is now in the cart. Ready to proceed?
                </p>
                <button 
                  style={{backgroundColor: '#2A5D9C', color: 'white', padding: '8px 16px', fontSize: '14px', borderRadius: '5px', marginTop: '10px',cursor: 'pointer'
                  }}
                  onClick={() => alert('Navigating to cart...')} // Replace with navigation logic
                >
                  Check it out!
                </button>
              </div> 
            )}


                {/*Liver Function Tests (LFT)*/}
                <div className='row mt-4 justify-content-center' style={{ background: '#2A5D9C', borderRadius: 19 }}>
                    <div className='col-2 col-sm-1 col-md-1 col-lg-1 mt-3 d-flex justify-content-center align-items-center'>
                        <img src={rectangle91} alt='rectangle90' style={{ width: '100%', height: 'auto', background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%)', borderRadius: 9 }} />
                    </div>
                    <div className='col-5 col-sm-6 col-md-5 col-lg-5 mt-4'>
                        <div style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 'calc(16px + 1vw)', fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
                            Liver Function Tests (LFT)
                        </div>
                    </div>
                    <div className='col-2 col-sm-3 col-md-2 col-lg-2 mt-4'>
                        <button className='btn w-100' style={{ height: 'auto', backgroundColor: '#4EEC50', borderRadius: 23, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black' }}>
                            Available
                        </button>
                    </div>
                    <div className='col-3 col-sm-4 col-md-3 col-lg-4 mt-4'>
                        <button className='btn w-auto' style={{ height: 'auto', backgroundColor: '#C8D8F6', borderRadius: 12, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black', boxShadow: '0px 4px 10px rgba(17, 45, 78, 0.5)' }} onClick={handleAddToCart}>
                            Make a Booking
                        </button>
                    </div>
                </div>
                {/*Kidney Function Tests (KFT)*/}
                <div className='row mt-4 justify-content-center' style={{ background: '#2A5D9C', borderRadius: 19 }}>
                    <div className='col-2 col-sm-1 col-md-1 col-lg-1 mt-3 d-flex justify-content-center align-items-center'>
                        <img src={rectangle92} alt='rectangle90' style={{ width: '100%', height: 'auto', background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%)', borderRadius: 9 }} />
                    </div>
                    <div className='col-5 col-sm-6 col-md-5 col-lg-5 mt-4'>
                        <div style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 'calc(16px + 1vw)', fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
                            Kidney Function Tests (KFT)
                        </div>
                    </div>
                    <div className='col-2 col-sm-3 col-md-2 col-lg-2 mt-4'>
                        <button className='btn w-100' style={{ height: 'auto', backgroundColor: '#4EEC50', borderRadius: 23, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black' }}>
                            Available
                        </button>
                    </div>
                    <div className='col-3 col-sm-4 col-md-3 col-lg-4 mt-4'>
                        <button className='btn w-auto' style={{ height: 'auto', backgroundColor: '#C8D8F6', borderRadius: 12, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black', boxShadow: '0px 4px 10px rgba(17, 45, 78, 0.5)' }} onClick={handleAddToCart}>
                            Make a Booking
                        </button>
                    </div>
                </div>
                {/*Thyroid Function Tests (TFT)*/}
                <div className='row mt-4 justify-content-center' style={{ background: '#2A5D9C', borderRadius: 19 }}>
                    <div className='col-2 col-sm-1 col-md-1 col-lg-1 mt-3 d-flex justify-content-center align-items-center'>
                        <img src={rectangle93} alt='rectangle90' style={{ width: '100%', height: 'auto', background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%)', borderRadius: 9 }} />
                    </div>
                    <div className='col-5 col-sm-6 col-md-5 col-lg-5 mt-4'>
                        <div style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 'calc(16px + 1vw)', fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
                         Thyroid Function Tests (TFT)
                        </div>
                    </div>
                    <div className='col-2 col-sm-3 col-md-2 col-lg-2 mt-4'>
                        <button className='btn w-100' style={{ height: 'auto', backgroundColor: '#4EEC50', borderRadius: 23, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black' }}>
                            Available
                        </button>
                    </div>
                    <div className='col-3 col-sm-4 col-md-3 col-lg-4 mt-4'>
                        <button className='btn w-auto' style={{ height: 'auto', backgroundColor: '#C8D8F6', borderRadius: 12, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black', boxShadow: '0px 4px 10px rgba(17, 45, 78, 0.5)' }} onClick={handleAddToCart}>
                            Make a Booking
                        </button>
                    </div>
                </div>
                {/*Blood Glucose Levels*/}
                <div className='row mt-4 justify-content-center' style={{ background: '#2A5D9C', borderRadius: 19 }}>
                    <div className='col-2 col-sm-1 col-md-1 col-lg-1 mt-3 d-flex justify-content-center align-items-center'>
                        <img src={rectangle94} alt='rectangle90' style={{ width: '100%', height: 'auto', background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%)', borderRadius: 9 }} />
                    </div>
                    <div className='col-5 col-sm-6 col-md-5 col-lg-5 mt-4'>
                        <div style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 'calc(16px + 1vw)', fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
                        Blood Glucose Levels
                        </div>
                    </div>
                    <div className='col-2 col-sm-3 col-md-2 col-lg-2 mt-4'>
                        <button className='btn w-100' style={{ height: 'auto', backgroundColor: '#4EEC50', borderRadius: 23, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black' }}>
                            Available
                        </button>
                    </div>
                    <div className='col-3 col-sm-4 col-md-3 col-lg-4 mt-4'>
                        <button className='btn w-auto' style={{ height: 'auto', backgroundColor: '#C8D8F6', borderRadius: 12, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black', boxShadow: '0px 4px 10px rgba(17, 45, 78, 0.5)' }} onClick={handleAddToCart}>
                            Make a Booking
                        </button>
                    </div>
                </div>
                {/*Carcinoembryonic Antigen (CEA)*/}
                <div className='row mt-4 mb-5 justify-content-center' style={{ background: '#2A5D9C', borderRadius: 19 }}>
                    <div className='col-2 col-sm-1 col-md-1 col-lg-1 mt-3 d-flex justify-content-center align-items-center'>
                        <img src={rectangle95} alt='rectangle90' style={{ width: '100%', height: 'auto', background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%)', borderRadius: 9 }} />
                    </div>
                    <div className='col-5 col-sm-6 col-md-5 col-lg-5 mt-4'>
                        <div style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 'calc(16px + 1vw)', fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
                        Carcinoembryonic Antigen (CEA)
                        </div>
                    </div>
                    <div className='col-2 col-sm-3 col-md-2 col-lg-2 mt-4'>
                        <button className='btn w-100' style={{ height: 'auto', backgroundColor: '#4EEC50', borderRadius: 23, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black' }}>
                            Available
                        </button>
                    </div>
                    <div className='col-3 col-sm-4 col-md-3 col-lg-4 mt-4'>
                        <button className='btn w-auto' style={{ height: 'auto', backgroundColor: '#C8D8F6', borderRadius: 12, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black', boxShadow: '0px 4px 10px rgba(17, 45, 78, 0.5)' }} onClick={handleAddToCart}>
                            Make a Booking
                        </button>
                    </div>
                </div>


            </div>
        </div>
      </section>
    </div>
  )
}

export default Laboratory