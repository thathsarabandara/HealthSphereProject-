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

export default function CustomizedTable() {
  const [data, setData] = useState([]); // State for table data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/refund', {withCredentials: true}); // Replace with your API endpoint
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Payment Id</StyledTableCell>
              <StyledTableCell>Payment Date</StyledTableCell>
              <StyledTableCell>Payment Time</StyledTableCell>
              <StyledTableCell>Payment Amount</StyledTableCell>
              <StyledTableCell>Refund Id</StyledTableCell>            
              <StyledTableCell>Request Date</StyledTableCell>
              <StyledTableCell>Request Time</StyledTableCell>
              <StyledTableCell>Refund Reason</StyledTableCell>
              <StyledTableCell>Refund Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.paymentId}</StyledTableCell>
                <StyledTableCell>{row.paymentDate}</StyledTableCell>
                <StyledTableCell>{row.paymentTime}</StyledTableCell>
                <StyledTableCell>{row.paymentAmount}</StyledTableCell>
                <StyledTableCell>{row.refundId}</StyledTableCell>
                <StyledTableCell>{row.refundRequestDate}</StyledTableCell>
                <StyledTableCell>{row.refundRequestTime}</StyledTableCell>
                <StyledTableCell>{row.refundReason}</StyledTableCell>
                <StyledTableCell>{row.refundStatus}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
