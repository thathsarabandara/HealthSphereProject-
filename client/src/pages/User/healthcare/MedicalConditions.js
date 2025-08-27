import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../../components/common/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MedicalConditions() {
  const [allergies, setAllergies] = useState([]);
  const [bloodSugar, setBloodSugar] = useState([]);
  const [bmi, setBmi] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [heartRates, setHeartRates] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const showToast = (type, message) => {
    if (type === 'success') {
      toast.success(message, {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } else if (type === 'error') {
      toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        theme: 'colored',
      });
    }
  };

  // Format date to YYYY-MM-DD for date inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Check if date is valid
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  // Format time to HH:MM for time inputs
  const formatTimeForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Check if date is valid
      return date.toTimeString().slice(0, 5);
    } catch (e) {
      console.error('Error formatting time:', e);
      return '';
    }
  };
  
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };
  
  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  // Generic fetch data function
  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(endpoint, {withCredentials:true});
      const data = response.data.map((item) => {
        // Create a new object to avoid mutating the original
        const formattedItem = {...item};
        
        // Format dates and times for input fields
        if (formattedItem.measurement_date) {
          formattedItem.measurement_date = formatDateForInput(formattedItem.measurement_date);
        }
        if (formattedItem.measurement_time) {
          formattedItem.measurement_time = formatTimeForInput(formattedItem.measurement_time);
        }
        if (formattedItem.diagnosis_date) {
          formattedItem.diagnosis_date = formatDateForInput(formattedItem.diagnosis_date);
        }
        return formattedItem;
      });
      setter(data);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      showToast('error', `Failed to fetch ${endpoint.split('/').pop()} data`);
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
    const row = updatedData[index];
    
    // Only update if the value has actually changed
    if (row[field] !== value) {
      updatedData[index][field] = value;
      setter(updatedData);
    }
  };

  // Handle save section using PUT to a specific endpoint
  const handleSaveSection = async (endpoint, data, setter) => {
    try {
      const newRows = data.filter((row) => !row.id); // New rows
      const existingRows = data.filter((row) => row.id); // Existing rows
      
      // Create new rows
      if (newRows.length > 0) {
        const response = await axios.post(endpoint, newRows, {withCredentials: true});
        
        // Log the response for debugging
        console.log('Create response:', response.data);
        
        // Handle the server response format: { message, createdData }
        const createdData = response.data.createdData || [];
        if (!Array.isArray(createdData)) {
          throw new Error('Invalid response format from server');
        }
        
        // Update local state with new data
        const updatedData = [...existingRows, ...createdData];
        setter(updatedData);
        
        showToast('success', `${createdData.length} record(s) created successfully!`);
      }

      // Update existing rows
      // if (existingRows.length > 0) {
      //   const updates = existingRows.map(row => ({
      //     id: row.id,
      //     ...Object.fromEntries(
      //       Object.entries(row).filter(([key]) => 
      //         key !== 'id' && key !== 'patient_id' && key !== 'status' && key !== 'createdAt' && key !== 'updatedAt'
      //       )
      //     )
      //   }));
        
      //   const response = await axios.put(endpoint, updates, {withCredentials: true});
      //   const updatedData = Array.isArray(response.data) ? response.data : [response.data];
        
      //   // Update local state with updated data
      //   const finalData = data.map(row => 
      //     row.id ? 
      //       updatedData.find(updated => updated.id === row.id) || row : 
      //       row
      //   );
      //   setter(finalData);
        
      //   showToast('success', `${existingRows.length} record(s) updated successfully!`);
      // }
    } catch (error) {
      console.error(`Error saving data to ${endpoint}:`, error);
      showToast('error', error.response?.data?.message || 'Failed to save data.');
    }
  };
  
  

  const handleDeleteRow = async (index, setter, data, endpoint) => {
    const rowToDelete = data[index];
    try {
      // Optimistically update the UI
      const updatedData = data.filter((_, i) => i !== index);
      setter(updatedData);
      
      // Send just the ID in the request body
      await axios.put(
        endpoint, 
        { id: rowToDelete.id }, 
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      
      showToast('success', 'Record deleted successfully!');
    } catch (error) {
      // Revert on error
      setter(data);
      console.error('Delete error:', error);
      showToast('error', error.response?.data?.message || 'Failed to delete record');
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
                      value={row[col.field] !== undefined ? row[col.field] : (col.defaultValue || '')}
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
      <div className="card">
        <ToastContainer />
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
              { 
                label: 'Measurement Date', 
                field: 'measurement_date', 
                type: 'date',
                defaultValue: getCurrentDate()
              },
              { 
                label: 'Measurement Time', 
                field: 'measurement_time', 
                type: 'time',
                defaultValue: getCurrentTime()
              },
              { label: 'Notes', field: 'notes' },
            ],
            'http://localhost:5000/bloodSugar',
            { 
              blood_sugar_level: 0, 
              measurement_date: getCurrentDate(), 
              measurement_time: getCurrentTime(), 
              notes: '', 
              status: 'active' 
            }
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
            { 
              bmi_value: 0, 
              height: 0, 
              weight: 0, 
              measurement_date: formatDateForInput(new Date()), 
              notes: '', 
              status: 'active' 
            }
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
              { label: 'Measurement Date', field: 'measurement_date', type: 'date' },
              { label: 'Measurement Time', field: 'measurement_time', type: 'time' },
              { label: 'Notes', field: 'notes' },
            ],
            'http://localhost:5000/heartRates',
            { 
              heart_rate: 0, 
              measurement_date: formatDateForInput(new Date()),
              measurement_time: formatTimeForInput(new Date()), 
              notes: '', 
              status: 'active' 
            }
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalConditions;
