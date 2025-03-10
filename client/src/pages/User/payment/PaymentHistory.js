import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Loader from '../../../components/common/Loader';
import ErrorPopup from '../../../components/common/error popup/ErrorPopup';
import SuccessPopup from '../../../components/common/success popup/SuccessPopup';

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

export default function CustomizedTable() {
  const [data, setData] = useState([]); // State for table data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [open, setOpen] = useState(false); // Dialog state
  const [reason, setReason] = useState(''); // Refund reason
  const [selectedRow, setSelectedRow] = useState(null); // Selected row
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const handleErrorClose = () => setErrorVisible(false);
  const handleSuccessClose = () => setSuccessVisible(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/userpayments', {withCredentials: true}); // Replace with your API endpoint
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReason('');
  };

  const handleSend = async () => {
    if (!reason.trim()) {
      alert('Reason cannot be empty!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/refund/request', {
        paymentID: selectedRow.paymentID,
        reservationID: selectedRow.reservationID,
        reason,
      },{withCredentials: true});
      console.log('Refund request sent successfully:', response.data);
      setOpen(false);
      setReason('');
      setSuccessVisible(true)
    } catch (error) {
      console.error('Error sending refund request:', error);
      setErrorVisible(true);
    }
  };

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
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <ErrorPopup show={errorVisible} onClose={handleErrorClose} title="Something Went Wrong!" message="Refund Request Failed!" button='Okay' />
      <SuccessPopup show={successVisible} onClose={handleSuccessClose} title="Updated Success Fully " message="Refund Request Sent Successfully!" button='Okay' />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Payment Id</StyledTableCell>
              <StyledTableCell>Amount </StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Reservation Id</StyledTableCell>
              <StyledTableCell>Doctor Name</StyledTableCell>
              <StyledTableCell>Payment Descriptions</StyledTableCell>
              <StyledTableCell>Refund</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.paymentID}</StyledTableCell>
                <StyledTableCell>{row.amount}</StyledTableCell>
                <StyledTableCell>{row.datetime.split('T')[0]}</StyledTableCell>
                <StyledTableCell>{row.datetime.split('T')[1].split('.000Z')[0]}</StyledTableCell>
                <StyledTableCell>{row.reservationID}</StyledTableCell>
                <StyledTableCell>{row.doctorName}</StyledTableCell>
                <StyledTableCell>Doctor Payment</StyledTableCell>
                <StyledTableCell>
                  {row.isEligibleForRefund ?(
                    <button
                    onClick={() => handleOpen(row)}
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
                      Request
                  </button>
                  ):(
                    <p>Not Eligible for Refund</p>
                  )}
                  
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
            rows={6}
            variant="outlined"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ marginTop: '20px', fontSize: '16px' }}
          />
        </DialogContent>
        <DialogActions style={{ padding: '10px 30px' }}>
          <button
            className="btn2 btn-outline text-white"
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={handleSend}
          >
            Send
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
