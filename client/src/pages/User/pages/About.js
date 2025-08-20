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
          <img src={Rectangle83} className='img-fluid w-100' alt="aboutus" style={{ 
            objectFit: 'cover', 
            height: 'auto',
            maxHeight: '100vh'
          }}/>
          <div className='container position-absolute start-50 top-50 translate-middle text-white text-center'>
            <div style={{ 
              color: 'white', 
              fontSize: '2.5rem',
              fontFamily: 'Sansation', 
              fontWeight: '700', 
              wordWrap: 'break-word'
            }}>
              <div className="col-12 fs-3 fs-md-2 fs-lg-1">About Us</div>
            </div>
          </div>
        </div>
      </section>

      {/*-----------Section2-----------*/}
      <section className='section2 ms-5 me-5' style={{ padding: '5rem 0' }}>
        <div className='container'>
            <div className='row justify-content-center align-items-start g-0'>
            {/* Left column for the image */}
            <div className='col-12 col-md-8 mb-4 mb-md-0'>
                <img 
                src={Rectangle92} 
                alt="Nurse with tablet" 
                className="img-fluid rounded" 
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  borderRadius: '8px',
                  height: 'auto'
                }}
                />
            </div>

            {/* Right column for the 'About Us' text */}
            <div className='col-12 col-md-8'>
                <div 
                className='text-white rounded'
                style={{ 
                  backgroundColor: '#112D4E', 
                  padding: '2rem', 
                  color: 'white'
                }}
                >
                <h2 
                    className="mb-4 mt-4" 
                    style={{ 
                      fontFamily: 'Sansation', 
                      fontSize: '2rem',
                      fontWeight: 400,
                      lineHeight: '1.5'
                    }}
                >
                    About Us
                </h2>
                <p style={{ 
                  fontFamily: 'Sansation', 
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: '1.6'
                }}>
                  Welcome to Health Sphere, a premier healthcare institution dedicated to providing exceptional medical services through innovation, compassion, and cutting-edge technology. Our hospital is built on a foundation of trust, excellence, and patient-centered care, ensuring that every individual receives the highest standard of treatment in a supportive and efficient environment.
                </p>
                <p style={{ 
                  fontFamily: 'Sansation', 
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: '1.6'
                }}>
                At Health Sphere, we understand that managing healthcare needs can be complex. That’s why we’ve integrated a state-of-the-art Hospital Management System (HMS) to streamline every aspect of patient care—from appointment scheduling and doctor consultations to prescription management and billing. Our system is designed to enhance operational efficiency, reduce wait times, and deliver a seamless experience for patients, doctors, and administrative staff alike.
                </p>
                <p style={{ 
                  fontFamily: 'Sansation', 
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: '1.6'
                }}>
                With a commitment to leveraging the latest advancements in healthcare technology, we aim to bridge the gap between medical professionals and patients, ensuring transparency, accessibility, and top-tier service. Whether you’re visiting for a routine check-up or specialized treatment, Health Sphere is your trusted partner in health and wellness.
                </p>
                </div>
            </div>
            </div>
        </div>
        </section>

      {/*---------SECTION3--------*/}
      <section className="section bg-white">
        <div className="container">
          <div className="row justify-content-center">
            {/* Vision Section */}
            <div className="col-12 col-md-6 mb-4">
              <div className="d-flex flex-column align-items-center" 
                style={{ 
                  background: '#C8D8F6', 
                  borderRadius: '20px', 
                  padding: '20px',
                  width: '100%'
                }}>
                <div style={{ 
                  color: 'black', 
                  fontSize: '2rem',
                  fontFamily: 'Sansation', 
                  fontWeight: 400,
                  textAlign: 'center'
                }}>
                  Our Vision
                </div>
                <div style={{ 
                  color: 'black', 
                  fontSize: '1rem',
                  fontFamily: 'Sansation', 
                  fontWeight: 400,
                  marginTop: '10px',
                  textAlign: 'center'
                }}>
                  To redefine healthcare delivery by combining medical expertise with innovative digital solutions, creating a future where quality healthcare is accessible, efficient, and personalized for every patient.
                </div>
                <div className="mt-4 d-flex justify-content-center" style={{ width: '100%' }}>
                  <div 
                      style={{ 
                        width: '200px', 
                        height: '200px',
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

            {/* Mission Section */}
            <div className="col-12 col-md-6 mb-4">
              <div className="d-flex flex-column align-items-center" 
                style={{ 
                  background: '#C8D8F6', 
                  borderRadius: '20px', 
                  padding: '20px',
                  width: '100%'
                }}>
                <div className="mb-4 d-flex justify-content-center" style={{ width: '100%' }}>
                  <div 
                      style={{ 
                        width: '200px', 
                        height: '200px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img src={about2} alt="About" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
                <div style={{ 
                  color: 'black', 
                  fontSize: '2rem',
                  fontFamily: 'Sansation', 
                  fontWeight: 400,
                  textAlign: 'center'
                }}>
                  Our Mission
                </div>
                <div style={{ 
                  color: 'black', 
                  fontSize: '1rem',
                  fontFamily: 'Sansation', 
                  fontWeight: 400,
                  marginTop: '10px',
                  textAlign: 'center'
                }}>
                  To empower hospitals with a secure, efficient, and patient-centric management system that enhances operational excellence and elevates the standard of medical services.
                </div>
              </div>
            </div>

            {/* Goal Section */}
            <div className="col-12 col-md-6 mb-4">
              <div className="d-flex flex-column align-items-center" 
                style={{ 
                  background: '#C8D8F6', 
                  borderRadius: '20px', 
                  padding: '20px',
                  width: '100%'
                }}>
                <div style={{ 
                  color: 'black', 
                  fontSize: '2rem',
                  fontFamily: 'Sansation', 
                  fontWeight: 400,
                  textAlign: 'center'
                }}>
                  Our Goal
                </div>
                <div style={{ 
                  color: 'black', 
                  fontSize: '1rem',
                  fontFamily: 'Sansation', 
                  fontWeight: 400,
                  marginTop: '10px',
                  textAlign: 'center'
                }}>
                  To create an efficient, patient-centered healthcare ecosystem by integrating advanced technology with compassionate service—streamlining hospital operations, enhancing medical care, and improving accessibility for all.
                </div>
                <div className="mt-4 d-flex justify-content-center" style={{ width: '100%' }}>
                  <div 
                      style={{ 
                        width: '200px', 
                        height: '200px',
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
        </div>
      </section>
    </div>
  )
}

export default About;
