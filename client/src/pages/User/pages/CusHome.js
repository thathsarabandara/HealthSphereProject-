import React from 'react'
import Home1 from "../../../assets/images/Rectangle 9 (3).svg";
import img1 from '../../../assets/images/image-1.svg';
import img2 from '../../../assets/images/img-2.svg';
import img3 from '../../../assets/images/img-3.svg';
import '../../../styles/Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'typeface-anton';
import CustomerReviews from '../../../components/user/CustomerReview/CustomerReviews';
import WhyPatientsChooseUs from '../../../components/user/Chooseus/WhyPatientsChooseUs';
import NewsletterSlider from '../../../components/user/NewsletterSlider/NewsletterSlider';
import BlogPostSlider from '../../../components/user/BlogPostSlider/BlogPostSlider';
import HealthCodeSection from '../../../components/user/HealthCodeSection/HealthCodeSection';
import HeroSection from '../../../components/user/HeroSection/HeroSection';
import ServicesSection from '../../../components/user/ServicesSection/ServicesSection';

function CusHome() {
  return (
    <div>
        <div className="container-fluid p-0 position-relative">
        {/* Background Image */}
        <div className="img-container">
            <HeroSection/>
        </div>

        <div className="container position-absolute start-50 text-white" style={{ transform: 'translate(-50%, -80%)', marginTop: '-200px' }}>
          <div className="row xs-justify-content-center">
            {/* Upper Text */}
            <div className="col-12 col-md-8 ms-md-5 text-center text-md-start" style={{ background: 'transparent' }}>
              <h6 className="text-black mb-3 fs-6 fs-md-5 fs-lg-4" style={{ backgroundColor: 'transparent', padding: '5px' }}>
                Unlimited Health Experience with Health Code
              </h6>
            </div>

            {/* Main Heading */}
            <div className="col-12 col-lg-12 col-md-8 ms-md-5 text-center text-md-start" style={{ background: 'transparent' }}>
              <h1 className="text-black display-5 display-md-4 display-lg-3 mb-3" style={{ backgroundColor: 'transparent', padding: '5px' }}>
                Get Better Care For Your Health<br />
                with Health <span className="sphere text-white">Sphere</span>
              </h1>
            </div>


            {/* Buttons */}
            <div className="col-12 col-md-8 ms-md-5 d-flex flex-column flex-md-row justify-content-md-start justify-content-center gap-3 mb-4">
              <a href='/finddoctors' className="btn btn-primary px-4 w-auto w-md-auto" style={{ background: '#C8D8F6', color: 'black' }}>Make Appointment</a>
              <a href='/finddoctors' className="btn btn-outline-primary px-4 w-auto w-md-auto" style={{ background: '#C8D8F6', color: 'black' }}>Find Doctor</a>
            </div>

            {/* Social Media Icons */}
            <div className="col-12 col-md-8 ms-md-5 d-flex justify-content-center justify-content-md-start gap-3 mb-4">
              <a href="#"><i className="fab fa-facebook fa-2x text-black"></i></a>
              <a href="#"><i className="fab fa-twitter fa-2x text-black"></i></a>
              <a href="#"><i className="fab fa-instagram fa-2x text-black"></i></a>
            </div>
          </div>
        </div>

        {/* Lower Text */}
        <div className="position-absolute start-50 translate-middle text-center">
          <span className="middle text-white fs-1 fs-md-4 p-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '5px' }}>
            "Your Health is our Priority"
          </span>
        </div>

        {/* Section 1 */}
        <section className='section1 py-5'>
          <div className='container'>
            <div className='row text-center'>
              <div className="col-12 mt-3">
                <h1>Welcome to Health Code</h1>
                <h6>We Dedicated to You</h6>
                <h3>Compassion, Innovation & Excellence</h3>
              </div>
            </div>
            <div className='row text-center mt-3'>
              <div className='col-12 col-sm-4'>
                <img src={img1} alt="Doctor" className="img-fluid mb-3" style={{ borderRadius: '8px' }} />
              </div>
              <div className='col-sm-4'>
                <img src={img2} alt="Care" className="img-fluid mb-3" style={{ borderRadius: '8px' }} />
              </div>
              <div className='col-sm-4'>
                <img src={img3} alt="Surgery" className="img-fluid mb-3" style={{ borderRadius: '8px' }} />
              </div>
            </div>
          </div>
        </section>
        {/* Section 2 */}
        <section>
          <div className='m-4'>
            <WhyPatientsChooseUs/>
          </div>
        </section>

        <section>
          <div className='m-4'>
            <CustomerReviews/>
          </div>
        </section>
        <section>
          <div className='m-4'>
            <ServicesSection />
          </div>
        </section>
        <section>
          <div className='m-4'>
            <NewsletterSlider/>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <BlogPostSlider/>
        </section>
      </div>
    </div>
  )
}

export default CusHome