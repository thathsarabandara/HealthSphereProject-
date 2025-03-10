import React from "react";
import Slider from "react-slick";
import { useState } from "react";

const NewsletterSlider = () => {
  // Newsletter content data
  const newsletterItems = [
    {
      title: "Stay Updated With Our Health News",
      description: "Sign up for our newsletter and get the latest updates on health tips, offers, and more!",
      cta: "Subscribe Now",
    },
    {
      title: "Exclusive Offers and Promotions",
      description: "Be the first to know about our exclusive health-related offers and promotions!",
      cta: "Get Offers",
    },
    {
      title: "Your Health Matters",
      description: "Join our community and get expert advice and news tailored just for you.",
      cta: "Join Now",
    },
  ];

  const settings = {
    dots: true, // show dots at the bottom for navigation
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Only show one slide at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // auto-slide every 3 seconds
    arrows: false, // No next/prev arrows
  };

  return (
    <section className="newsletter-section py-5">
      <div className="container">
        <div className="row text-center">
          <div className="col">
            <h2 className="section-title" style={{ color: "#1E4D70", fontSize: "36px", fontWeight: "600" }}>
              Subscribe to Our Newsletter
            </h2>
            <p className="section-subtitle" style={{ fontSize: "18px", fontWeight: "400", color: "#5B5B5B" }}>
              Get exclusive health tips, promotions, and news delivered straight to your inbox.
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <Slider {...settings}>
              {newsletterItems.map((item, index) => (
                <div key={index} className="newsletter-slide">
                  <div className="newsletter-content">
                    <h3 className="newsletter-title" style={{ fontSize: "28px", fontWeight: "600" }}>
                      {item.title}
                    </h3>
                    <p className="newsletter-description" style={{ fontSize: "16px", fontWeight: "400", color: "#777" }}>
                      {item.description}
                    </p>
                    <button className="btn-subscribe" style={buttonStyle}>{item.cta}</button>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

const buttonStyle = {
  backgroundColor: "#1E4D70",
  color: "white",
  border: "none",
  padding: "12px 30px",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default NewsletterSlider;
