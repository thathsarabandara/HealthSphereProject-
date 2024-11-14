import React from 'react';
import axios from 'axios';
import Rectangle57 from '../../assets/images/Rectangle 57.svg';

function Packages() {
  // Function to handle adding items to cart
  const addItems = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/package/${id}`, {}, { withCredentials: true });
      alert(response.data.message || 'Item added to cart successfully!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  // Package Card Component
  const PackageCard = ({ id, title, description, price }) => (
    <div className='col-12 col-md-4 mb-4 mt-4'>
      <div style={{ backgroundColor: '#C8D8F6', borderRadius: 11, border: '2px solid #2A5D9C', padding: '10px' }}>
        <div style={{ backgroundColor: '#504E4E', borderRadius: 9, height: '150px' }}></div>
        <div style={{ color: 'black', fontSize: 19, fontFamily: 'Sansation', fontWeight: '700', marginTop: '10px' }}>
          {title}
        </div>
        <div style={{ color: 'black', fontSize: 11, fontFamily: 'Sans Serif Collection', fontWeight: '400', textAlign: 'center', marginTop: '10px' }}>
          {description}
        </div>
        <div className='row mt-3'>
          <div className='col'>
            <div style={{ textAlign: 'center', color: 'black', fontSize: 18, fontFamily: 'Sans Serif Collection' }}>Rs. {price}</div>
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
      {/* Banner Image */}
      <section className='section1'>
        <div className="img-container">
          <img src={Rectangle57} className="img-fluid w-100" alt="Home" style={{ objectFit: 'cover', height: 'auto', maxHeight: '100vh' }} />
        </div>
      </section>

      {/* Packages Section */}
      <section className='section2' style={{ background: '#C8D8F6' }}>
        <div className='container mb-5 mt-0'>
          <div className='row text-center'>
            <div className='col-12 mt-4'>
              <div style={{ color: 'black', fontSize: 22, fontFamily: 'Sansation', fontWeight: '700' }}>
                HealthCare Packages
              </div>
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
          <div className='row mt-0 mb-3' style={{ background: '#5E85CD', marginBottom: '1rem !important' }}>
            <PackageCard id={1} title="Essential Health Checkup" description="Comprehensive basic health screening including blood tests, cholesterol check, blood pressure monitoring, and BMI assessment." price="2500" />
            <PackageCard id={2} title="Advanced Wellness Package" description="Includes all tests from the Essential Health Checkup plus additional screenings like liver function tests, kidney function tests, and ECG." price="3500" />
            <PackageCard id={3} title="Executive Health Package" description="Comprehensive health assessment including advanced blood tests, cardiac stress test, full-body MRI, and consultations with specialists." price="5000" />
          </div>

          {/* Child Packs */}
          <div className='row mt-3'>
            <div className='col-12'>
              <div style={{ width: 194, height: 42, backgroundColor: '#112D4E', padding: '10px', borderTopRightRadius: 16, border: '1px solid black', color: 'white', fontSize: 19 }}>
                Child Packs
              </div>
            </div>
          </div>
          <div className='row mt-0 mb-3' style={{ background: '#5E85CD', marginBottom: '1rem !important' }}>
            <PackageCard id={4} title="Basic Pediatric Checkup" description="Routine health checkup including growth and development assessment, vaccination review, and general pediatric examination." price="3000" />
            <PackageCard id={5} title="Comprehensive Child Package" description="Includes all services from the Basic Pediatric Checkup plus vision and hearing screening, nutritional assessment, and dental check." price="4500" />
            <PackageCard id={6} title="Child Wellness Package" description="Extensive health and development assessment including psychological evaluation, allergy testing, and specialized consultations." price="7000" />
          </div>

          {/* Couple Packs */}
          <div className='row mt-3'>
            <div className='col-12'>
              <div style={{ width: 194, height: 42, backgroundColor: '#112D4E', padding: '10px', borderTopRightRadius: 16, border: '1px solid black', color: 'white', fontSize: 19 }}>
                Couple Packs
              </div>
            </div>
          </div>
          <div className='row mt-0 mb-3' style={{ background: '#5E85CD', marginBottom: '1rem !important' }}>
            <PackageCard id={7} title="Couples Basic Health Check" description="Basic health screening for both partners including blood tests, cholesterol check, and BMI assessment." price="7000" />
            <PackageCard id={8} title="Couples Comprehensive Package" description="In-depth health assessment for both partners including liver and kidney function tests, ECG, and consultations with general practitioners." price="9500" />
            <PackageCard id={9} title="Wellness and Fitness Package" description="Complete wellness package including advanced health screenings, fitness assessments, nutrition counseling, and stress management sessions." price="15500" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Packages;
