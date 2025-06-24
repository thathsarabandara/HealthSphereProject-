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
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const navigate = useNavigate();
  const [data, setData] = useState([]); // State for table data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [open, setOpen] = useState(false); // Dialog state
  const [reason, setReason] = useState(''); // Refund reason
  const [selectedRow, setSelectedRow] = useState(null); // Selected row
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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

  const handleSubmitRefund = async () => {
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
      toast.success('Refund requested successfully!');
    } catch (error) {
      console.error('Error sending refund request:', error);
      toast.error('Failed to request refund.');
    }
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <div className="container mt-4" style={{ minHeight: '70vh' }}>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Payment History</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
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
            {currentItems.map((row, index) => (
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

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <li key={pageNumber} className="page-item">
              <button className="page-link" onClick={() => paginate(pageNumber + 1)}>
                {pageNumber + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </nav>

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
            onClick={handleSubmitRefund}
          >
            Send
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
