import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Social Media Icons
import './HeroSection.css'; // For styles (you can modify according to your needs)
import img1 from '../../../assets/images/1.jpg';
import img2 from '../../../assets/images/2.jpg';
import img3 from '../../../assets/images/3.jpg';
import img4 from '../../../assets/images/4.avif';
import img5 from '../../../assets/images/5.jpg';
import img6 from '../../../assets/images/6.jpg';
import img7 from '../../../assets/images/7.avif'

const HeroSection = () => {
  const [bgImageIndex, setBgImageIndex] = useState(0);

  // Array of background images
  const bgImages = [
    `url(${img4})`,
    `url(${img6})`,
    `url(${img3})`,
    `url(${img7})`,
    `url(${img5})`
  ];

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <section 
      className="hero-section"
      style={{ backgroundImage: bgImages[bgImageIndex] }}
    >
    </section>
  );
};

export default HeroSection;
