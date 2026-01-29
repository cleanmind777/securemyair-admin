/** @format */

import React, { useContext, useEffect, useState } from 'react';
import { CustomerContext } from '../../CustomerContext';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ErrorsHistory = () => {
  const [reset, setReset] = useState(true);
  const [rows, setRows] = useState([{ phone: 'Loading...', email: 'Loading...' }]);
  const { customerID,setCustomerID } = useContext(CustomerContext);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`errors/history.php?cid=${customerID}`,{ headers: { Authorization: token }})
      .then(res => {
         if(res.data.error === "Expired token"){
         localStorage.clear();
         setCustomerID(null);
         navigate("/login");
        }
        if (res.data.res) {
          setRows([]);
        } else {
          setRows(res.data);
        }
      })
      .catch(err => console.log(err));
  }, [customerID, reset]);
  const handleClear = async () => {
    await axios
      .get(`errors/history.php?cid=${customerID}&clear=true`,{ headers: { Authorization: token }})
      .then(res => {
         if(res.data.error === "Expired token"){
         localStorage.clear();
         setCustomerID(null);
         navigate("/login");
        }
        setReset(pre => !pre);
      })
      .catch(err => console.log(err));
  };
  return (
    <>
      {rows.length > 1 ? (
        <>
          <Button
            size='large'
            variant='contained'
            sx={{ fontSize: 20, m: 1 }}
            onClick={handleClear}>
            Clear Error History
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Error Name</StyledTableCell>
                  <StyledTableCell>Time of Occurence</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <StyledTableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.time}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography
          sx={{
            paddingBlock: 2,
            color: 'rgba(0,0,0,0.8)',
            border: '2px solid black',
            borderRadius: 2,
          }}>
          No Error found
        </Typography>
      )}

      <Typography fontWeight='bold' sx={{ display: 'inline' }}>
        Customer Phone:
      </Typography>
      <span>{rows[rows.length - 1].phone || ''}</span>
      <br />
      <Typography fontWeight='bold' sx={{ display: 'inline' }}>
        Customer Email:
      </Typography>
      <span>{rows[rows.length - 1].email || ''}</span>
    </>
  );
};

export default ErrorsHistory;
