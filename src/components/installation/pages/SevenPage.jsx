/** @format */

import { TableBody } from '@mui/material';
import React from 'react';
import GaesText from '../GaesText';
const SevenPage = () => {
  return (
    <TableBody>
      <GaesText name='noSystems' lable='Number of Systems' />
      <GaesText name='schedule' lable='Schedule of Commissioning' f={true} />
      <GaesText name='checqueNo' lable='Payment Checque Number' />
      <GaesText name='paymentAmount' lable='Payment Amount' />
      <GaesText name='agreement' lable='Uploaded Agreement Forms' f={true} />
    </TableBody>
  );
};

export default SevenPage;
