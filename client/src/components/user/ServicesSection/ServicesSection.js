import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Importing AOS CSS
import './ServicesSection.css'

const ServicesSection = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animations
      once: true, // Animations only happen once
    });
  }, []);

  return (
    <section className="services-section py-5">
      <div className="container">
        <div className="row justify-content-center pb-5 mb-3">
          <div className="col-md-7 heading-section text-center">
            <p className="subheading">Our Expertise</p>
            <h2>Why Choose Our Services?</h2>
          </div>
        </div>
        <div className="row">
          {/* Service 1 */}
          <div className="col-md-4 services" data-aos="fade-up">
            <div className="d-block d-flex">
              <div className="icon d-flex justify-content-center align-items-center">
                <span className="flaticon-chiropractic"></span>
              </div>
              <div className="media-body pl-3">
                <h3 className="heading">Spinal Manipulation</h3>
                <p>Our spinal manipulation treatment helps restore spinal health and promotes natural healing.</p>
                <p><a href="#" className="btn-custom">Learn More</a></p>
              </div>
            </div>
            <div className="d-block d-flex" data-aos="fade-up">
              <div className="icon d-flex justify-content-center align-items-center">
                <span className="flaticon-acupuncture"></span>
              </div>
              <div className="media-body pl-3">
                <h3 className="heading">Medical Acupuncture</h3>
                <p>Effective for pain management and promoting overall well-being through targeted acupuncture treatments.</p>
                <p><a href="#" className="btn-custom">Learn More</a></p>
              </div>
            </div> 
          </div>

          {/* Service 2 */}
          <div className="col-md-4 services" data-aos="fade-up">
            <div className="d-block d-flex">
              <div className="icon d-flex justify-content-center align-items-center">
                <span className="flaticon-electrotherapy"></span>
              </div>
              <div className="media-body pl-3">
                <h3 className="heading">Electrotherapy</h3>
                <p>Using electrical impulses to treat muscle pain, injuries, and chronic conditions effectively.</p>
                <p><a href="#" className="btn-custom">Learn More</a></p>
              </div>
            </div> 
            <div className="d-block d-flex" data-aos="fade-up">
              <div className="icon d-flex justify-content-center align-items-center">
                <span className="flaticon-examination"></span>
              </div>
              <div className="media-body pl-3">
                <h3 className="heading">Therapeutic Exercise</h3>
                <p>Personalized therapeutic exercises designed to improve mobility and strength.</p>
                <p><a href="#" className="btn-custom">Learn More</a></p>
              </div>
            </div>    
          </div>

          {/* Service 3 */}
          <div className="col-md-4 services" data-aos="fade-up">
            <div className="d-block d-flex">
              <div className="icon d-flex justify-content-center align-items-center">
                <span className="flaticon-lymph-nodes"></span>
              </div>
              <div className="media-body pl-3">
                <h3 className="heading">Manual Lymphatic Drainage</h3>
                <p>A gentle technique used to stimulate the lymphatic system and improve detoxification.</p>
                <p><a href="#" className="btn-custom">Learn More</a></p>
              </div>
            </div>
            <div className="d-block d-flex" data-aos="fade-up">
              <div className="icon d-flex justify-content-center align-items-center">
                <span className="flaticon-bone"></span>
              </div>
              <div className="media-body pl-3">
                <h3 className="heading">Joint Mobilization</h3>
                <p>Improves the range of motion in joints and reduces pain through controlled manipulation.</p>
                <p><a href="#" className="btn-custom">Learn More</a></p>
              </div>
            </div>       
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
