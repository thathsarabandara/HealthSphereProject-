import React from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

function ScheduleRequest() {
  return (
    <div className="container my-5">
      {/* Request for Schedule Section */}
      <h3 className="mb-4">Request for Schedule</h3>
      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Date</label>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Enter date" />
              <span className="input-group-text"><FaCalendarAlt /></span>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Time</label>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Enter time" />
              <span className="input-group-text"><FaClock /></span>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea className="form-control" rows="3" placeholder="Enter your comments here"></textarea>
        </div>
        <button type="submit" className="btn btn-success">Request</button>
      </form>

      {/* Upcoming Schedules Section */}
      <h3 className="mt-5">Upcoming Schedules</h3>
      
      {/* Schedule Table1 */}
      <div className="table-responsive mt-3" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        <table className="table table-bordered">
          <thead className="text-white" style={{ backgroundColor: '#012A5C' }}>
            <tr>
              <th style={{ width: '25%',background: '#112D4E',color: 'white', textAlign: 'center', verticalAlign: 'middle'  }}>Schedule Details</th>
              <th style={{ background: '#112D4E',color: 'white', textAlign: 'center', verticalAlign: 'middle'  }}>Appointment No</th>
              <th style={{ background: '#112D4E',color: 'white', textAlign: 'center', verticalAlign: 'middle'  }}>Patient Name</th>
              <th style={{ background: '#112D4E',color: 'white', textAlign: 'center', verticalAlign: 'middle'  }}>Profile</th>
              
            </tr>
          </thead>
          <tbody>
            {/* Merged First Column */}
            <tr>
              <td rowSpan="5">
                <div><strong>Schedule Time:</strong> 8:30 AM</div>
                <div><strong>Platform:</strong> Physical</div>
                <div><strong>No of Appointments:</strong> 15</div>
                <button className="btn btn-danger btn-sm mt-2">Cancel schedule</button>
              </td>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}>01</td>
              <td>Soma Withana</td>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
            </tr>
            <tr>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}>02</td>
              <td>W. Premasiri</td>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn  btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
            </tr>
            <tr>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}>03</td>
              <td>James Watt</td>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
            </tr>
            <tr>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}>04</td>
              <td>Percy Blair</td>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
            </tr>
            <tr>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}>05</td>
              <td>Paul Newman</td>
              <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
            </tr>
          </tbody>
        </table>
      </div>

          {/* Schedule Table2 */}
      <div className="table-responsive mt-3" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
      <table className="table table-bordered">
        <thead className="text-white" style={{ backgroundColor: '#012A5C' }}>
          <tr>
            <th style={{ width: '25%',background: '#112D4E',color: 'white', textAlign: 'center', verticalAlign: 'middle'  }}>Schedule Details</th>
            <th style={{ background: '#112D4E',color: 'white', textAlign: 'center', verticalAlign: 'middle'  }}>Appointment No</th>
            <th style={{ background: '#112D4E',color: 'white', textAlign: 'center', verticalAlign: 'middle'  }}>Patient Name</th>
            <th style={{ background: '#112D4E',color: 'white', textAlign: 'center', verticalAlign: 'middle'  }}>Profile</th>
          </tr>
        </thead>
        <tbody>
          {/* Merged First Column */}
          <tr>
            <td rowSpan="5">
              <div><strong>Schedule Time:</strong> 8:30 AM</div>
              <div><strong>Platform:</strong> Physical</div>
              <div><strong>No of Appointments:</strong> 15</div>
              <button className="btn btn-danger btn-sm mt-2">Cancel schedule</button>
            </td>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}>01</td>
            <td>Soma Withana</td>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
          </tr>
          <tr>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}>02</td>
            <td>W. Premasiri</td>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
          </tr>
          <tr>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}>03</td>
            <td>James Watt</td>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
          </tr>
          <tr>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}>04</td>
            <td>Percy Blair</td>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
          </tr>
          <tr>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}>05</td>
            <td>Paul Newman</td>
            <td style={{textAlign: 'center', verticalAlign: 'middle' }}><button className="btn btn-sm" style={{background: '#C8D8F6'}}>View</button></td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default ScheduleRequest;

