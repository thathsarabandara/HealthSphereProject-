import React, { useState, useEffect } from 'react';
import Rectangle56 from '../../assets/images/Rectangle 56.svg'
import Ellipse1 from '../../assets/images/Ellipse 1.svg'
import '../../styles/Doctors.css'
import axios from 'axios';
import Loader from '../../components/common/Loader';

function PatientDoctors() {
  const [isLoading, setIsLoading] = useState(true);
  const [doctorData, setDoctorData] = useState([]);
  const [isCardViewVisible, setIsCardViewVisible] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({
    doctorName: '',
    specialization: '',
    sessionTime: '',
    date: ''
  });

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

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

  function handleSearchButton(event) {
    setIsLoading(true)
    event.preventDefault();

    // Prepare the search criteria for the API call
    const searchData = {
      doctorName: searchCriteria.doctorName || null,
      specialization: searchCriteria.specialization || null,
      sessionTime: searchCriteria.sessionTime || null,
      sessionDate: searchCriteria.date || null
    };

    // Fetch data from backend based on search criteria
     axios.post('http://localhost:5000/finddoctor', {searchData})
      .then(response => {
        if (response.data.length === 0) {
          // If no data is returned, show no results found
          setDoctorData([]);
          setIsLoading(false)
        } else {
          setDoctorData(response.data);
        }
        setIsCardViewVisible(false); // Hide card view after fetching data
      })
      .catch(error => {
        console.error('There was an error fetching doctor data:', error);
      });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value
    });
  }

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

  return (
    <div>
      <section className='section'>
        <div className="img-container">
          <img src={Rectangle56} className="img-fluid w-100" alt="Home" style={{ objectFit: 'cover', height: 'auto', maxHeight: '100vh' }} />
        </div>
      </section>

      <div className="position-absolute start-50 translate-middle text-center search-form-container">
          <form method="POST" onSubmit={handleSearchButton}>
            {/* First row: Doctor Name and Specialization */}
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="doctorName" className="label-class">Doctor name</label>
                  <input 
                      type="text" 
                      name="doctorName" 
                      className="form-input form-control" 
                      placeholder="Search Doctor Name" 
                      style={{width: 520, height: 53}} 
                      value={searchCriteria.doctorName}
                      onChange={handleInputChange}
                      />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="specialization" className="label-class">Specialization</label>
                  <select 
                      name="specialization" 
                      className="form-input form-control" 
                      placeholder="Select Specialization" 
                      style={{width: 305, height: 53}} 
                      value={searchCriteria.specialization}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Specialization</option>
                      {specializationOptions.map((specialization, index) => (
                        <option key={index} value={specialization.value}>{specialization.label}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Second row: Session Time, Date, and Search Button */}
            <div className="row mt-3">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="sessionTime" className="label-class">Session Time</label>
                  <input type="time" 
                    name="sessionTime" 
                    className="form-input form-control" 
                    placeholder="Enter Session Time" 
                    style={{width: 305, height: 53}} 
                    value={searchCriteria.sessionTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="date" className="label-class">Date</label>
                  <input 
                      type="date" 
                      name="date" 
                      className="form-input form-control" 
                      placeholder="YY / MM / DD" 
                      style={{width: 305, height: 53}} 
                      value={searchCriteria.date}
                      onChange={handleInputChange}
                    />
                </div>
              </div>
              <div className="col">
                <button className="btn" style={{ width: 196, height: 53, background: '#2A5D9C', borderRadius: 13, marginTop: '32px',display: 'flex', justifyContent: 'center',alignItems: 'center', border: 'none' }} type="submit">
                  <span className="text-white" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400', wordWrap: 'break-word', background: '#2A5D9C' }}>
                    Search
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      
      {/* Hide card view if data is available */}
      {!isCardViewVisible && (
        <div>
          {/* Display doctor search results in a table */}
          {doctorData.length === 0 ? (
            <div className="text-center text-danger">No results found</div>
          ) : (
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
          )}
        </div>
      )}

      {/* Card view remains visible until search */}
      {isCardViewVisible && (
        <div id="card view">
          <section className='section1 py-5' style={{ background: '#C8D8F6' }}>
            <div className='container'>
              <div className='row text-center  justify-content-center' style={{marginTop: 120}}>

                {/* General Practitioner Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5 " style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C'}}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="General Practitioner" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a General <br /> Practitioner
                      </div>
                      <div className="text-white mb-1" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Provides comprehensive healthcare, including routine check-ups, preventive care, and treatment for a variety of illnesses and injuries across all ages.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/General Practitioner" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pediatrician Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5 " style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C' }}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Pediatrician" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Pediatrician
                      </div>
                      <div className="text-white mb-3" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Focuses on the health of children from birth to adolescence, including preventive healthcare and chronic disease management.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Pediatrician" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cardiologist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5 " style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C' }}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Cardiologist" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Cardiologist
                      </div>
                      <div className="text-white mb-3" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Diagnoses and treats heart conditions such as heart attacks, hypertension, and arrhythmias, and provides preventive care.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Cardiologist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dermatologist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5" style={{width: 197, height: 243,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C'}}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Dermatologist" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Dermatologist
                      </div>
                      <div className="text-white mb-4" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Specializes in the treatment of skin, hair, and nail conditions like acne, eczema, and psoriasis.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Dermatologist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='section2 py-5 bg-white'>
            <div className='container'>
              <div className='row text-center mt-3 justify-content-center'>


                {/* Neurologist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5" style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C'}}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="General Practitioner" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a  <br /> Neurologist
                      </div>
                      <div className="text-white mb-1" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Diagnoses and treats disorders of the nervous system, including the brain, spinal cord, nerves, and muscles, such as epilepsy, multiple sclerosis, migraines, and neurodegenerative diseases.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Neurologist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Oncologist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5" style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C' }}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Pediatrician" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Oncologist
                      </div>
                      <div className="text-white mb-1" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Specializes in the diagnosis, treatment, and management of cancer using methods such as chemotherapy, radiation therapy, and surgery, and provides supportive care and symptom management.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Oncologist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Psychiatrist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5  " style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C' }}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Cardiologist" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Psychiatrist
                      </div>
                      <div className="text-white mb-1" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Diagnoses, treats, and helps prevent mental, emotional, and behavioral disorders, using a combination of medication, psychotherapy, and other treatments tailored to individual patient needs.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Psychiatrist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Endocrinologist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5 " style={{width: 197, height: 243,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C'}}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Dermatologist" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Endocrinologist
                      </div>
                      <div className="text-white mb-3" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Focuses on hormone-related diseases and disorders, including diabetes, thyroid diseases, metabolic disorders, osteoporosis, and reproductive health issues.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Endocrinologist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row text-center mt-3 justify-content-center'>

                {/* Gastroenterologist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5" style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C'}}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="General Practitioner" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a General <br /> Gastroenterologist
                      </div>
                      <div className="text-white mb-2" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Diagnoses and treats disorders of the digestive system, including the stomach, intestines, liver, pancreas, and gallbladder, such as IBS, Crohn's disease, hepatitis, and ulcers.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Gastroenterologist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orthopedic Surgeon Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5 " style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C' }}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Pediatrician" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Orthopedic Surgeon
                      </div>
                      <div className="text-white mb-2" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Specializes in the diagnosis, treatment, and surgical repair of conditions related to the musculoskeletal system, including bones, joints, tendons, and muscles.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Orthopedic Surgeon" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ophthalmologist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5 " style={{width: 197, height: 273,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C' }}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Cardiologist" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Ophthalmologist
                      </div>
                      <div className="text-white mb-2" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Provides medical and surgical care for eye conditions, including vision problems, cataracts, glaucoma, macular degeneration, and eye injuries.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Ophthalmologist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pulmonologist Card */}
                <div className="col-12 col-md-12 col-lg-6 mb-5" style={{width: 197, height: 243,  borderRadius: 8}}>
                  <div className="card text-center shadow" style={{ background: '#2A5D9C'}}>
                    <div className="card-body">
                      <img 
                        src={Ellipse1} 
                        alt="Dermatologist" 
                        className="rounded-circle mb-1" 
                        style={{ width: 94, height: 94 }} 
                      />
                      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Channel a <br /> Pulmonologist
                      </div>
                      <div className="text-white mb-2" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
                        Diagnoses and treats diseases of the respiratory system, including chronic conditions like asthma, COPD, lung infections, and sleep-related breathing disorders.
                      </div>
                      <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                        <a href="/finddoctors/Pulmonologist" style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
                          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                            Book
                          </span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default PatientDoctors;
