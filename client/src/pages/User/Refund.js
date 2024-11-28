import React, { useState , useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Loader from '../../components/common/Loader';

const StyledTableCell = styled(TableCell)(({ theme }) => ({

  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#112D4E',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Sample data
function createData(patientId, firstName, phoneNumber, date, time, receiptId, description, paymentView, refundRequest) {
  return { patientId, firstName, phoneNumber, date, time, receiptId, description, paymentView, refundRequest };
}

const rows = [
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'R001', 'Doctor Reservations', 'View', 'Request'),
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'R001', 'Doctor Reservations', 'View', 'Request'),
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'R001', 'Doctor Reservations', 'View', 'Request'),
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'R001', 'Doctor Reservations', 'View', 'Request'),
  createData('P001', 'John', '123654789', '2022.09.19', '18:00:00', 'R001', 'Doctor Reservations', 'View', 'Request'),
];

export default function CustomizedTable() {
  
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

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

  const handleSend = () => {
    console.log("Refund reason:", reason);
    // Add functionality here to process the refund request
    setOpen(false);
  };

  return (
    <div className="container mt-5 mb-5">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Patient Id</StyledTableCell>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Receipt ID</StyledTableCell>
              <StyledTableCell>Receipt Descriptions</StyledTableCell>
              <StyledTableCell>Payment Receipt</StyledTableCell>
              <StyledTableCell>Refund</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.patientId}</StyledTableCell>
                <StyledTableCell>{row.firstName}</StyledTableCell>
                <StyledTableCell>{row.phoneNumber}</StyledTableCell>
                <StyledTableCell>{row.date}</StyledTableCell>
                <StyledTableCell>{row.time}</StyledTableCell>
                <StyledTableCell>{row.receiptId}</StyledTableCell>
                <StyledTableCell>{row.description}</StyledTableCell>
                <StyledTableCell>
                  <button
                    style={{
                      backgroundColor: '#C8D8F6',
                      color: 'black',
                      fontWeight: 500,
                      border: 'none',
                      borderRadius: '14px',
                      padding: '6px 16px',
                      cursor: 'pointer',
                    }}
                  >
                    {row.paymentView}
                  </button>
                </StyledTableCell>
                <StyledTableCell>
                  <button
                    onClick={handleOpen}
                    style={{
                      backgroundColor: '#27AE60',
                      color: 'white',
                      fontWeight: 500,
                      border: 'none',
                      borderRadius: '14px',
                      padding: '6px 16px',
                      cursor: 'pointer',
                    }}
                  >
                    {row.refundRequest}
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Refund Request Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
  <DialogTitle style={{ fontWeight: 'bold', fontSize: '24px' }}>Refund Request</DialogTitle>
  <DialogContent style={{ padding: '20px 30px' }}>
    <TextField
      label="Reason:"
      multiline
      rows={6} // Increase rows to make the textarea taller
      variant="outlined"
      fullWidth
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      style={{ marginTop: '20px', fontSize: '16px' }}
    />
  </DialogContent>
  <DialogActions style={{ padding: '10px 30px' }}>
    
    <button className='btn2 btn-outline text-white' style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleSend} variant="contained">
      send
    </button>
  </DialogActions>
</Dialog>

    </div>
  );
}

