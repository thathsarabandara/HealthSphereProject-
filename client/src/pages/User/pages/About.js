import React, {useEffect, useState} from 'react'
import Rectangle83 from '../../../assets/images/Rectangle 83.svg'
import Rectangle92 from '../../../assets/images/Rectangle 92.svg'
import Loader from '../../../components/common/Loader';

function About() {
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

  return (
    <div>
      {/*-----------section1-----------*/}
      <section className='section1'>
        <div className='img-container position-relative'>
          <img src={Rectangle83} className='img-fluid w-100' alt="aboutus" style={{ objectFit: 'cover', height: 'auto', maxHeight: '100vh' }}/>
          <div className='container position-absolute start-50 top-50 translate-middle text-white text-center'>
            <div style={{ color: 'white', fontSize: 34, fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
              <div className="col-12 fs-3 fs-md-2 fs-lg-1">About Us</div>
            </div>
          </div>
        </div>
      </section>

      {/*-----------Section2-----------*/}
      <section className='section2 ms-5 me-5' style={{ padding: '5rem 0' }}>
        <div className='container'>
            <div className='row justify-content-center align-items-start g-0'> {/* Use g-0 on row to remove gaps */}

            {/* Left column for the image */}
            <div className='col-lg-6 col-md-8' style={{ padding: 0 }}>
                <img 
                src={Rectangle92} 
                alt="Nurse with tablet" 
                className="img-fluid rounded" 
                style={{ display: 'block', width: '100%' , borderRadius: '8px' }} // Makes the image responsive and removes margin
                />
            </div>

            {/* Right column for the 'About Us' text */}
            <div className='col-lg-6 col-md-8' style={{ padding: 0 }}>
                <div 
                className='text-white rounded'
                style={{ backgroundColor: '#112D4E', padding: '30px', color: 'white' }}
                >
                <h2 
                    className="mb-4 mt-4" 
                    style={{ fontFamily: 'Sansation', fontSize: '24px', fontWeight: 400 }}
                >
                    About Us
                </h2>
                <p style={{ fontFamily: 'Sansation', fontSize: '16px', fontWeight: 400 }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a 
                    type specimen book.
                </p>
                <p style={{ fontFamily: 'Sansation', fontSize: '16px', fontWeight: 400 }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a 
                    type specimen book.
                </p>
                <p style={{ fontFamily: 'Sansation', fontSize: '16px', fontWeight: 400 }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a 
                    type specimen book.
                </p>
                <p style={{ fontFamily: 'Sansation', fontSize: '16px', fontWeight: 400 }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a 
                    type specimen book.
                </p>
                <p style={{ fontFamily: 'Sansation', fontSize: '16px', fontWeight: 400 }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a 
                    type specimen book.
                </p>
                </div>
            </div>

            </div>
        </div>
        </section>



      {/*---------SECTION3--------*/}
      <section className="section bg-white">
        <div className="container">
          <div className="row justify-content-start mt-4">
            {/* Vision Section */}
            <div className="d-flex flex-row align-items-center" 
              style={{ width: 739, height: 226, background: '#C8D8F6', borderRadius: '20px', padding: '20px', borderTopRightRadius: 2500, borderBottomRightRadius: 2500 }}>
              <div className="col">
                <div style={{ color: 'black', fontSize: '32px', fontFamily: 'Sansation', fontWeight: 400 }}>
                  Our Vision
                </div>
                <div style={{ color: 'black', fontSize: '16px', fontFamily: 'Sansation', fontWeight: 400, marginTop: '10px' }}>
                  Lorem Ipsum is simply dummy text of the printing and<br/> typesetting industry. Lorem Ipsum has been the industry's<br/> standard dummy text ever since the 1500s.
                </div>
              </div>

              <div className="col-auto">
                <div 
                  style={{ width: '214px', height: '214px', background: '#D9D9D9', borderRadius: '50%' }}>
                </div>
              </div>
            </div>
          </div>

          <div className='row justify-content-end'>
            {/* Mission Section */}
            <div className="d-flex flex-row align-items-center justify-content-end mt-4" 
              style={{ width: 739, height: 226, background: '#C8D8F6', borderRadius: '20px', padding: '20px', borderTopLeftRadius: 2500, borderBottomLeftRadius: 2500 }}>
              
              {/* Circle on the left */}
              <div className="col-auto" style={{ marginRight: '20px' }}>
                  <div 
                      style={{ width: '214px', height: '214px',background: '#D9D9D9', borderRadius: '50%' }}>
                  </div>
              </div>

              {/* Text on the right */}
              <div className="col text-right">
                  <div style={{ color: 'black', fontSize: '32px', fontFamily: 'Sansation', fontWeight: 400 }}>
                      Our Mission
                  </div>
                  <div style={{ color: 'black', fontSize: '16px', fontFamily: 'Sansation',fontWeight: 400, marginTop: '10px' }}>
                      Lorem Ipsum is simply dummy text of the printing and<br/> 
                      typesetting industry. Lorem Ipsum has been the industry's<br/> 
                      standard dummy text ever since the 1500s.
                  </div>
              </div>
            </div>
          </div>

          <div className='row justify-content-start mb-5'>

            {/* Goal Section */}
            <div className="d-flex flex-row align-items-center mt-4" 
              style={{ width: 739, height: 226, background: '#C8D8F6', borderRadius: '20px', padding: '20px', borderTopRightRadius: 2500, borderBottomRightRadius: 2500 }}>
              <div className="col">
                <div style={{ color: 'black', fontSize: '32px', fontFamily: 'Sansation', fontWeight: 400 }}>
                  Our Goal
                </div>
                <div style={{ color: 'black', fontSize: '16px', fontFamily: 'Sansation', fontWeight: 400, marginTop: '10px' }}>
                  Lorem Ipsum is simply dummy text of the printing and<br/> typesetting industry. Lorem Ipsum has been the industry's<br/> standard dummy text ever since the 1500s.
                </div>
              </div>

              <div className="col-auto">
                <div 
                  style={{ width: '214px', height: '214px', background: '#D9D9D9', borderRadius: '50%' }}>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default About

