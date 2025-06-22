import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rectangle57 from '../../../assets/images/Rectangle 57.svg';
import Loader from '../../../components/common/Loader';
import image1 from '../../../assets/images/packages/1.png';
import image2 from '../../../assets/images/packages/2.png';
import image3 from '../../../assets/images/packages/3.png';
import image4 from '../../../assets/images/packages/4.png';
import image5 from '../../../assets/images/packages/5.png';
import image6 from '../../../assets/images/packages/6.png';
import image7 from '../../../assets/images/packages/7.png';
import image8 from '../../../assets/images/packages/8.png';
import image9 from '../../../assets/images/packages/9.png';

function Packages() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#f0f4f8', zIndex: 9999
      }}>
        <Loader />
      </div>
    );
  }

  const addItems = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/package/${id}`, {}, { withCredentials: true });
      alert(response.data.message || 'Item added to cart successfully!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const PackageCard = ({ id, title, description, price, imageUrl }) => (
    <div className='col-12 col-md-4 mb-4 mt-4'>
      <div style={{ backgroundColor: '#C8D8F6', borderRadius: 11, border: '2px solid #2A5D9C', padding: '10px' }}>
      <div style={{
          borderRadius: 9,height: '150px',display: 'flex',alignItems: 'center',justifyContent: 'center',overflow: 'hidden',
        }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              style={{height: '100%',width: '100%',objectFit: 'cover',borderRadius: 9 
              }}
            />
          )}
        </div>
        <div style={{ color: 'black', fontSize: 19, fontFamily: 'Sansation', fontWeight: '700', marginTop: '10px' }}>
          {title}
        </div>
        <div style={{ color: 'black', fontSize: 11, fontFamily: 'Sans Serif Collection', fontWeight: '400', textAlign: 'center', marginTop: '10px' }}>
          {description}
        </div>
        <div className='row mt-3'>
          <div className='col'>
            <div style={{ textAlign: 'center', color: 'black', fontSize: 18 }}>Rs. {price}</div>
          </div>
          <div className='col'>
            <button
              onClick={() => addItems(id)}
              style={{ backgroundColor: '#413C3C', color: 'white', fontSize: 14, padding: '5px 10px', borderRadius: '5px', width: '100%' }}
            >
              + Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <section className='section1'>
        <div className="img-container">
          <img src={Rectangle57} className="img-fluid w-100" alt="Home" style={{ objectFit: 'cover', height: 'auto', maxHeight: '100vh' }} />
        </div>
      </section>

      <section className='section2' style={{ background: '#C8D8F6' }}>
        <div className='container mb-5 mt-0'>
          <div className='row text-center'>
            <div className='col-12 mt-4'>
              <div style={{ color: 'black', fontSize: 22, fontFamily: 'Sansation', fontWeight: '700' }}>HealthCare Packages</div>
            </div>
          </div>

          {/* Adult Packs */}
          <div className='row mt-3'>
            <div className='col-12'>
              <div style={{ width: 194, height: 42, backgroundColor: '#112D4E', padding: '10px', borderTopRightRadius: 16, border: '1px solid black', color: 'white', fontSize: 19 }}>
                Adult Packs
              </div>
            </div>
          </div>
          <div className='row mt-0 mb-3' style={{ background: '#5E85CD', marginBottom: '1rem' }}>
            <PackageCard id={1} title="Essential Health Checkup" description="Basic screening: blood tests, cholesterol, BP & BMI check." price="2500"
              imageUrl={image1} />
            <PackageCard id={2} title="Advanced Wellness Package" description="Includes essential checkup + liver, kidney tests & ECG." price="3500"
              imageUrl={image2} />
            <PackageCard id={3} title="Executive Health Package" description="Full assessment: blood work, stress test, MRI, specialist consults." price="5000"
              imageUrl={image3} />
          </div>

          {/* Child Packs */}
          <div className='row mt-3'>
            <div className='col-12'>
              <div style={{ width: 194, height: 42, backgroundColor: '#112D4E', padding: '10px', borderTopRightRadius: 16, border: '1px solid black', color: 'white', fontSize: 19 }}>
                Child Packs
              </div>
            </div>
          </div>
          <div className='row mt-0 mb-3' style={{ background: '#5E85CD', marginBottom: '1rem' }}>
            <PackageCard id={4} title="Basic Pediatric Checkup" description="Routine child checkup, growth review & vaccination updates." price="3000"
              imageUrl={image4} />
            <PackageCard id={5} title="Comprehensive Child Package" description="Adds vision, hearing, dental & nutrition screening." price="4500"
              imageUrl={image5} />
            <PackageCard id={6} title="Child Wellness Package" description="Full developmental & allergy assessments + psychologist review." price="7000"
              imageUrl={image6} />
          </div>

          {/* Couple Packs */}
          <div className='row mt-3'>
            <div className='col-12'>
              <div style={{ width: 194, height: 42, backgroundColor: '#112D4E', padding: '10px', borderTopRightRadius: 16, border: '1px solid black', color: 'white', fontSize: 19 }}>
                Couple Packs
              </div>
            </div>
          </div>
          <div className='row mt-0 mb-5' style={{ background: '#5E85CD' }}>
            <PackageCard id={7} title="Couples Basic Health Check" description="Screenings: blood, cholesterol, BMI for both partners." price="7000"
              imageUrl={image7} />
            <PackageCard id={8} title="Couples Comprehensive Package" description="Adds liver, kidney tests & ECG for both." price="9500"
              imageUrl={image8} />
            <PackageCard id={9} title="Wellness and Fitness Package" description="Full health, fitness, nutrition & stress management program." price="15500"
              imageUrl={image9} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Packages;
