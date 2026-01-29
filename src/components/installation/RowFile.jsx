/** @format */

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Button, Stack, TableRow, Alert } from '@mui/material';
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
const RowFile = ({ lable, name }) => {
  const { customerID } = useContext(CustomerContext);
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    setLoading(true);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const inv = setInterval(() => {
      axios
        .get(`company/fileInput.php?id=${customerID}&name=${name}`, { cancelToken: source.token })
        .then(res => {
          const data = res.data.res;
          if (data) {
            setUpload(true);
          } else setUpload(false);
          setLoading(false);
        })
        .catch(err => console.log(err));
    }, 1000);
    return () => {
      source.cancel();
      clearInterval(inv);
    };
  }, [customerID]);

  const handleDownload = async () => {
    await axios
      .get(`inspector/action.php?id=${customerID}&action=1&name=${name}`)
      .then(res => {
        const url = `${axios.defaults.baseURL}/../company/${res.data.res}`;
        const fileName = url.split('/').pop();
        const aTag = document.createElement('a');
        aTag.href = url;
        aTag.download = fileName;
        aTag.target = '_blank';
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
      })
      .catch(err => console.log(err));
  };
  return (
    <StyledTableRow>
      <StyledTableCell sx={{ paddingRight: '10px !important' }}>{lable}</StyledTableCell>
      <StyledTableCell>
        <Stack gap={0.5} direction={{ xs: 'column', sm: 'row' }}>
          {loading ? (
            'Loading...'
          ) : !upload ? (
            'File not uploaded'
          ) : (
            <>
              <Button onClick={handleDownload} size='small' variant='contained'>
                Download
              </Button>
            </>
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

export default RowFile;
