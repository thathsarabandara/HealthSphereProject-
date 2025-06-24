import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce'; // import lodash.debounce

import Rectangle56 from '../../../assets/images/Rectangle 56.svg'
import Ellipse1 from '../../../assets/images/Ellipse 1.svg'
import '../../../styles/Doctors.css'
import Loader from '../../../components/common/Loader';
import SearchForm from '../../../components/user/Doctors/SearchForm';
import DoctorCard from '../../../components/user/Doctors/DoctorCard';

function Doctors() {
  const [doctorData, setDoctorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardViewVisible, setIsCardViewVisible] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({
    doctorName: '',
    specialization: '',
    sessionTime: '',
    date: ''
  });

  const specializationOptions = [
    { label: 'General Practitioner', value: '1' },
    { label: 'Pediatrician', value: '2' },
    { label: 'Cardiologist', value: '3' },
    { label: 'Dermatologist', value: '4' },
    { label: 'Neurologist', value: '5' },
    { label: 'Oncologist', value: '6' },
    { label: 'Psychiatrist', value: '7' },
    { label: 'Endocrinologist', value: '8' },
    { label: 'Gastroenterologist', value: '9' },
    { label: 'Orthopedic Surgeon', value: '10' },
    { label: 'Ophthalmologist', value: '11' },
    { label: 'Pulmonologist', value: '12' }
  ];

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  const fetchSearchResults = async (criteria) => {
    try {
      const response = await axios.post('http://localhost:5000/finddoctor', criteria);
      setDoctorData(response.data);
      setIsCardViewVisible(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      setIsLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSearchResults, 500), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedCriteria = { ...searchCriteria, [name]: value };
    setSearchCriteria(updatedCriteria);

    if (name === 'doctorName') {
      debouncedFetch(updatedCriteria);
    }
  };

  const handleSearchButton = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetchSearchResults(searchCriteria);
  };
    

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

  const doctorCards = [
    {
      image: Ellipse1,
      title: 'Channel a General Practitioner',
      description: 'Provides comprehensive healthcare, including routine check-ups, preventive care, and treatment for a variety of illnesses and injuries across all ages.',
      link: '/finddoctors/General Practitioner'
    },
    {
      image: Ellipse1,
      title: 'Channel a Pediatrician',
      description: 'Focuses on childrens health from birth to adolescence, including preventive healthcare and disease management. Offers expert guidance on growth, nutrition, immunization, and developmental milestones for childre',
      link: '/finddoctors/Pediatrician'
    },
    {
      image: Ellipse1,
      title: 'Channel a Cardiologist',
      description: 'Diagnoses and treats heart conditions such as heart attacks, hypertension, and arrhythmias, and provides preventive care. Offers expert guidance on growth, nutrition, immunization, and developmental milestones for childre',
      link: '/finddoctors/Cardiologist'
    },
    {
      image: Ellipse1,
      title: 'Channel a Dermatologist',
      description: 'Specializes in the treatment of skin, hair, and nail conditions like acne, eczema, and psoriasis. Offers expert guidance on growth, nutrition, milestones for childre',
      link: '"/finddoctors/Dermatologist'
    }
  ];
  const doctorCards1 = [
    {
      image: Ellipse1,
      title: 'Channel a Neurologist',
      description: 'Diagnoses and treats disorders of the nervous system, including the brain, spinal cord, nerves, and muscles, such as epilepsy, multiple sclerosis, migraines, and neurodegenerative diseases.',
      link: '/finddoctors/Neurologist'
    },
    {
      image: Ellipse1,
      title: 'Channel a Oncologist',
      description: 'Specializes in the diagnosis, treatment, and management of cancer using methods such as chemotherapy, radiation therapy, and surgery, and provides supportive care and symptom management.',
      link: '/finddoctors/Oncologist'
    },
    {
      image: Ellipse1,
      title: 'Channel a Psychiatrist',
      description: 'Diagnoses, treats, and helps prevent mental, and behavioral disorders, using a combination of medication, psychotherapy, and other treatments tailored to individual patient needs.',
      link: '/finddoctors/Psychiatrist'
    },
    {
      image: Ellipse1,
      title: 'Channel a Endocrinologist',
      description: 'Focuses on hormone-related diseases and thyroid diseases, metabolic disorders, and reproductive health issues.',
      link: '"/finddoctors/Endocrinologist'
    }];
  const doctorCards2 = [
    {
      image: Ellipse1,
      title: 'Channel a Gastroenterologist',
      description: "Diagnoses and treats disorders of the digestive system, including the stomach, intestines, and gallbladder, such as IBS, Crohn's disease, hepatitis, and ulcers.",
      link: '/finddoctors/Gastroenterologist'
    },
    {
      image: Ellipse1,
      title: 'Channel a Orthopedic Surgeon',
      description: 'Specializes in the diagnosis, treatment, and surgical repair of conditions related to the musculoskeletal system, including bones, joints, tendons, and muscles.',
      link: '/finddoctors/Orthopedic Surgeon'
    },
    {
      image: Ellipse1,
      title: 'Channel a Ophthalmologist',
      description: 'Provides medical and surgical care for eye conditions, including vision problems, cataracts, glaucoma, macular degeneration, and eye injuries.',
      link: '/finddoctors/Ophthalmologist'
    },
    {
      image: Ellipse1,
      title: 'Channel a Pulmonologist',
      description: 'Diagnoses and treats diseases of the respiratory system, including chronic conditions like asthma, COPD, and sleep-related breathing disorders.',
      link: '"/finddoctors/Pulmonologist'
    }
  ];

  return (
    <div>
      <section className='section'>
        <div className="img-container">
          <img src={Rectangle56} className="img-fluid w-100" alt="Home" style={{ objectFit: 'cover', height: 'auto', maxHeight: '100vh' }} />
        </div>
      </section>

      {/* Importing the SearchForm component */}
      <SearchForm
         searchCriteria={searchCriteria}
         handleInputChange={handleInputChange}
         handleSearchButton={handleSearchButton}
         specializationOptions={specializationOptions}
      />
      
      {/* Hide card view if data is available */}
      {!isCardViewVisible && (
        <div>
          {/* Display doctor search results in a table */}
          {doctorData.length === 0 ? (
            <div className="text-center text-danger">No results found</div>
          ) : (
            <div className='' style={{paddingTop: '136px'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Schedule ID</th>
                    <th>Doctor ID</th>
                    <th>Doctor Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor Profile</th>
                    <th>Consultation Fee</th>
                    <th>Book</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorData.map((schedule, index) => (
                    <tr key={index}>
                      <td>{schedule.schedule_id}</td>
                      <td>{schedule.doctor_id}</td>
                      <td>{schedule.doctorName}</td>
                      <td>{schedule.date}</td>
                      <td>{schedule.time}</td>
                      <td>
                        <button className="btn btn-primary">View</button>
                      </td>
                      <td>{schedule.consultationFee.toFixed(2)}</td>
                      <td>
                        {/* Book button: you can implement booking functionality here */}
                        <button className="btn btn-primary">Book</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Card view remains visible until search */}
      {isCardViewVisible && (
        <div id="card view">
          <section className='section1 py-5' style={{ background: '#C8D8F6' }}>
            <div className='container'>
              <div className='row text-center justify-content-center' style={{ marginTop: 120 }}>
                {doctorCards.map((doctor, index) => (
                  <DoctorCard key={index} {...doctor} />
                ))}
              </div>
            </div>
          </section>

          <section className='section2 py-5 bg-white'>
            <div className='container'>
              <div className='row text-center mt-3 justify-content-center'>
		            {doctorCards1.map((doctor, index) => (
                <DoctorCard key={index} {...doctor} />
                ))}
            </div>
              <div className='row text-center mt-3 justify-content-center'>
		            {doctorCards2.map((doctor, index) => (
                <DoctorCard key={index} {...doctor} />
                ))}
                
              </div>
            </div>
          </section>

          
        </div>
      )}
    </div>
  );
}

export default Doctors;
