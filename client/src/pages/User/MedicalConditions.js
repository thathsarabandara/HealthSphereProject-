import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';
import ErrorPopup from '../../components/common/error popup/ErrorPopup';
import SuccessPopup from '../../components/common/success popup/SuccessPopup';

function MedicalConditions() {
  const [allergies, setAllergies] = useState([]);
  const [bloodSugar, setBloodSugar] = useState([]);
  const [bmi, setBmi] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [heartRates, setHeartRates] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [deleteerrorVisible, setdeleteErrorVisible] = useState(false);
  const [deletesuccessVisible, setdeleteSuccessVisible] = useState(false);
  const handledeleteErrorClose = () => setdeleteErrorVisible(false);
  const handledeleteSuccessClose = () => setdeleteSuccessVisible(false);
  const handleErrorClose = () => setErrorVisible(false);
  const handleSuccessClose = () => setSuccessVisible(false);

  // Generic fetch data function
  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(endpoint, {withCredentials:true});
      const data = response.data.map((item) => {
        if (item.measurement_date) {
          // Convert date to YYYY-MM-DD
          item.measurement_date = new Date(item.measurement_date).toISOString().split('T')[0];
        }
        if (item.measurement_time) {
          // Convert datetime to YYYY-MM-DDTHH:MM
          item.measurement_time = new Date(item.measurement_time).toISOString().slice(0, 16);
        }
        if (item.diagnosis_date) {
          // Convert to YYYY-MM-DD
          item.diagnosis_date = new Date(item.diagnosis_date).toISOString().split('T')[0];
        }  
        return item;
      });  
      setter(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    fetchData('http://localhost:5000/allergies', setAllergies);
    fetchData('http://localhost:5000/bloodSugar', setBloodSugar);
    fetchData('http://localhost:5000/bmi', setBmi);
    fetchData('http://localhost:5000/conditions', setConditions);
    fetchData('http://localhost:5000/heartRates', setHeartRates);
  }, []);

  // Handle row addition
  const handleAddRow = (setter, defaultData) => {
    setter((prevData) => [...prevData, defaultData]);
  };

  // Handle row update
  const handleRowChange = (index, field, value, setter, data) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setter(updatedData);
  };

  // Handle save section using PUT to a specific endpoint
  const handleSaveSection = async (endpoint, data, setter) => {
    console.log(endpoint, data, setter);
    try {
      const newRows = data.filter((row) => !row.id); // New rows
      const existingRows = data.filter((row) => row.id); // Existing rows
      console.log(newRows);
      // Create new rows
      if (newRows.length > 0) {
        console.log('hi');
        await axios.post(endpoint, newRows, {withCredentials: true}); // POST for new rows
      }
  
      alert('Data saved successfully!');
      fetchData(endpoint, setter); // Refresh data
    } catch (error) {
      console.error(`Error saving data to ${endpoint}:`, error);
      alert('Failed to save data.');
    }
  };
  
  

  const handleDeleteRow = async (index, setter, data, endpoint) => {
    const rowToDelete = data[index];
    try {
      // Sending the ID and status update to the backend
      await axios.put(endpoint, { id: rowToDelete.id, status: 'deleted' });
  
      // Update frontend state after successful backend update
      const updatedData = [...data];
      updatedData[index].status = 'deleted';
      setter(updatedData);
  
      setdeleteSuccessVisible(true);
    } catch (error) {
      console.error('Error deleting row:', error);
      setdeleteErrorVisible(true);
    }
  };
  
  // Render dynamic table
  const renderDynamicTable = (sectionName, data, sectionSetter, columns, endpoint, defaultRow) => (
    <div className="mb-4">
      <h5>{sectionName}</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.field}>
                    <input
                      type={col.type || 'text'}
                      className="form-control form-control-sm"
                      value={row[col.field] || ''}
                      onChange={(e) =>
                        handleRowChange(index, col.field, e.target.value, sectionSetter, data)
                      }
                    />
                  </td>
                ))}
                <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteRow(index, sectionSetter, data, endpoint)}
                >
                  Delete
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => handleAddRow(sectionSetter, defaultRow)}
      >
        Add Row
      </button>
      <button
        className="btn btn-success btn-sm ms-2"
        onClick={() => handleSaveSection(endpoint, data, sectionSetter)}
      >
        Save {sectionName}
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f4f8',
          zIndex: 9999,
        }}
      >
        <Loader />
      </div>
    );}

  return (
    <div className="container mt-5 mb-5">
      <ErrorPopup show={errorVisible} onClose={handleErrorClose} title="Something Went Wrong!" message="Failed to save data." button='Okay' />
      <SuccessPopup show={successVisible} onClose={handleSuccessClose} title="Updated Success Fully " message="Data saved successfully!" button='Okay' />
      <ErrorPopup show={deleteerrorVisible} onClose={handledeleteErrorClose} title="Something Went Wrong!" message="Failed to delete row!" button='Okay' />
      <SuccessPopup show={deletesuccessVisible} onClose={handledeleteSuccessClose} title="Updated Success Fully " message="Row deleted successfully!" button='Okay' />
      <div className="card">
        <div className="card-body">
          <h3 className="text-center">Health Records</h3>
          {renderDynamicTable(
            'Allergies',
            allergies,
            setAllergies,
            [
              { label: 'Allergy Name', field: 'allergy_name' },
              { label: 'Allergy Type', field: 'allergy_type' },
              { label: 'Severity', field: 'severity' },
              { label: 'Description', field: 'description' },
            ],
            'http://localhost:5000/allergies',
            { allergy_name: '', allergy_type: '', severity: '', description: '', status: 'active' }
          )}
          {renderDynamicTable(
            'Blood Sugar',
            bloodSugar,
            setBloodSugar,
            [
              { label: 'Blood Sugar Level (mg/dL)', field: 'blood_sugar_level', type: 'number' },
              { label: 'Measurement Time', field: 'measurement_time', type: 'datetime-local' },
              { label: 'Notes', field: 'notes' },
            ],
            'http://localhost:5000/bloodSugar',
            { blood_sugar_level: 0, measurement_time: '', notes: '', status: 'active' }
          )}
          {renderDynamicTable(
            'BMI',
            bmi,
            setBmi,
            [
              { label: 'BMI Value', field: 'bmi_value', type: 'number' },
              { label: 'Height (cm)', field: 'height', type: 'number' },
              { label: 'Weight (kg)', field: 'weight', type: 'number' },
              { label: 'Measurement Date', field: 'measurement_date', type: 'date' },
              { label: 'Notes', field: 'notes' },
            ],
            'http://localhost:5000/bmi',
            { bmi_value: 0, height: 0, weight: 0, measurement_date: '', notes: '', status: 'active' }
          )}
          {renderDynamicTable(
            'Conditions',
            conditions,
            setConditions,
            [
              { label: 'Condition Name', field: 'condition_name' },
              { label: 'Severity', field: 'severity' },
              { label: 'Diagnosis Date', field: 'diagnosis_date', type: 'date' },
              { label: 'Notes', field: 'notes' },
            ],
            'http://localhost:5000/conditions',
            { condition_name: '', severity: 'mild', diagnosis_date: '', notes: '', status: 'active' }
          )}
          {renderDynamicTable(
            'Heart Rates',
            heartRates,
            setHeartRates,
            [
              { label: 'Heart Rate (bpm)', field: 'heart_rate', type: 'number' },
              { label: 'Measurement Time', field: 'measurement_time', type: 'datetime-local' },
              { label: 'Notes', field: 'notes' },
            ],
            'http://localhost:5000/heartRates',
            { heart_rate: 0, measurement_time: '', notes: '', status: 'active' }
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalConditions;
