import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

// Styled components for TableCell and TableRow
{/*const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [&.${tableCellClasses.head}]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [&.${tableCellClasses.body}]: {
    fontSize: 14,
  },
}));*/}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        background: '#112D4E',  
      
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,borderRadius: '10px',marginBottom: '10px', 
  },
  
  '&:last-child td, &:last-child th': {
    border: 0,
    
  },
  
  
}));


// Sample data
function createData(patientId, firstName, phoneNumber, date, time, doctorId, doctorName, profileView, prescriptionId) {
  return { patientId, firstName, phoneNumber, date, time, doctorId, doctorName, profileView, prescriptionId };
}

const rows = [
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'D001', 'Jhon', 'View', 'PR001'),
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'D001', 'Jhon', 'View', 'PR001'),
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'D001', 'Jhon', 'View', 'PR001'),
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'D001', 'Jhon', 'View', 'PR001'),
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'D001', 'Jhon', 'View', 'PR001'),
];

// Main function component rendering the table
export default function CustomizedTable() {
  return (
    <div className="container mt-5 mb-5">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead >
            <TableRow >
              <StyledTableCell style={{fontWeight: 'bold'}}>Patient Id</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>First Name</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>Phone Number</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>Date</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>Time</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>Doctor Id</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>Doctor Name</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>Profile View</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>Prescription Id</StyledTableCell>
              <StyledTableCell style={{fontWeight: 'bold'}}>Details</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index} >
                <StyledTableCell >{row.patientId}</StyledTableCell>
                <StyledTableCell>{row.firstName}</StyledTableCell>
                <StyledTableCell>{row.phoneNumber}</StyledTableCell>
                <StyledTableCell>{row.date}</StyledTableCell>
                <StyledTableCell>{row.time}</StyledTableCell>
                <StyledTableCell>{row.doctorId}</StyledTableCell>
                <StyledTableCell>{row.doctorName}</StyledTableCell>
                {/*<StyledTableCell>
                    <button className='btn w-100' style={{ height: 'auto', background: '#C8D8F6', borderRadius: 14, fontSize: 'calc(12px + 0.7vw)', fontFamily: 'Sansation', fontWeight: '700', color: 'black' }}>
                    {row.profileView}
                    </button>
                </StyledTableCell>*/}
                <StyledTableCell>
                    
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
                        color: 'black',
                        backgroundColor: '#C8D8F6',
                        
                        transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
                        padding: '0 18px',
                        }}
                    >
                        View
                    </button>
                </StyledTableCell>

                <StyledTableCell>{row.prescriptionId}</StyledTableCell>
                <StyledTableCell>
                    
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
                          color: 'white',
                          backgroundColor: '#2A5D9C',
                          
                          transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
                          padding: '0 18px',
                        }}
                    >
                        Details
                    </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}