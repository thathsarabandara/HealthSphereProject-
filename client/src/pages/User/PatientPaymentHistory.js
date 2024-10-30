import React from 'react';

function App() {
  const data = [
    { patientId: 'P001', firstName: 'John', phoneNumber: '123654789', date: '2022.09.19', time: '18:00:00', receiptId: 'R001', description: 'Doctor Reservations' },
    { patientId: 'P002', firstName: 'Jane', phoneNumber: '987654321', date: '2022.09.20', time: '19:00:00', receiptId: 'R002', description: 'Dental Checkup' },
    { patientId: 'P001', firstName: 'John', phoneNumber: '123654789', date: '2022.09.19', time: '18:00:00', receiptId: 'R001', description: 'Doctor Reservations' },
    { patientId: 'P002', firstName: 'Jane', phoneNumber: '987654321', date: '2022.09.20', time: '19:00:00', receiptId: 'R002', description: 'Dental Checkup' },
  ];

  return (
    <div className='container'>
      <div className="table-responsive" style={{ margin: '50px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#112D4E', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left', width: '12%' }}>Patient ID</th>
                <th style={{ padding: '10px', textAlign: 'left', width: '12%' }}>First Name</th>
                <th style={{ padding: '10px', textAlign: 'left', width: '15%' }}>Phone Number</th>
                <th style={{ padding: '10px', textAlign: 'left', width: '12%' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left', width: '12%' }}>Time</th>
                <th style={{ padding: '10px', textAlign: 'left', width: '12%' }}>Receipt ID</th>
                <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>Receipt Description</th>
                <th style={{ padding: '10px', textAlign: 'left', width: '15%' }}>Payment Receipt</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    background: index % 2 === 0 ? '#ECE6E6' : '#f4f4f4',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '15px',
                  }}
                >
                  <td style={{ padding: '10px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>{row.patientId}</td>
                  <td style={{ padding: '10px' }}>{row.firstName}</td>
                  <td style={{ padding: '10px' }}>{row.phoneNumber}</td>
                  <td style={{ padding: '10px' }}>{row.date}</td>
                  <td style={{ padding: '10px' }}>{row.time}</td>
                  <td style={{ padding: '10px' }}>{row.receiptId}</td>
                  <td style={{ padding: '10px' }}>{row.description}</td>
                  <td style={{ padding: '10px', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                    <button
                      style={{
                        display: 'inline-block',
                        outline: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                        border: '1px solid transparent',
                        borderRadius: '5px',
                        height: '36px',
                        lineHeight: '34px',
                        fontSize: '14px',
                        color: '#ffffff',
                        backgroundColor: '#2A5D9C',
                        transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
                        padding: '0 18px',
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
