import React from 'react'

function SearchForm({ searchCriteria, handleInputChange, handleSearchButton, specializationOptions }) {
  return (
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
                style={{ width: 520, height: 53 }} 
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
                style={{ width: 305, height: 53 }} 
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
              <input 
                type="time" 
                name="sessionTime" 
                className="form-input form-control" 
                style={{ width: 305, height: 53 }} 
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
                style={{ width: 305, height: 53 }} 
                value={searchCriteria.date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col">
            <button className="btn" style={{ width: 196, height: 53, background: '#2A5D9C', borderRadius: 13, marginTop: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none' }} type="submit">
              <span className="text-white" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400', wordWrap: 'break-word', background: '#2A5D9C' }}>
                Search
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchForm
