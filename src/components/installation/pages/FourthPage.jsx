/** @format */

import { TableBody } from '@mui/material';
import React from 'react';
import RowText from '../RowText';

const ForthPage = () => {
  return (
    <TableBody>
      <RowText name='depositCheque' lable='Deposit cheque/payment' />
      <RowText name='equipmentSetting' lable='All Equipment Setting Completion 25%' />
      <RowText name='internalDuct' lable='Internal Duct Work Completion 25%' />
      <RowText name='exhaust' lable='Entry/ Exhaust System Completion 15%' />
      <RowText name='wiring' lable='Wiring Rough Installation Completion 15%' />
      <RowText name='finalPayment' lable='Final Payment After SecureMyAir Verification 20%' />
    </TableBody>
  );
};

export default ForthPage;
