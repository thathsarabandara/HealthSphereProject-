import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Social Media Icons
import './HeroSection.css'; // For styles (you can modify according to your needs)

const HeroSection = () => {
  const [bgImageIndex, setBgImageIndex] = useState(0);

  // Array of background images
  const bgImages = [
    'url(https://wallpaperaccess.com/full/3275630.jpg)', 
    'url(https://wallpapercave.com/wp/wp6938252.jpg)', 
    'url(https://wallpapers.com/images/hd/medical-background-r362cvaz18qu1ncv.jpg)',
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
