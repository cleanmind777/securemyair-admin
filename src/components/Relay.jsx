/** @format */

import { Button, ListItem, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import React from 'react';
const circleStyle = {
  width: '2.7vh',
  height: '2.7vh',
  ml: '12px',
};
const disableButton = {
  bgcolor: '#2196f3 !important',
  color: '#fff !important',
  opacity: '0.5',
  height: '3vh',
  // minWidth: '3vw',
  maxWidth: '28px',
  fontSize: '1.5vh',
};
const shortButton = {
  height: '3vh',
  // minWidth: '3vw',
  maxWidth: '28px',
  fontSize: '1.5vh',
};
const Relay = ({ id, lable, btn, isDisable, ind, onBtnClick }) => {
  return (
    <ListItem sx={{ padding: '0rem 1rem', flex: 1 }} divider>
      <ListItemText sx={{ m: 0, fontSize: '2vh !important' }} primary={lable} />
      <Button
        onClick={() => onBtnClick(id)}
        disabled={isDisable && true}
        variant='contained'
        size='small'
        sx={isDisable ? disableButton : shortButton}>
        {btn === '1' ? 'STOP' : 'START'}
      </Button>
      <CircleIcon sx={circleStyle} htmlColor={ind === '1' ? '#00c853' : ''} />
    </ListItem>
  );
};

export default Relay;
