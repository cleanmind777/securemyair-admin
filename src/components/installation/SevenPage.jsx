/** @format */

import { TableBody } from '@mui/material';
import React from 'react';
import RowFile from '../RowFile';
import RowText from '../RowText';

const SevenPage = () => {
  return (
    <TableBody>
      <RowText name='' lable='Number of Systems' />
      <RowFile name='' lable='Schedule of Commissioning' />
      <RowText name='' lable='Payment Checque Number' />
      <RowText name='' lable='Payment Amount' />
      <RowFile name='agreementCertification' lable='Uploaded Agreement Forms' />
    </TableBody>
  );
};

export default SevenPage;
