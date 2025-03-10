import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './WhyPatientsChooseUs.css'
import Rectangle98 from '../../../assets/images/Rectangle 98.svg'; // replace with your image path

const WhyPatientsChooseUs = () => {
  const [loaded, setLoaded] = useState(false);

  // State for dynamic numbers
  const [doctors, setDoctors] = useState(0);
  const [users, setUsers] = useState(0);
  const [consultations, setConsultations] = useState(0);
  const [tests, setTests] = useState(0);
  const [branches, setBranches] = useState(0);

  // Statistics target values
  const targets = {
    doctors: 35,
    users: 15,
    consultations: 400,
    tests: 300,
    branches: 5,
  };

  // Function to animate numbers dynamically
  const animateNumbers = (target, setter) => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < target) {
        count += Math.ceil(target / 100); // Adjust the speed by changing the increment value
        setter(count);
      } else {
        clearInterval(interval);
      }
    }, 30); // Interval time for number update
  };

  useEffect(() => {
    animateNumbers(targets.doctors, setDoctors);
    animateNumbers(targets.users, setUsers);
    animateNumbers(targets.consultations, setConsultations);
    animateNumbers(targets.tests, setTests);
    animateNumbers(targets.branches, setBranches);
    setLoaded(true);
  }, []);

  // Animation for content fade-in effect
  const fadeIn = useSpring({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 200, friction: 20 },
  });

  return (
    <section className="section2 py-5">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-md-6 mb-4">
            <animated.div style={fadeIn}>
              <div className="section-title">Why Patients Choose Us</div>
              <div className="section-description">
                Health Sphere partners with top healthcare professionals to deliver advanced, evidence-based treatments for complex diseases through our Centres of Excellence.
                <br />
                <br />
                We also provide comprehensive care for lifestyle-related conditions, preventive healthcare, and a full range of diagnostic services. All our hospitals are internationally accredited, ensuring exceptional standards of care.
              </div>
            </animated.div>
          </div>
          <div className="col-md-6 mb-4">
            <animated.div style={fadeIn}>
              <img
                src={Rectangle98}
                alt="Health Sphere"
                className="img-fluid rounded shadow"
              />
            </animated.div>
          </div>
        </div>

        <animated.div style={fadeIn}>
          <div
            className="row text-center justify-content-center stats-section"
            style={{
              backgroundColor: '#112D4E',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: 14,
              padding: '30px',
            }}
          >
            <div className="col-md-2 col-sm-4 stat-box">
              <div className="stat-number text-white ">{doctors}<span className="stat-plus">+</span></div>
              <div className="stat-label text-white ">Doctors</div>
            </div>
            <div className="col-md-2 col-sm-4 stat-box">
              <div className="stat-number text-white ">{users}<span className="stat-plus">+</span></div>
              <div className="stat-label text-white ">New Users</div>
            </div>
            <div className="col-md-2 col-sm-4 stat-box">
              <div className="stat-number text-white ">{consultations}<span className="stat-plus">+</span></div>
              <div className="stat-label text-white ">Consultations</div>
            </div>
            <div className="col-md-2 col-sm-4 stat-box">
              <div className="stat-number text-white ">{tests}<span className="stat-plus">+</span></div>
              <div className="stat-label text-white ">Total Tests</div>
            </div>
            <div className="col-md-2 col-sm-4 stat-box">
              <div className="stat-number text-white ">{branches}<span className="stat-plus">+</span></div>
              <div className="stat-label text-white">Branches</div>
            </div>
          </div>
        </animated.div>
      </div>
    </section>
  );
};

export default WhyPatientsChooseUs;
