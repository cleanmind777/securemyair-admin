/** @format */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField, Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(1, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
  createData(2, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
  createData(3, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
  createData(4, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
  createData(5, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
  createData(6, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
  createData(7, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
  createData(8, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
  createData(9, 'Casa Presidencial', 'anees@gmail.com', 124, 'action'),
];

export default function CustomizedTables() {
  return (
    <Paper>
      <div className='centerTable'>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <Typography
              variant='h5'
              pl={1}
              display={'inline'}
              sx={{ textDecoration: 'Underline', color: 'black' }}>
              CUSTOMERS
            </Typography>
            <TextField
              variant='filled'
              label='Search Customer'
              sx={{
                bgcolor: 'white',
                p: '0 !important',
              }}
            />
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Ser</StyledTableCell>
                  <StyledTableCell>Full Name</StyledTableCell>
                  <StyledTableCell>email</StyledTableCell>
                  <StyledTableCell>Cell No</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component='th' scope='row'>
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.calories}</StyledTableCell>
                    <StyledTableCell>{row.fat}</StyledTableCell>
                    <StyledTableCell>{row.carbs}</StyledTableCell>
                    <StyledTableCell>{row.protein}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Paper>
  );
}
