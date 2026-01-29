/** @format */

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Stack, TableRow, Alert, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CustomerContext } from '../../CustomerContext';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bold',
    fontSize: '1.7vh',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '1.7vh',
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
  '&:nth-child(n) td': {
    paddingInline: 1,
  },
}));
const RowText = ({ lable, name }) => {
  const [loading, setLoading] = useState(false);
  const { customerID } = useContext(CustomerContext);
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    setLoading(true);
    const inv = setInterval(() => {
      axios
        .get(`company/txtInput.php?id=${customerID}&name=${name}`)
        .then(res => {
          const data = res.data.res;
          if (data) {
            setUpload(data);
          } else setUpload(false);
          setLoading(false);
        })
        .catch(err => console.log(err));
    }, 1000);
    return () => {
      clearInterval(inv);
    };
  }, [customerID]);

  return (
    <StyledTableRow>
      <StyledTableCell sx={{ padding: '10px !important' }}>{lable}</StyledTableCell>
      <StyledTableCell>
        <Stack gap={0.5} direction={{ xs: 'column', sm: 'row' }}>
          {loading ? (
            'Loading...'
          ) : !upload ? (
            'Data not Updated'
          ) : (
            <Typography>{upload}</Typography>
          )}
        </Stack>
      </StyledTableCell>
      <StyledTableCell align='right'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingInline: '10px',
          }}>
          {upload ? (
            <Alert className='alert' severity='success'>
              Uploaded
            </Alert>
          ) : (
            <Alert className='alert' severity='warning'>
              Not Uploaded
            </Alert>
          )}
        </div>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default RowText;
