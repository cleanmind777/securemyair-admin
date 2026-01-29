/** @format */

import { Box, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { MachineContext } from '../../MachineContext';
import MyDialog from '../../dialogs/MyDialog';

const NewImg = () => {
  const [dialog, setDialog] = useState({ status: false, msg: '', title: '' });
  const { machineID } = useContext(MachineContext);
  const [isLoadin, setLoading] = useState(false);
  const [url, setUrl] = useState();
  const cancleToken = axios.CancelToken;
  const source = cancleToken.source();
  const getImg = async () => {
    setLoading(true);
    await axios
      .get(`operator/filterImg.php?api=${machineID}&name=inspectionPicBefore`, {
        cancelToken: source.cancelToken,
      })
      .then(res => {
        setLoading(false);
        res.data.res ? setUrl(`${axios.defaults.baseURL}operator/${res.data.res}`) : setUrl();
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    getImg();
    return () => {
      source.cancel();
    };
  }, [machineID]);
  return (
    <Box
      sx={{ flex: 1, border: '2px solid black', m: 0.5, borderRadius: 2, height: 'fit-content' }}>
      <Typography variant='h3' sx={{ marginBlock: 1 }} fontWeight='bold' color='rgba(0,0,0,0.9)'>
        Old Filter Picture
      </Typography>
      {isLoadin ? (
        <Typography
          sx={{ paddingBlock: 2, color: 'rgba(0,0,0,0.8)', borderTop: '2px solid black' }}>
          Loading...
        </Typography>
      ) : url ? (
        <img width='100%' src={url} />
      ) : (
        <Typography
          sx={{ paddingBlock: 2, color: 'rgba(0,0,0,0.8)', borderTop: '2px solid black' }}>
          Filter image is not uploaded for selected machine yet!
        </Typography>
      )}
      {/* <img width='100%' src='https://source.unsplash.com/random' /> */}
      {dialog.status && (
        <MyDialog
          title={dialog.title}
          des={dialog.msg}
          actions={[{ onClick: () => setDialog({ status: false }), color: 'primary', text: 'OK' }]}
        />
      )}
    </Box>
  );
};

export default NewImg;
