import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MedicalConditions() {
  const [allergies, setAllergies] = useState([]);
  const [bloodSugar, setBloodSugar] = useState([]);
  const [bmi, setBmi] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [heartRates, setHeartRates] = useState([]);

  // Generic fetch data function
  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(endpoint);
      setter(response.data);
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
  const handleAddRow = (setter, data) => {
    setter([...data, { status: 'active' }]); // Add a new row with active status
  };

  // Handle row update
  const handleRowChange = (index, field, value, setter, data) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setter(updatedData);
  };

  // Handle soft delete (mark as "deleted")
  const handleDeleteRow = (index, setter, data) => {
    const updatedData = [...data];
    updatedData[index].status = 'deleted';
    setter(updatedData);
  };

  // Handle save section using PUT to a specific endpoint
  const handleSaveSection = async (endpoint, data, setter) => {
    try {
      await axios.put(endpoint, data);
      alert(`${endpoint} saved successfully!`);
      // Optionally refetch data to synchronize with the backend
      fetchData(endpoint, setter);
    } catch (error) {
      console.error(`Error saving data to ${endpoint}:`, error);
    }
  };

  // Render dynamic table
  const renderDynamicTable = (sectionName, data, sectionSetter, columns, endpoint) => (
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
                    onClick={() => handleDeleteRow(index, sectionSetter, data)}
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
        onClick={() => handleAddRow(sectionSetter, data)}
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

  return (
    <div className="container mt-5 mb-5">
      <div className="card">
        <div className="card-body">
          <h3 className="text-center">Health Records</h3>
          {renderDynamicTable('Allergies', allergies, setAllergies, [
            { label: 'Allergy', field: 'name' },
            { label: 'Severity', field: 'severity' },
            { label: 'Notes', field: 'notes' },
          ], '/api/allergies')}
          {renderDynamicTable('Blood Sugar', bloodSugar, setBloodSugar, [
            { label: 'Value (mg/dL)', field: 'value', type: 'number' },
            { label: 'Date', field: 'date', type: 'date' },
          ], '/api/bloodSugar')}
          {renderDynamicTable('BMI', bmi, setBmi, [
            { label: 'BMI Value', field: 'value', type: 'number' },
            { label: 'Date', field: 'date', type: 'date' },
          ], '/api/bmi')}
          {renderDynamicTable('Conditions', conditions, setConditions, [
            { label: 'Condition', field: 'name' },
            { label: 'Notes', field: 'notes' },
          ], '/api/conditions')}
          {renderDynamicTable('Heart Rates', heartRates, setHeartRates, [
            { label: 'Heart Rate (bpm)', field: 'rate', type: 'number' },
            { label: 'Date', field: 'date', type: 'date' },
          ], '/api/heartRates')}
        </div>
      </div>
    </div>
  );
}

export default MedicalConditions;
