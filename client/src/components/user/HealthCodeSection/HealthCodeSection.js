import React from 'react';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer'; // For scroll trigger
import img1 from '../../../assets/images/image-1.svg';
import img2 from '../../../assets/images/img-2.svg';
import img3 from '../../../assets/images/img-3.svg';

const HealthCodeSection = () => {
  // Animation for text elements
  const textAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    config: { duration: 1000 },
  });

  // Animation for images
  const imageAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    config: { duration: 1200 },
  });

  // IntersectionObserver for text
  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
    threshold: 0.5, // Trigger when 50% of the element is visible
  });

  // IntersectionObserver for images
  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section className="section1 py-5">
      <div className="container">
        {/* Text Animation on Scroll */}
        <div className="row text-center">
          <div className="col-12 mt-3" ref={textRef}>
            {textInView && (
              <>
                <animated.h1 style={textAnimation}>Welcome to Health Code</animated.h1>
                <animated.h6 style={textAnimation}>We are Dedicated to You</animated.h6>
                <animated.h3 style={textAnimation}>Compassion, Innovation & Excellence</animated.h3>
              </>
            )}
          </div>
        </div>

        {/* Images Animation on Scroll */}
        <div className="row text-center mt-3">
          <div className="col-12 col-sm-4" ref={imageRef}>
            {imageInView && (
              <animated.img
                src={img1}
                alt="Doctor"
                className="img-fluid mb-3"
                style={{ borderRadius: '8px', ...imageAnimation }}
              />
            )}
          </div>
          <div className="col-sm-4">
            {imageInView && (
              <animated.img
                src={img2}
                alt="Care"
                className="img-fluid mb-3"
                style={{ borderRadius: '8px', ...imageAnimation }}
              />
            )}
          </div>
          <div className="col-sm-4">
            {imageInView && (
              <animated.img
                src={img3}
                alt="Surgery"
                className="img-fluid mb-3"
                style={{ borderRadius: '8px', ...imageAnimation }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthCodeSection;
