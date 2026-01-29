/** @format */

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Button, Stack, TableRow, Typography } from '@mui/material';
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
const GaesText = ({ lable, name, f }) => {
  const [loading, setLoading] = useState(false);
  const { customerID } = useContext(CustomerContext);
  const [data, setData] = useState(false);

  useEffect(() => {
    setLoading(true);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get(`gaes/txtInput.php?id=${customerID}&name=${name}`, {
        cancelToken: source.token,
      })
      .then(res => {
        const data = res.data.res;
        if (data) {
          setData(data);
        } else setData(false);
        setLoading(false);
      })
      .catch(err => console.log(err));
    return () => source.cancel();
  }, [customerID]);
  const handleDownload = () => {
    const url = `${axios.defaults.baseURL}gaes/${data}`;
    const fileName = url.split('/').pop();
    const aTag = document.createElement('a');
    aTag.href = url;
    aTag.download = fileName;
    aTag.target = '_blank';
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };
  return (
    <StyledTableRow>
      <StyledTableCell sx={{ padding: '10px !important' }}>{lable}</StyledTableCell>
      <StyledTableCell>
        <Stack gap={0.5} direction={{ xs: 'column', sm: 'row' }}>
          {loading ? (
            'Loading...'
          ) : !data ? (
            'Data not updated'
          ) : f === true ? (
            <Button variant='contained' onClick={handleDownload}>
              Download
            </Button>
          ) : (
            <Typography>{data}</Typography>
          )}
        </Stack>
      </StyledTableCell>
      <StyledTableCell align='right'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingInline: '10px',
          }}></div>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default GaesText;
