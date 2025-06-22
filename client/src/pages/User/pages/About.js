import React, {useEffect, useState} from 'react'
import Rectangle83 from '../../../assets/images/Rectangle 83.svg'
import Rectangle92 from '../../../assets/images/Rectangle 92.svg'
import about1 from '../../../assets/images/about/1.png';
import about2 from '../../../assets/images/about/2.png';
import about3 from '../../../assets/images/about/3.png';
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
                  Welcome to Health Sphere, a premier healthcare institution dedicated to providing exceptional medical services through innovation, compassion, and cutting-edge technology. Our hospital is built on a foundation of trust, excellence, and patient-centered care, ensuring that every individual receives the highest standard of treatment in a supportive and efficient environment.
                </p>
                <p style={{ fontFamily: 'Sansation', fontSize: '16px', fontWeight: 400 }}>
                At Health Sphere, we understand that managing healthcare needs can be complex. That’s why we’ve integrated a state-of-the-art Hospital Management System (HMS) to streamline every aspect of patient care—from appointment scheduling and doctor consultations to prescription management and billing. Our system is designed to enhance operational efficiency, reduce wait times, and deliver a seamless experience for patients, doctors, and administrative staff alike.
                </p>
                <p style={{ fontFamily: 'Sansation', fontSize: '16px', fontWeight: 400 }}>
                With a commitment to leveraging the latest advancements in healthcare technology, we aim to bridge the gap between medical professionals and patients, ensuring transparency, accessibility, and top-tier service. Whether you’re visiting for a routine check-up or specialized treatment, Health Sphere is your trusted partner in health and wellness.
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
                To redefine healthcare delivery by combining medical expertise with innovative digital solutions, creating a future where quality healthcare is accessible, efficient, and personalized for every patient.
                </div>
              </div>

              <div className="col-auto">
                  <div 
                      style={{ 
                        width: '214px', 
                        height: '214px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img src={about1} alt="About" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                      style={{ 
                        width: '214px', 
                        height: '214px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img src={about2} alt="About" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
              </div>

              {/* Text on the right */}
              <div className="col text-right">
                  <div style={{ color: 'black', fontSize: '32px', fontFamily: 'Sansation', fontWeight: 400 }}>
                      Our Mission
                  </div>
                  <div style={{ color: 'black', fontSize: '16px', fontFamily: 'Sansation',fontWeight: 400, marginTop: '10px' }}>
                      To empower hospitals with a secure, efficient, and patient-centric management system that enhances operational excellence and elevates the standard of medical services.
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
                  To create an efficient, patient-centered healthcare ecosystem by integrating advanced technology with compassionate service—streamlining hospital operations, enhancing medical care, and improving accessibility for all.
                </div>
              </div>

              <div className="col-auto" >
                  <div 
                      style={{ 
                        width: '214px', 
                        height: '214px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img src={about3} alt="About" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

