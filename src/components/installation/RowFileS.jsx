/** @format */

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Button, Stack, TableRow, Alert } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';
import MyDialog from '../../dialogs/MyDialog';
import { CustomerContext } from '../../CustomerContext';
import DetailDialog from '../../dialogs/DetailDialog';
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
const RowFileS = ({ lable, name }) => {
  const [dialog, setDialog] = useState({ status: false, msg: '', title: '' });
  const { customerID } = useContext(CustomerContext);
  const [status, setStatus] = useState(0);
  const [detail, setDetail] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatus = async () => {
    await axios
      .get(`company/fileInput.php?id=${customerID}&status=${name}Status`)
      .then(res => {
        setStatus(+res.data.res);
        setLoading(false);
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    setLoading(true);
    const inv = setInterval(() => {
      getStatus();
    }, 1000);
    return () => {
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
    <>
      <StyledTableRow>
        <StyledTableCell sx={{ padding: '10px !important' }}>{lable}</StyledTableCell>
        <StyledTableCell>
          <Stack gap={0.5} direction={{ xs: 'column', sm: 'row' }}>
            {loading ? (
              'Loading...'
            ) : status === 0 ? (
              'File Not Uploaded'
            ) : (
              <>
                <Button color='success' onClick={handleDownload} size='small' variant='contained'>
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
            {status === 1 ? (
              <Alert className='alert' variant='filled' color='warning' severity='info'>
                In Process
              </Alert>
            ) : status === 2 ? (
              <Alert className='alert' variant='filled' severity='success'>
                Approved
              </Alert>
            ) : status === 3 ? (
              <Alert
                className='alert'
                variant='filled'
                color='error'
                iconMapping={{
                  success: <WarningAmberIcon fontSize='inherit' />,
                }}>
                Rejected
              </Alert>
            ) : (
              <Alert className='alert' severity='warning'>
                Not Uploaded
              </Alert>
            )}
          </div>
        </StyledTableCell>
      </StyledTableRow>
      {detail && (
        <DetailDialog
          title={lable}
          name={name}
          actions={{ onClick: () => setDetail(false), color: 'primary', text: 'OK' }}
        />
      )}
      {dialog.status && (
        <MyDialog
          title={dialog.title}
          des={dialog.msg}
          actions={[{ onClick: () => setDialog({ status: false }), color: 'primary', text: 'OK' }]}
        />
      )}
    </>
  );
};

export default RowFileS;
