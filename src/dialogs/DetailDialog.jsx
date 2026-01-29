/** @format */

import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import axios from 'axios';
import { CustomerContext } from '../CustomerContext';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
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
export default function DetailDialog({ title, name, actions }) {
  const { customerID,setCustomerID } = React.useContext(CustomerContext);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(true);
  const token = localStorage.getItem("authToken");
const navigate = useNavigate();

  React.useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    axios
      .get(`fieldHistory.php?cid=${customerID}&file=${name}`, 
      { signal: source.cancelToken,headers:{Authorization:token} })
      .then(res => {
        if (res.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        setData(res.data);
      })
      .catch(err => console.log(err));
    return () => source.cancel();
  }, []);
  const handleClose = () => {
    actions.onClick();
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align='center'>Sr.</StyledTableCell>
                  <StyledTableCell align='center'>Detail</StyledTableCell>
                  <StyledTableCell>Update Time</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => {
                  return (
                    <StyledTableRow key={Math.random()}>
                      <StyledTableCell align='center'>{index + 1}</StyledTableCell>
                      <StyledTableCell align='center'>{row.detail}</StyledTableCell>
                      <StyledTableCell>{row.time}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            key={actions.text}
            onClick={actions.onClick}
            variant='contained'
            color={actions.color}
            sx={{ maxWidth: 200 }}>
            {actions.text}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
